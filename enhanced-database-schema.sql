-- Enhanced FootRate AI Database Schema with Complete User Management
-- Run this in Supabase SQL Editor

-- Create enhanced user profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50),
  full_name VARCHAR(100),
  avatar_url TEXT,
  phone VARCHAR(20),
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(username)
);

-- Enhanced subscription tracking with cancellation support
ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS 
  subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'paused', 'expired'));

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS 
  canceled_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS 
  cancellation_reason TEXT;

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS 
  next_billing_date DATE;

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS 
  grace_period_end DATE;

-- Password reset tracking
CREATE TABLE IF NOT EXISTS public.password_reset_requests (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  reset_token VARCHAR(255) NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour'),
  used_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT
);

-- Subscription history for auditing
CREATE TABLE IF NOT EXISTS public.subscription_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL, -- 'created', 'upgraded', 'downgraded', 'canceled', 'renewed'
  previous_tier VARCHAR(10),
  new_tier VARCHAR(10),
  reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Email verification tracking
CREATE TABLE IF NOT EXISTS public.email_verifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  verification_token VARCHAR(255) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  attempts INTEGER DEFAULT 1,
  ip_address INET
);

-- Function to handle subscription cancellation
CREATE OR REPLACE FUNCTION public.cancel_subscription(
  p_user_id UUID,
  p_reason TEXT DEFAULT NULL,
  p_immediate BOOLEAN DEFAULT FALSE
)
RETURNS JSON AS $$
DECLARE
  v_subscription user_subscriptions%ROWTYPE;
  v_result JSON;
BEGIN
  -- Get current subscription
  SELECT * INTO v_subscription 
  FROM user_subscriptions 
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'No active subscription found');
  END IF;
  
  -- Update subscription status
  UPDATE user_subscriptions 
  SET 
    subscription_status = 'canceled',
    canceled_at = NOW(),
    cancellation_reason = p_reason,
    updated_at = NOW(),
    -- If immediate, expire now; otherwise at end of billing period
    billing_period_end = CASE 
      WHEN p_immediate THEN CURRENT_DATE 
      ELSE billing_period_end 
    END
  WHERE user_id = p_user_id;
  
  -- Log the cancellation
  INSERT INTO subscription_history (user_id, action, previous_tier, new_tier, reason)
  VALUES (p_user_id, 'canceled', v_subscription.subscription_tier, 'canceled', p_reason);
  
  RETURN json_build_object(
    'success', true, 
    'message', 'Subscription canceled successfully',
    'effective_date', CASE WHEN p_immediate THEN CURRENT_DATE ELSE v_subscription.billing_period_end END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle password reset requests
CREATE OR REPLACE FUNCTION public.request_password_reset(
  p_email VARCHAR(255),
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_reset_token VARCHAR(255);
BEGIN
  -- Find user by email
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = p_email AND email_confirmed_at IS NOT NULL;
  
  IF NOT FOUND THEN
    -- Don't reveal if email exists or not for security
    RETURN json_build_object('success', true, 'message', 'If the email exists, a reset link will be sent');
  END IF;
  
  -- Generate reset token
  v_reset_token := encode(gen_random_bytes(32), 'base64');
  
  -- Insert reset request
  INSERT INTO password_reset_requests (user_id, email, reset_token, ip_address, user_agent)
  VALUES (v_user_id, p_email, v_reset_token, p_ip_address, p_user_agent);
  
  -- Here you would typically trigger an email send
  -- For now, we'll return the token (in production, only send via email)
  RETURN json_build_object(
    'success', true, 
    'message', 'Password reset link sent to email',
    'reset_token', v_reset_token  -- Remove this in production
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to resend email verification
CREATE OR REPLACE FUNCTION public.resend_verification_email(
  p_user_id UUID,
  p_ip_address INET DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_user auth.users%ROWTYPE;
  v_verification_token VARCHAR(255);
BEGIN
  -- Get user details
  SELECT * INTO v_user 
  FROM auth.users 
  WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'User not found');
  END IF;
  
  IF v_user.email_confirmed_at IS NOT NULL THEN
    RETURN json_build_object('success', false, 'message', 'Email already verified');
  END IF;
  
  -- Generate verification token
  v_verification_token := encode(gen_random_bytes(32), 'base64');
  
  -- Insert verification request
  INSERT INTO email_verifications (user_id, email, verification_token, ip_address)
  VALUES (p_user_id, v_user.email, v_verification_token, p_ip_address)
  ON CONFLICT (user_id) DO UPDATE SET
    verification_token = EXCLUDED.verification_token,
    sent_at = NOW(),
    attempts = email_verifications.attempts + 1,
    expires_at = NOW() + INTERVAL '24 hours';
  
  RETURN json_build_object(
    'success', true, 
    'message', 'Verification email sent successfully'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for new tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscription history policies
CREATE POLICY "Users can view own subscription history" ON public.subscription_history
    FOR SELECT USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON public.subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_email ON public.password_reset_requests(email);
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON public.email_verifications(user_id);

COMMIT;


