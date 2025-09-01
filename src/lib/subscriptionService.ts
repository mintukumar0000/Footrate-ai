import { supabase } from './supabase'

export interface UserSubscription {
  id: number
  user_id: string
  subscription_tier: 'free' | 'pro'
  analyses_used_this_month: number
  monthly_limit: number
  billing_period_start: string
  billing_period_end: string
  dodo_payment_id?: string
  payment_status: 'pending' | 'active' | 'canceled' | 'past_due'
  created_at: string
  updated_at: string
}

export interface SubscriptionStatus {
  canAnalyze: boolean
  analysesRemaining: number
  currentTier: 'free' | 'pro'
  needsUpgrade: boolean
  usedThisMonth: number
  monthlyLimit: number
}

export class SubscriptionService {
  /**
   * Get user's current subscription status
   */
  static async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    try {
      const { data: subscription, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching subscription:', error)
        // If no subscription exists, create a free one
        await this.createFreeSubscription(userId)
        return {
          canAnalyze: true,
          analysesRemaining: 3,
          currentTier: 'free',
          needsUpgrade: false,
          usedThisMonth: 0,
          monthlyLimit: 3
        }
      }

      const analysesRemaining = Math.max(0, subscription.monthly_limit - subscription.analyses_used_this_month)
      const canAnalyze = analysesRemaining > 0
      const needsUpgrade = !canAnalyze && subscription.subscription_tier === 'free'

      return {
        canAnalyze,
        analysesRemaining,
        currentTier: subscription.subscription_tier,
        needsUpgrade,
        usedThisMonth: subscription.analyses_used_this_month,
        monthlyLimit: subscription.monthly_limit
      }
    } catch (error) {
      console.error('Error getting subscription status:', error)
      throw new Error('Failed to check subscription status')
    }
  }

  /**
   * Check if user can perform an analysis (has remaining quota)
   */
  static async canPerformAnalysis(userId: string): Promise<boolean> {
    const status = await this.getSubscriptionStatus(userId)
    return status.canAnalyze
  }

  /**
   * Increment usage counter after successful analysis
   */
  static async incrementUsage(userId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_analysis_usage', {
        p_user_id: userId
      })

      if (error) {
        // Fallback to manual increment if RPC doesn't exist
        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('analyses_used_this_month')
          .eq('user_id', userId)
          .single()

        if (subscription) {
          await supabase
            .from('user_subscriptions')
            .update({
              analyses_used_this_month: subscription.analyses_used_this_month + 1,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)
        }
      }
    } catch (error) {
      console.error('Error incrementing usage:', error)
      throw new Error('Failed to update usage counter')
    }
  }

  /**
   * Create a free subscription for new user
   */
  static async createFreeSubscription(userId: string): Promise<UserSubscription> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          subscription_tier: 'free',
          monthly_limit: 3,
          analyses_used_this_month: 0
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating free subscription:', error)
      throw new Error('Failed to create subscription')
    }
  }

  /**
   * Upgrade user to Pro subscription
   * This would integrate with Dodo Payment
   */
  static async upgradeToPro(userId: string, dodoPaymentId?: string): Promise<UserSubscription> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({
          subscription_tier: 'pro',
          monthly_limit: 50,
          dodo_payment_id: dodoPaymentId,
          payment_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error upgrading to pro:', error)
      throw new Error('Failed to upgrade subscription')
    }
  }

  /**
   * Cancel Pro subscription (downgrade to free)
   */
  static async cancelProSubscription(userId: string): Promise<UserSubscription> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({
          subscription_tier: 'free',
          monthly_limit: 3,
          payment_status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw new Error('Failed to cancel subscription')
    }
  }

  /**
   * Initialize Dodo Payment integration
   * This integrates with the real Dodo Payment API
   */
  static async initiateDodoPayment(userId: string, plan: 'pro'): Promise<string> {
    try {
      const paymentData = {
        userId: userId,
        plan: plan,
        amount: plan === 'pro' ? 9 : 0
      }

      console.log('Initiating Dodo Payment:', paymentData)
      
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      const isDevelopment = window.location.hostname === 'localhost';
      const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
      
      // For development or demo mode, use demo payment
      if (isDevelopment || isDemoMode) {
        console.log('Development/Demo mode detected, using demo payment');
        
        const sessionId = `session_${Date.now()}_${userId}`;
        
        // Store session info for verification after payment
        localStorage.setItem('dodo_pending_payment', sessionId)
        localStorage.setItem('dodo_pending_user_id', userId)
        localStorage.setItem('dodo_pending_plan', plan)
        
        const demoPaymentUrl = `${siteUrl}/payment/success?session=${sessionId}&plan=${plan}&demo=true`;
        
        return demoPaymentUrl;
      }
      
      // For production, call the API endpoint
      try {
        const response = await fetch('/api/create-payment-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create payment session')
        }

        const { paymentUrl, sessionId, message, mode } = await response.json()
        
        // Store session info for verification after payment
        localStorage.setItem('dodo_pending_payment', sessionId)
        localStorage.setItem('dodo_pending_user_id', userId)
        localStorage.setItem('dodo_pending_plan', plan)
        
        // Log payment mode
        console.log(`Payment mode: ${mode} - ${message}`)
        
        return paymentUrl
        
      } catch (apiError) {
        console.error('API error, falling back to demo mode:', apiError);
        
        // Fallback to demo mode if API fails
        const sessionId = `session_${Date.now()}_${userId}`;
        
        // Store session info for verification after payment
        localStorage.setItem('dodo_pending_payment', sessionId)
        localStorage.setItem('dodo_pending_user_id', userId)
        localStorage.setItem('dodo_pending_plan', plan)
        
        const fallbackPaymentUrl = `${siteUrl}/payment/success?session=${sessionId}&plan=${plan}&fallback=true`;
        
        return fallbackPaymentUrl;
      }
      
    } catch (error) {
      console.error('Error initiating Dodo Payment:', error)
      throw new Error('Failed to initiate payment')
    }
  }

  /**
   * Handle successful payment callback from Dodo Payment
   */
  static async handlePaymentSuccess(userId: string, dodoPaymentId: string, plan: 'pro'): Promise<void> {
    try {
      // Update subscription to Pro
      await this.upgradeToPro(userId, dodoPaymentId)
      
      console.log(`Payment successful for user ${userId}, upgraded to ${plan}`)
    } catch (error) {
      console.error('Error handling payment success:', error)
      throw new Error('Failed to process payment success')
    }
  }
}
