# 🚀 Real Dodo Payment Integration Setup Guide

## 📋 Prerequisites

### 1. Dodo Payment Account Setup
- [ ] Create account at [Dodo Payment Dashboard](https://dashboard.dodopayments.com)
- [ ] Verify your business information
- [ ] Get your **Live API Keys** (not test keys)

### 2. Required Dodo Payment Information
```
✅ Secret Key: sk_live_...
✅ Public Key: pk_live_...
✅ Webhook Secret: whsec_...
✅ Product/Price IDs (if using products)
```

## 🔧 Step-by-Step Integration

### Step 1: Update Environment Variables

**In your `.env` file, replace the placeholder values:**

```bash
# 🔥 REAL DODO PAYMENT CREDENTIALS (PRODUCTION)
DODO_SECRET_KEY=sk_live_YOUR_ACTUAL_SECRET_KEY
DODO_PUBLIC_KEY=pk_live_YOUR_ACTUAL_PUBLIC_KEY
DODO_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_WEBHOOK_SECRET

# Production URLs
SITE_URL=https://footrateai.vercel.app

# Client-side (only public key - safe to expose)
VITE_DODO_PUBLIC_KEY=pk_live_YOUR_ACTUAL_PUBLIC_KEY
VITE_SITE_URL=https://footrateai.vercel.app

# Set to 'false' for production
VITE_DEMO_MODE=false
```

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy your app
vercel --prod

# Add environment variables to Vercel
vercel env add DODO_SECRET_KEY
vercel env add DODO_PUBLIC_KEY
vercel env add DODO_WEBHOOK_SECRET
vercel env add SITE_URL
```

### Step 3: Configure Dodo Payment Webhooks

1. **Go to Dodo Dashboard** → Webhooks
2. **Add new webhook endpoint:**
   ```
   URL: https://footrateai.vercel.app/api/webhooks/dodo-payment
   Events: 
   ✅ checkout.session.completed
   ✅ invoice.payment_succeeded
   ✅ customer.subscription.deleted
   ```
3. **Copy the webhook secret** and add to your environment variables

### Step 4: Test the Integration

1. **Deploy your app** with real credentials
2. **Set `VITE_DEMO_MODE=false`** in production
3. **Click "Upgrade to Pro"** on your live site
4. **Should redirect to real Dodo checkout**
5. **Complete a test payment** (use Dodo test cards)

## 🔒 Security Best Practices

### Environment Variables Security
- ✅ **Never commit** `.env` files to Git
- ✅ **Use different keys** for development/production
- ✅ **Verify webhook signatures** (implement in webhook handler)
- ✅ **Monitor payment logs** regularly

### Webhook Security
```javascript
// In /api/webhooks/dodo-payment.js
// TODO: Implement signature verification
const crypto = require('crypto');

function verifyDodoSignature(payload, signature, secret) {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(computedSignature, 'hex')
  );
}
```

## 🧪 Testing Checklist

### Demo Mode Testing (Development)
- [ ] `VITE_DEMO_MODE=true` → Shows demo success page
- [ ] No real charges occur
- [ ] All UI flows work correctly

### Production Mode Testing
- [ ] `VITE_DEMO_MODE=false` → Real Dodo checkout
- [ ] Test card payments work
- [ ] Webhooks update database correctly
- [ ] User subscription status updates

### Test Cards (Use these in Dodo test mode)
```
✅ Success: 4242 4242 4242 4242
❌ Declined: 4000 0000 0000 0002
🔄 3D Secure: 4000 0000 0000 3220
```

## 🎯 What Each File Does

### `/api/create-payment-session.js`
- Creates Dodo checkout sessions
- Handles demo/production modes
- Returns payment URLs

### `/api/webhooks/dodo-payment.js`
- Receives Dodo webhook events
- Updates Supabase when payments succeed
- Handles subscription lifecycle

### `/src/lib/subscriptionService.ts`
- Frontend payment initiation
- Demo mode detection
- Error handling and fallbacks

## 🚨 Common Issues & Solutions

### Issue: "Failed to initiate payment"
**Solution:** Check your API keys and webhook URLs

### Issue: Payments succeed but database not updated
**Solution:** Verify webhook is configured and receiving events

### Issue: Demo mode in production
**Solution:** Set `VITE_DEMO_MODE=false` and redeploy

## 📞 Support

If you encounter issues:
1. **Check Dodo Dashboard** → Logs for API errors
2. **Check Vercel Dashboard** → Functions for webhook errors  
3. **Check Supabase Dashboard** → Logs for database errors

## 🎉 You're Ready!

Once everything is configured:
- ✅ Real payments will be processed through Dodo
- ✅ Subscriptions will be managed automatically
- ✅ Users will get instant Pro access after payment
- ✅ Webhooks will keep everything in sync

**Happy monetizing! 💰**
