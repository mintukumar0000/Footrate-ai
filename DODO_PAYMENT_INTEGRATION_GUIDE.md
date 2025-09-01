# 🎯 Complete Dodo Payment Integration Guide for FootRate AI

## 📋 **What I've Set Up For You**

✅ **Frontend Integration Ready**
- Updated `SubscriptionService.ts` to call your backend API
- Created `PaymentSuccess.tsx` and `PaymentCancelled.tsx` pages  
- Added proper routing in `App.tsx`
- Payment session tracking with localStorage

## 🚀 **Next Steps: Complete Integration**

### **Step 1: Dodo Payment Account Setup**

1. **Create Account**: Go to [Dodo Payment Dashboard](https://dodopayments.com)
2. **Get API Keys**:
   ```
   DODO_PUBLISHABLE_KEY=pk_live_xxxxx (for frontend)
   DODO_SECRET_KEY=sk_live_xxxxx (for backend)
   DODO_WEBHOOK_SECRET=whsec_xxxxx (for webhooks)
   ```

3. **Create Product**:
   ```
   Name: FootRate AI Pro Subscription
   Price: $9.00 USD
   Type: Monthly Recurring
   Description: 50 AI analyses + premium features
   ```

---

### **Step 2: Backend API Setup (YOU NEED TO CREATE THIS)**

Create these backend endpoints:

#### **A. `/api/create-payment-session` (POST)**
```javascript
app.post('/api/create-payment-session', async (req, res) => {
  try {
    const { userId, plan, amount } = req.body;
    
    // Create Dodo Payment session
    const session = await dodoPayment.checkout.sessions.create({
      customer_email: await getUserEmail(userId),
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'FootRate AI Pro' },
          unit_amount: amount * 100, // Convert to cents
          recurring: { interval: 'month' }
        },
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancelled`,
      metadata: { userId, plan }
    });
    
    res.json({ 
      paymentUrl: session.url,
      sessionId: session.id 
    });
  } catch (error) {
    res.status(500).json({ error: 'Payment failed' });
  }
});
```

#### **B. `/api/verify-payment/:sessionId` (GET)**
```javascript
app.get('/api/verify-payment/:sessionId', async (req, res) => {
  try {
    const session = await dodoPayment.checkout.sessions.retrieve(req.params.sessionId);
    
    if (session.payment_status === 'paid') {
      // Upgrade user to Pro in database
      await upgradeUserToPro(session.metadata.userId, session.subscription);
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});
```

#### **C. `/api/webhooks/dodo` (POST)**
```javascript
app.post('/api/webhooks/dodo', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['dodo-signature'];
  
  try {
    const event = dodoPayment.webhooks.constructEvent(req.body, sig, process.env.DODO_WEBHOOK_SECRET);
    
    switch (event.type) {
      case 'checkout.session.completed':
        await upgradeUserToPro(event.data.object.metadata.userId, event.data.object.subscription);
        break;
        
      case 'customer.subscription.deleted':
        await downgradeUserToFree(event.data.object.metadata.userId);
        break;
    }
    
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

---

### **Step 3: Database Functions**

You'll need these functions in your backend:

```javascript
async function upgradeUserToPro(userId, subscriptionId) {
  // Update user_subscriptions table
  await supabase
    .from('user_subscriptions')
    .update({
      subscription_tier: 'pro',
      monthly_limit: 50,
      dodo_payment_id: subscriptionId,
      payment_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);
}

async function downgradeUserToFree(userId) {
  await supabase
    .from('user_subscriptions')
    .update({
      subscription_tier: 'free',
      monthly_limit: 3,
      payment_status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);
}
```

---

### **Step 4: Environment Variables**

Add to your backend `.env`:
```env
DODO_PUBLISHABLE_KEY=pk_live_xxxxx
DODO_SECRET_KEY=sk_live_xxxxx
DODO_WEBHOOK_SECRET=whsec_xxxxx
FRONTEND_URL=http://localhost:8081
```

---

### **Step 5: Testing Flow**

1. **User clicks "Upgrade to Pro"** → Opens Dodo Payment checkout
2. **User completes payment** → Redirected to `/payment/success`
3. **Webhook fires** → Backend upgrades user automatically
4. **User sees Pro features** → Can use 50 analyses/month

---

### **Step 6: Webhook Configuration**

In Dodo Payment dashboard, set:
- **Webhook URL**: `https://your-domain.com/api/webhooks/dodo`
- **Events**: 
  - `checkout.session.completed`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

---

## 🎯 **What You Need to Do Next**

1. ✅ **Set up Dodo Payment account** and get API keys
2. ✅ **Create the backend API** (Node.js/Express recommended)
3. ✅ **Deploy your backend** and update the frontend API calls
4. ✅ **Configure webhooks** in Dodo Payment dashboard
5. ✅ **Test the complete flow** with Dodo Payment test mode

---

## 📝 **Send Me Your Dodo Payment Link**

Once you have:
- ✅ Dodo Payment product created
- ✅ Backend API deployed  
- ✅ Webhook configured

**Send me your payment link and I'll help you integrate it properly!**

The frontend is already prepared - we just need to connect it to your actual Dodo Payment backend API.
