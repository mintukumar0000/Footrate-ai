import { supabase } from './supabase';

export interface SubscriptionStatus {
  subscription_tier: 'free' | 'pro';
  analyses_used_this_month: number;
  monthly_limit: number;
  billing_period_start: string;
  billing_period_end: string;
  subscription_status: 'active' | 'canceled' | 'paused' | 'expired';
  canceled_at?: string;
  cancellation_reason?: string;
  next_billing_date?: string;
  grace_period_end?: string;
  canAnalyze: boolean;
  daysUntilReset: number;
  daysUntilExpiry?: number;
}

export interface SubscriptionHistory {
  id: string;
  action: string;
  previous_tier?: string;
  new_tier?: string;
  reason?: string;
  created_at: string;
}

export interface UserProfile {
  user_id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  created_at: string;
  updated_at: string;
}

export class EnhancedSubscriptionService {
  // Get detailed subscription status with cancellation info
  static async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Create new subscription if none exists
        const newSubscription = await this.createFreeSubscription(userId);
        return newSubscription;
      }

      const today = new Date();
      const billingEnd = new Date(data.billing_period_end);
      const daysUntilReset = Math.max(0, Math.ceil((billingEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
      
      let canAnalyze = data.analyses_used_this_month < data.monthly_limit;
      let daysUntilExpiry;

      // Handle canceled subscriptions
      if (data.subscription_status === 'canceled') {
        const graceEnd = data.grace_period_end ? new Date(data.grace_period_end) : billingEnd;
        daysUntilExpiry = Math.max(0, Math.ceil((graceEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
        
        // If still in grace period, allow usage
        if (today <= graceEnd) {
          canAnalyze = data.analyses_used_this_month < data.monthly_limit;
        } else {
          // Grace period expired, downgrade to free
          if (data.subscription_tier === 'pro') {
            await this.downgradeToFree(userId);
            return this.getSubscriptionStatus(userId);
          }
          canAnalyze = false;
        }
      }

      return {
        ...data,
        canAnalyze,
        daysUntilReset,
        daysUntilExpiry
      };
    } catch (error) {
      console.error('Error getting subscription status:', error);
      throw error;
    }
  }

  // Create free subscription with enhanced tracking
  static async createFreeSubscription(userId: string): Promise<SubscriptionStatus> {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    
    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        subscription_tier: 'free',
        monthly_limit: 3,
        billing_period_start: today.toISOString().split('T')[0],
        billing_period_end: nextMonth.toISOString().split('T')[0],
        subscription_status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    // Log subscription creation
    await this.logSubscriptionHistory(userId, 'created', undefined, 'free', 'Initial subscription');

    return {
      ...data,
      canAnalyze: true,
      daysUntilReset: 30,
    };
  }

  // Cancel subscription with reason tracking
  static async cancelSubscription(
    userId: string, 
    reason?: string, 
    immediate: boolean = false
  ): Promise<{ success: boolean; message: string; effective_date?: string }> {
    try {
      const currentStatus = await this.getSubscriptionStatus(userId);
      
      if (currentStatus.subscription_tier === 'free') {
        return { success: false, message: 'Cannot cancel free subscription' };
      }

      const today = new Date();
      const effectiveDate = immediate ? today : new Date(currentStatus.billing_period_end);
      
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          subscription_status: 'canceled',
          canceled_at: today.toISOString(),
          cancellation_reason: reason,
          grace_period_end: immediate ? today.toISOString().split('T')[0] : currentStatus.billing_period_end,
          updated_at: today.toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Log cancellation
      await this.logSubscriptionHistory(
        userId, 
        'canceled', 
        currentStatus.subscription_tier, 
        'canceled', 
        reason || 'User requested cancellation'
      );

      return {
        success: true,
        message: immediate 
          ? 'Subscription canceled immediately' 
          : 'Subscription will cancel at the end of your billing period',
        effective_date: effectiveDate.toISOString().split('T')[0]
      };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Downgrade to free tier
  static async downgradeToFree(userId: string): Promise<void> {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        subscription_tier: 'free',
        monthly_limit: 3,
        analyses_used_this_month: 0,
        subscription_status: 'active',
        billing_period_start: today.toISOString().split('T')[0],
        billing_period_end: nextMonth.toISOString().split('T')[0],
        canceled_at: null,
        cancellation_reason: null,
        grace_period_end: null,
        updated_at: today.toISOString()
      })
      .eq('user_id', userId);

    if (error) throw error;

    await this.logSubscriptionHistory(userId, 'downgraded', 'pro', 'free', 'Automatic downgrade after cancellation');
  }

  // Reactivate canceled subscription
  static async reactivateSubscription(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const currentStatus = await this.getSubscriptionStatus(userId);
      
      if (currentStatus.subscription_status !== 'canceled') {
        return { success: false, message: 'Subscription is not canceled' };
      }

      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          subscription_status: 'active',
          canceled_at: null,
          cancellation_reason: null,
          grace_period_end: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      await this.logSubscriptionHistory(userId, 'reactivated', 'canceled', currentStatus.subscription_tier, 'User reactivated subscription');

      return { success: true, message: 'Subscription reactivated successfully' };
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  }

  // Get subscription history
  static async getSubscriptionHistory(userId: string): Promise<SubscriptionHistory[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting subscription history:', error);
      return [];
    }
  }

  // Log subscription history
  static async logSubscriptionHistory(
    userId: string,
    action: string,
    previousTier?: string,
    newTier?: string,
    reason?: string,
    metadata?: any
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('subscription_history')
        .insert({
          user_id: userId,
          action,
          previous_tier: previousTier,
          new_tier: newTier,
          reason,
          metadata: metadata ? JSON.stringify(metadata) : null,
          created_by: userId
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging subscription history:', error);
      // Don't throw here as it's not critical
    }
  }

  // Get user profile
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Request password reset (enhanced tracking)
  static async requestPasswordReset(email: string, ipAddress?: string, userAgent?: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      // Log password reset request (if we have user access)
      const { data: userData } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', email)
        .single();

      if (userData) {
        await supabase
          .from('password_reset_requests')
          .insert({
            user_id: userData.id,
            email,
            reset_token: 'sent_via_supabase', // Placeholder since we don't have access to actual token
            ip_address: ipAddress,
            user_agent: userAgent
          });
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  }

  // Resend email verification
  static async resendVerificationEmail(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Get user email
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }

      if (userData.user.email_confirmed_at) {
        return { success: false, message: 'Email already verified' };
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userData.user.email!
      });

      if (error) throw error;

      // Log verification request
      await supabase
        .from('email_verifications')
        .insert({
          user_id: userId,
          email: userData.user.email!,
          verification_token: 'sent_via_supabase'
        });

      return { success: true, message: 'Verification email sent successfully' };
    } catch (error) {
      console.error('Error resending verification email:', error);
      throw error;
    }
  }

  // All existing methods from original SubscriptionService
  static async incrementUsage(userId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_analysis_usage', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error incrementing usage:', error);
      throw new Error('Failed to update usage count');
    }
  }

  static async upgradeSubscription(userId: string, plan: 'pro'): Promise<void> {
    const monthlyLimit = plan === 'pro' ? 50 : 3;
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        subscription_tier: plan,
        monthly_limit: monthlyLimit,
        analyses_used_this_month: 0,
        subscription_status: 'active',
        billing_period_start: today.toISOString().split('T')[0],
        billing_period_end: nextMonth.toISOString().split('T')[0],
        canceled_at: null,
        cancellation_reason: null,
        updated_at: today.toISOString()
      })
      .eq('user_id', userId);

    if (error) throw error;

    await this.logSubscriptionHistory(userId, 'upgraded', 'free', plan, 'User upgraded subscription');
  }

  static async initiateDodoPayment(userId: string, plan: 'pro'): Promise<string> {
    try {
      const paymentData = {
        userId,
        plan,
        amount: 9
      }

      const response = await fetch('/api/create-payment-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      })

      if (!response.ok) {
        throw new Error('Failed to create payment session')
      }

      const { paymentUrl, sessionId } = await response.json()
      
      localStorage.setItem('dodo_pending_payment', sessionId)
      
      return paymentUrl
      
    } catch (error) {
      console.error('Error initiating Dodo Payment:', error)
      throw new Error('Failed to initiate payment')
    }
  }

  static async handlePaymentSuccess(userId: string, sessionId: string, plan: 'pro'): Promise<void> {
    await this.upgradeSubscription(userId, plan);
    
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        dodo_payment_id: sessionId,
        payment_status: 'active'
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating payment status:', error);
    }
    
    localStorage.removeItem('dodo_pending_payment');
  }
}

// Export both services for backward compatibility
export { EnhancedSubscriptionService as SubscriptionService };


