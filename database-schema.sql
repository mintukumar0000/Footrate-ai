-- FootRate AI Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create the detailed foot analyses table
CREATE TABLE IF NOT EXISTS public.foot_analyses (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    overall_score DECIMAL(3,1) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 10),
    skin_score DECIMAL(3,1) NOT NULL CHECK (skin_score >= 0 AND skin_score <= 10),
    nail_score DECIMAL(3,1) NOT NULL CHECK (nail_score >= 0 AND nail_score <= 10),
    shape_score DECIMAL(3,1) NOT NULL CHECK (shape_score >= 0 AND shape_score <= 10),
    symmetry_score DECIMAL(3,1) NOT NULL CHECK (symmetry_score >= 0 AND symmetry_score <= 10),
    cleanliness_score DECIMAL(3,1) NOT NULL CHECK (cleanliness_score >= 0 AND cleanliness_score <= 10),
    detected_issues TEXT[] DEFAULT '{}',
    improvement_tips TEXT[] DEFAULT '{}',
    confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
    full_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keep the old table for backwards compatibility (optional)
CREATE TABLE IF NOT EXISTS public.foot_ratings (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
    analysis_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.foot_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foot_ratings ENABLE ROW LEVEL SECURITY;

-- Policies for foot_analyses
CREATE POLICY "Users can view their own analyses" ON public.foot_analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses" ON public.foot_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses" ON public.foot_analyses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses" ON public.foot_analyses
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for foot_ratings (legacy)
CREATE POLICY "Users can view their own ratings" ON public.foot_ratings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ratings" ON public.foot_ratings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" ON public.foot_ratings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" ON public.foot_ratings
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS foot_analyses_user_id_idx ON public.foot_analyses(user_id);
CREATE INDEX IF NOT EXISTS foot_analyses_created_at_idx ON public.foot_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS foot_analyses_overall_score_idx ON public.foot_analyses(overall_score DESC);

CREATE INDEX IF NOT EXISTS foot_ratings_user_id_idx ON public.foot_ratings(user_id);
CREATE INDEX IF NOT EXISTS foot_ratings_created_at_idx ON public.foot_ratings(created_at DESC);

-- Grant permissions to authenticated users
GRANT ALL ON public.foot_analyses TO authenticated;
GRANT USAGE ON SEQUENCE public.foot_analyses_id_seq TO authenticated;

GRANT ALL ON public.foot_ratings TO authenticated;
GRANT USAGE ON SEQUENCE public.foot_ratings_id_seq TO authenticated;

-- Create user_subscriptions table for subscription management
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_tier VARCHAR(10) NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  analyses_used_this_month INTEGER NOT NULL DEFAULT 0,
  monthly_limit INTEGER NOT NULL DEFAULT 3,
  billing_period_start DATE DEFAULT CURRENT_DATE,
  billing_period_end DATE DEFAULT (CURRENT_DATE + INTERVAL '1 month'),
  dodo_payment_id VARCHAR(255), -- For Dodo Payment integration
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'active', 'canceled', 'past_due')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS for user_subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_subscriptions
CREATE POLICY "Users can view their own subscription" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" ON public.user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to automatically create subscription on user signup
CREATE OR REPLACE FUNCTION public.create_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, subscription_tier, monthly_limit)
  VALUES (NEW.id, 'free', 3);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create subscription when user signs up
CREATE TRIGGER create_subscription_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_subscription();

-- Function to increment usage counter
CREATE OR REPLACE FUNCTION public.increment_analysis_usage(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.user_subscriptions
  SET 
    analyses_used_this_month = analyses_used_this_month + 1,
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset monthly usage counter
CREATE OR REPLACE FUNCTION public.reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE public.user_subscriptions
  SET 
    analyses_used_this_month = 0,
    billing_period_start = CURRENT_DATE,
    billing_period_end = CURRENT_DATE + INTERVAL '1 month',
    updated_at = NOW()
  WHERE billing_period_end <= CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for subscription management
CREATE INDEX IF NOT EXISTS user_subscriptions_user_id_idx ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS user_subscriptions_billing_period_idx ON public.user_subscriptions(billing_period_end);

-- Grant permissions for subscription table
GRANT ALL ON public.user_subscriptions TO authenticated;
GRANT USAGE ON SEQUENCE public.user_subscriptions_id_seq TO authenticated;
