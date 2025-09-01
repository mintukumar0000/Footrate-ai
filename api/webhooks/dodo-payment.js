// Dodo Payment Webhook Handler for FootRate AI
// File: /api/webhooks/dodo-payment.js

import { supabase } from '../../src/lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify webhook signature (important for security)
    const signature = req.headers['dodo-signature'];
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET;
    
    if (!signature || !webhookSecret) {
      console.error('Missing webhook signature or secret');
      return res.status(400).json({ error: 'Invalid webhook' });
    }

    // TODO: Implement signature verification
    // const isValid = verifyDodoSignature(req.body, signature, webhookSecret);
    // if (!isValid) {
    //   return res.status(400).json({ error: 'Invalid signature' });
    // }

    const event = req.body;
    console.log('🔔 Dodo webhook received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        await handlePaymentSuccess(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handleSubscriptionPayment(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook failed' });
  }
}

async function handlePaymentSuccess(session) {
  try {
    const { userId, plan } = session.metadata;
    
    if (!userId || !plan) {
      console.error('Missing metadata in session:', session);
      return;
    }

    console.log(`✅ Payment successful for user ${userId}, upgrading to ${plan}`);

    // Update user subscription in Supabase
    const { data, error } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        subscription_tier: plan,
        monthly_limit: plan === 'pro' ? 50 : 3,
        analyses_used_this_month: 0,
        billing_period_start: new Date().toISOString(),
        billing_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        dodo_payment_id: session.id,
        payment_status: 'active',
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }

    console.log('✅ Subscription updated successfully:', data);
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

async function handleSubscriptionPayment(invoice) {
  try {
    const customerId = invoice.customer;
    console.log(`💰 Subscription payment succeeded for customer ${customerId}`);
    
    // Update payment status to active
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        payment_status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('dodo_payment_id', invoice.subscription);

    if (error) {
      console.error('Error updating subscription payment:', error);
      throw error;
    }

    console.log('✅ Subscription payment updated successfully');
  } catch (error) {
    console.error('Error handling subscription payment:', error);
    throw error;
  }
}

async function handleSubscriptionCancelled(subscription) {
  try {
    console.log(`❌ Subscription cancelled: ${subscription.id}`);
    
    // Update subscription status to cancelled
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        subscription_tier: 'free',
        monthly_limit: 3,
        payment_status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('dodo_payment_id', subscription.id);

    if (error) {
      console.error('Error updating cancelled subscription:', error);
      throw error;
    }

    console.log('✅ Subscription cancelled successfully');
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
    throw error;
  }
}
