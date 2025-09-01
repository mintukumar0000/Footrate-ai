-- Update existing free users from 5 to 3 analyses
-- Run this in your Supabase SQL Editor

-- Update free users who have monthly_limit = 5 to monthly_limit = 3
UPDATE public.user_subscriptions 
SET 
  monthly_limit = 3,
  updated_at = NOW()
WHERE subscription_tier = 'free' AND monthly_limit = 5;

-- Also cap analyses_used_this_month at 3 for free users
UPDATE public.user_subscriptions 
SET 
  analyses_used_this_month = LEAST(analyses_used_this_month, 3),
  updated_at = NOW()
WHERE subscription_tier = 'free' AND analyses_used_this_month > 3;

-- Show the results
SELECT 
  user_id,
  subscription_tier,
  monthly_limit,
  analyses_used_this_month,
  updated_at
FROM public.user_subscriptions 
WHERE subscription_tier = 'free'
ORDER BY updated_at DESC;
