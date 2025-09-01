// Vercel serverless function for handling Dodo Payment webhooks
// File: /api/webhooks/dodo.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // You'll need to add this
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify webhook signature (implement according to Dodo Payment docs)
    const signature = req.headers['x-dodo-signature'];
    const rawBody = JSON.stringify(req.body);
    
    // TODO: Verify webhook signature with your webhook secret
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.DODO_WEBHOOK_SECRET)
    //   .update(rawBody)
    //   .digest('hex');
    
    // if (signature !== expectedSignature) {
    //   return res.status(400).json({ error: 'Invalid signature' });
    // }

    const { event, data } = req.body;

    switch (event) {
      case 'payment.success':
        await handlePaymentSuccess(data);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(data);
        break;
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(data);
        break;
      
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handlePaymentSuccess(paymentData) {
  try {
    const { customer_id, session_id, amount, metadata } = paymentData;
    const userId = metadata.user_id;
    const plan = metadata.plan;

    // Update user subscription in Supabase
    const { error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .update({
        subscription_tier: plan,
        monthly_limit: plan === 'pro' ? 50 : 3,
        analyses_used_this_month: 0,
        subscription_status: 'active',
        billing_period_start: new Date().toISOString().split('T')[0],
        billing_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dodo_payment_id: session_id,
        payment_status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (subscriptionError) {
      throw subscriptionError;
    }

    // Log the upgrade in subscription history
    const { error: historyError } = await supabase
      .from('subscription_history')
      .insert({
        user_id: userId,
        action: 'upgraded',
        previous_tier: 'free',
        new_tier: plan,
        reason: 'Payment successful via Dodo Payment',
        metadata: JSON.stringify({ session_id, amount }),
        created_by: userId
      });

    if (historyError) {
      console.error('Error logging subscription history:', historyError);
    }

    console.log(`Payment successful for user ${userId}, upgraded to ${plan}`);

  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

async function handlePaymentFailed(paymentData) {
  try {
    const { customer_id, session_id, reason } = paymentData;
    
    console.log(`Payment failed for session ${session_id}: ${reason}`);
    
    // Optionally log failed payment attempts
    // You might want to notify the user or retry payment
    
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleSubscriptionCancelled(subscriptionData) {
  try {
    const { customer_id, subscription_id, reason } = subscriptionData;
    
    // Find user by dodo_payment_id
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('dodo_payment_id', subscription_id)
      .single();

    if (error || !subscription) {
      throw new Error('Subscription not found');
    }

    // Cancel the subscription
    const { error: cancelError } = await supabase
      .from('user_subscriptions')
      .update({
        subscription_status: 'canceled',
        canceled_at: new Date().toISOString(),
        cancellation_reason: reason || 'Cancelled via Dodo Payment',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', subscription.user_id);

    if (cancelError) {
      throw cancelError;
    }

    console.log(`Subscription cancelled for user ${subscription.user_id}`);

  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}


