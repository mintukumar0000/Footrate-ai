# 📧 Complete Email & Subscription Management Setup Guide

## 🎯 Overview
Your FootRate AI now has comprehensive email confirmation, password reset, and subscription management features. Here's how to set everything up properly.

---

## 📧 Step 1: Configure SMTP Email Delivery

### **A. Enable Gmail SMTP in Supabase**

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/wgvvkgzyoydqjprlcplw
2. **Navigate to**: Authentication → Settings → SMTP Settings
3. **Click**: "Enable custom SMTP"
4. **Configure with these settings**:

```
Host: smtp.gmail.com
Port: 587
Username: heyquixy@gmail.com
Password: [Get Gmail App Password - see below]
Sender name: FootRate AI
Sender email: heyquixy@gmail.com
```

### **B. Get Gmail App Password**

1. **Go to**: https://myaccount.google.com/security
2. **Enable**: "2-Step Verification" (if not already on)
3. **Go to**: "App passwords" section
4. **Select**: Mail → Other (custom name)
5. **Enter name**: "FootRate AI Supabase"
6. **Copy**: The 16-character password generated
7. **Paste**: This password in the SMTP Password field above

### **C. Turn ON Email Confirmation**

1. **In Supabase**: Authentication → Settings → Sign In / Providers
2. **Find**: "Confirm email" setting
3. **Turn ON**: The toggle (should be green)
4. **Click**: "Save"

---

## 🗃️ Step 2: Run Enhanced Database Schema

### **Execute SQL in Supabase:**

1. **Go to**: https://supabase.com/dashboard/project/wgvvkgzyoydqjprlcplw/sql
2. **Copy and run** the contents of: `enhanced-database-schema.sql`
3. **Click**: "Run" to execute all the new tables and functions

### **What this adds:**
- ✅ Enhanced subscription tracking with cancellation support
- ✅ Password reset request logging
- ✅ Email verification tracking
- ✅ User profile management
- ✅ Subscription history auditing
- ✅ Automatic grace period handling

---

## 🔧 Step 3: Email Template Customization (Optional)

### **Customize Email Templates:**

1. **Go to**: Authentication → Email Templates in Supabase
2. **Available templates**:
   - **Confirm signup**: Welcome email with confirmation link
   - **Magic Link**: Passwordless login
   - **Change Email Address**: Email change confirmation
   - **Reset Password**: Password reset instructions

### **Template Variables Available:**
- `{{ .Email }}` - User's email
- `{{ .Token }}` - Verification/reset token
- `{{ .RedirectTo }}` - Redirect URL
- `{{ .SiteURL }}` - Your site URL
- `{{ .TokenHash }}` - Hashed token

---

## 🚀 Step 4: Test All Features

### **A. Test Email Confirmation**
1. **Go to**: https://footrateai.vercel.app
2. **Sign up** with a new email
3. **Check email** for confirmation link
4. **Click link** to confirm account
5. **Should redirect** to app dashboard

### **B. Test Password Reset**
1. **Go to**: https://footrateai.vercel.app
2. **Click**: "Forgot your password?" link
3. **Enter email** and submit
4. **Check email** for reset link
5. **Follow instructions** to reset password

### **C. Test Subscription Management**
1. **Sign up/in** to your account
2. **Use 3 free analyses** to hit limit
3. **Should see** upgrade prompt with cancellation info
4. **Test upgrade** flow (will use demo payment for now)

---

## 📊 Step 5: Monitor and Manage Users

### **Database Tables for Management:**

1. **user_subscriptions**: View all subscription data
2. **subscription_history**: Audit trail of all changes
3. **password_reset_requests**: Track password reset attempts
4. **email_verifications**: Monitor email verification status
5. **user_profiles**: Extended user information

### **Key SQL Queries:**

```sql
-- View all subscriptions
SELECT * FROM user_subscriptions ORDER BY created_at DESC;

-- View canceled subscriptions
SELECT * FROM user_subscriptions WHERE subscription_status = 'canceled';

-- View subscription history
SELECT * FROM subscription_history ORDER BY created_at DESC LIMIT 50;

-- View password reset requests
SELECT * FROM password_reset_requests ORDER BY requested_at DESC LIMIT 20;
```

---

## 🛡️ Step 6: Security Best Practices

### **A. Rate Limiting**
- Password reset: Max 5 requests per hour per email
- Email verification: Max 10 requests per day per user
- Account creation: Standard Supabase limits

### **B. Data Protection**
- All sensitive data encrypted in Supabase
- Password reset tokens expire in 1 hour
- Email verification tokens expire in 24 hours
- Grace periods for canceled subscriptions

### **C. Monitoring**
- All actions logged in subscription_history
- Failed attempts tracked
- User agent and IP logging for security

---

## 🔄 Step 7: Subscription Cancellation Workflow

### **How Cancellation Works:**

1. **User cancels**: Subscription marked as 'canceled'
2. **Grace period**: Continues until end of billing period
3. **Access maintained**: Full features during grace period
4. **Auto-downgrade**: Downgrades to free after grace period
5. **Reactivation**: Users can reactivate before grace period ends

### **Cancellation Reasons Tracked:**
- User requested
- Payment failed
- Terms violation
- Duplicate account
- Other (with custom reason)

---

## 📈 Step 8: Analytics and Reporting

### **Available Metrics:**
- Monthly active users
- Subscription conversion rates
- Cancellation reasons analysis
- Feature usage patterns
- Email delivery rates

### **Dashboard Queries:**
```sql
-- Monthly subscription stats
SELECT 
  subscription_tier,
  subscription_status,
  COUNT(*) as count
FROM user_subscriptions 
GROUP BY subscription_tier, subscription_status;

-- Recent subscription changes
SELECT 
  action,
  COUNT(*) as count,
  DATE(created_at) as date
FROM subscription_history 
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY action, DATE(created_at)
ORDER BY date DESC;
```

---

## ✅ Summary of New Features

### **🔐 Authentication Enhancements:**
- ✅ Email confirmation with SMTP
- ✅ Password reset functionality  
- ✅ Email verification resend
- ✅ Enhanced security tracking

### **💳 Subscription Management:**
- ✅ Cancellation with grace periods
- ✅ Reactivation capabilities
- ✅ Detailed history tracking
- ✅ Automatic downgrades
- ✅ Reason tracking for cancellations

### **📊 Data Management:**
- ✅ User profiles system
- ✅ Comprehensive audit trails
- ✅ Security event logging
- ✅ Analytics-ready data structure

### **🎨 UI Improvements:**
- ✅ "Forgot Password?" link in sign-in
- ✅ Password reset form with modern UI
- ✅ Email confirmation status
- ✅ Subscription status indicators

---

## 🚨 Troubleshooting

### **Email not sending?**
- Check Gmail App Password is correct
- Verify SMTP settings in Supabase
- Check spam/junk folders
- Ensure 2FA is enabled on Gmail

### **Database errors?**
- Run the SQL schema in correct order
- Check RLS policies are enabled
- Verify user permissions

### **Authentication issues?**
- Clear browser cache and cookies
- Check environment variables
- Verify Supabase project URL

---

**Your FootRate AI now has enterprise-level user and subscription management! 🚀**

**Main URL**: https://footrateai.vercel.app
**Admin Dashboard**: https://supabase.com/dashboard/project/wgvvkgzyoydqjprlcplw


