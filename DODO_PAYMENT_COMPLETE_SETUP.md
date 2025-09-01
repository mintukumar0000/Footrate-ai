# 💳 **Complete Dodo Payment Integration Guide**

## 🎯 **Overview**
Set up Dodo Payment for FootRate AI Pro subscriptions ($9/month for 50 AI analyses).

---

## 🏗️ **STEP 1: Dodo Payment Account Setup**

### **A. Create Dodo Payment Account**
1. **Visit**: https://dodo.com.ng (Nigeria) or your regional Dodo site
2. **Sign Up**: Business account
3. **Complete KYC**: Upload business documents
4. **Verify**: Wait for account approval (usually 24-48 hours)

### **B. Create FootRate AI Product**
1. **Login to Dodo Dashboard**
2. **Navigate**: Products → Create Product
3. **Product Details**:
   ```
   Product Name: FootRate AI Pro
   Price: ₦3,600 (or $9 USD)
   Description: AI-Powered Foot Analysis Pro Plan - 50 analyses per month
   Type: Subscription
   Billing Cycle: Monthly
   ```
4. **Save** and **copy the Product ID** (e.g., `prod_xxxxxxxxxxxxx`)

### **C. Get API Credentials**
1. **Navigate**: Settings → API Keys
2. **Copy these values**:
   ```
   Public Key: pk_live_xxxxxxxxxxxxx (or pk_test_ for testing)
   Secret Key: sk_live_xxxxxxxxxxxxx (or sk_test_ for testing)
   Merchant ID: mer_xxxxxxxxxxxxx
   ```
3. **Create Webhook**:
   - **URL**: `https://footrateai.vercel.app/api/webhooks/dodo`
   - **Events**: `payment.success`, `payment.failed`, `subscription.cancelled`
   - **Copy Webhook Secret**: `whsec_xxxxxxxxxxxxx`

---

## 🔧 **STEP 2: Add Environment Variables**

Add these to your Vercel environment variables:

<function_calls>
<invoke name="run_terminal_cmd">
<parameter name="command">vercel env add DODO_SECRET_KEY


