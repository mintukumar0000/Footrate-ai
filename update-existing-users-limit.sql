-- Update existing free users from 5 to 3 monthly limit
-- Run this SQL in your Supabase SQL Editor to fix existing users

-- Update ALL free tier users to have 3 analyses instead of 5 (covers any edge cases)
UPDATE public.user_subscriptions 
SET 
  monthly_limit = 3,
  updated_at = NOW()
WHERE 
  subscription_tier = 'free' 
  AND monthly_limit != 3;

-- Also reset any usage counters that exceed the new limit
UPDATE public.user_subscriptions 
SET 
  analyses_used_this_month = LEAST(analyses_used_this_month, 3),
  updated_at = NOW()
WHERE 
  subscription_tier = 'free' 
  AND analyses_used_this_month > 3;

-- Verify the changes
SELECT 
  subscription_tier, 
  monthly_limit, 
  COUNT(*) as user_count,
  AVG(analyses_used_this_month) as avg_usage
FROM public.user_subscriptions 
GROUP BY subscription_tier, monthly_limit 
ORDER BY subscription_tier, monthly_limit;

-- Note: After running this, all free users will have 3 analyses per month
-- and any usage over 3 will be capped at 3.
