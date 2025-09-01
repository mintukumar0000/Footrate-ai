# Real-Time Dodo Payment Tracking Guide

## 🔄 Complete Workflow with Real-Time Tracking

### 1. User Clicks "Upgrade to Pro"
**Location**: `src/components/PhotoUpload.tsx` or `src/components/UpgradePrompt.tsx`

**What happens**:
- User clicks upgrade button
- System calls `SubscriptionService.initiateDodoPayment()`
- Creates payment session with unique ID
- Stores pending payment data in localStorage

**Real-time tracking**:
```javascript
// Check localStorage for pending payments
const pendingPayment = localStorage.getItem('dodo_pending_payment');
const pendingUserId = localStorage.getItem('dodo_pending_user_id');
```

### 2. Payment Session Creation
**Location**: `api/create-payment-session.js`

**What happens**:
- Creates unique session ID
- Redirects to Dodo Payment checkout
- Logs payment session creation

**Real-time tracking**:
```bash
# Check Vercel logs for payment sessions
vercel logs --follow
```

### 3. User Completes Payment on Dodo Payment
**Location**: `https://checkout.dodopayments.com/buy/pdt_NjgiFrU6ivuwnagRbUPZc`

**What happens**:
- User enters payment details
- Dodo Payment processes $9 charge
- Payment is completed

**Real-time tracking**:
- Check your Dodo Payment dashboard: `https://app.dodopayments.com/home`
- You'll see new payments in real-time

### 4. User Redirected Back to Success Page
**Location**: `src/pages/PaymentSuccess.tsx`

**What happens**:
- Dodo Payment redirects to: `https://footrateai.vercel.app/payment/success?session=...&mode=production`
- System detects successful payment
- User account is upgraded to Pro

**Real-time tracking**:
```javascript
// Check user subscription status
const subscriptionStatus = await SubscriptionService.getSubscriptionStatus(userId);
console.log('User subscription:', subscriptionStatus);
```

### 5. Database Updates (Supabase)
**Location**: `src/lib/subscriptionService.ts`

**What happens**:
- Updates `user_subscriptions` table
- Sets `subscription_tier = 'pro'`
- Sets `monthly_limit = 50`
- Resets `analyses_used_this_month = 0`

**Real-time tracking**:
```sql
-- Check user subscriptions in real-time
SELECT * FROM user_subscriptions 
WHERE user_id = 'your-user-id' 
ORDER BY created_at DESC;

-- Check all Pro users
SELECT * FROM user_subscriptions 
WHERE subscription_tier = 'pro' 
ORDER BY updated_at DESC;
```

### 6. User Can Use Pro Features
**Location**: `src/components/PhotoUpload.tsx`

**What happens**:
- User can upload images
- System checks subscription status
- Allows 50 analyses per month
- Tracks usage in real-time

**Real-time tracking**:
```sql
-- Check user's current usage
SELECT analyses_used_this_month, monthly_limit 
FROM user_subscriptions 
WHERE user_id = 'your-user-id';
```

## 📊 Real-Time Monitoring Dashboard

### 1. Dodo Payment Dashboard
- **URL**: https://app.dodopayments.com/home
- **What you see**: All payments, revenue, customer data
- **Real-time**: Yes, updates immediately

### 2. Supabase Dashboard
- **URL**: https://supabase.com/dashboard/project/[your-project-id]
- **Tables to monitor**:
  - `user_subscriptions` - Pro user data
  - `foot_analyses` - Analysis usage
  - `subscription_history` - Payment history

### 3. Vercel Logs
```bash
# Real-time deployment logs
vercel logs --follow

# Check specific function logs
vercel logs --function=create-payment-session
```

### 4. Database Queries for Real-Time Monitoring

```sql
-- Get all Pro users
SELECT 
  us.user_id,
  us.subscription_tier,
  us.monthly_limit,
  us.analyses_used_this_month,
  us.created_at,
  us.updated_at
FROM user_subscriptions us
WHERE us.subscription_tier = 'pro'
ORDER BY us.updated_at DESC;

-- Get today's new Pro subscriptions
SELECT 
  us.user_id,
  us.created_at
FROM user_subscriptions us
WHERE us.subscription_tier = 'pro'
  AND DATE(us.created_at) = CURRENT_DATE;

-- Get usage statistics
SELECT 
  subscription_tier,
  COUNT(*) as user_count,
  AVG(analyses_used_this_month) as avg_usage
FROM user_subscriptions
GROUP BY subscription_tier;
```

## 🔍 How to Verify Everything is Working

### 1. Test the Complete Flow
1. **Sign up** a new user
2. **Click "Upgrade to Pro"**
3. **Complete payment** on Dodo Payment
4. **Check Supabase** - user should be Pro
5. **Test Pro features** - should have 50 analyses

### 2. Monitor Real-Time
```bash
# Watch Vercel logs
vercel logs --follow

# Check Supabase in real-time
# Go to Supabase dashboard and refresh
```

### 3. Verify Payment Processing
- **Dodo Payment Dashboard**: Shows payment received
- **Supabase**: User subscription updated
- **App**: User can use Pro features

## 📈 Key Metrics to Track

### 1. Revenue Metrics
- **Dodo Payment Dashboard**: Total revenue, payment count
- **Supabase**: Pro user count, subscription dates

### 2. Usage Metrics
- **Analyses used**: `analyses_used_this_month` in Supabase
- **User engagement**: How many Pro users are active

### 3. Conversion Metrics
- **Free to Pro conversion**: Track upgrade rate
- **Payment success rate**: Monitor failed payments

## 🚨 Alerts and Notifications

### 1. Failed Payments
- Monitor Dodo Payment dashboard for failed transactions
- Check Vercel logs for payment errors

### 2. Database Issues
- Monitor Supabase for subscription update failures
- Check user complaints about not getting Pro access

### 3. Usage Limits
- Monitor when users reach their 50 analysis limit
- Track upgrade prompts effectiveness

## ✅ Success Indicators

### 1. Payment Success
- ✅ User redirected to Dodo Payment checkout
- ✅ Payment completed on Dodo Payment
- ✅ User redirected back to success page
- ✅ User account upgraded to Pro in Supabase
- ✅ User can use 50 analyses per month

### 2. Real-Time Verification
- ✅ Dodo Payment dashboard shows new payment
- ✅ Supabase shows user as Pro subscriber
- ✅ User can immediately use Pro features
- ✅ Usage tracking works correctly

This workflow ensures complete real-time tracking of every step in the payment and upgrade process!
