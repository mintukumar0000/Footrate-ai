// Working Dodo Payment Integration for FootRate AI
// File: /api/create-payment-session.js

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, plan, amount, testMode } = req.body;

    // Validate input
    if (!userId || !plan || !amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, plan, amount' 
      });
    }

    // Create session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Creating payment session:', { userId, plan, amount, sessionId, testMode });
    
    // Check if test mode is enabled
    if (testMode === true || process.env.DODO_TEST_MODE === 'true') {
      console.log('🧪 Test mode enabled - creating test payment session');
      
      // Create a test success URL that immediately upgrades the user
      const testSuccessUrl = `${process.env.SITE_URL}/payment/success?` + 
        `session=${sessionId}&` +
        `plan=${plan}&` +
        `amount=${amount}&` +
        `userId=${userId}&` +
        `mode=test&` +
        `upgrade=true`;
      
      console.log('✅ Test payment session created:', testSuccessUrl);
      
      return res.status(200).json({
        paymentUrl: testSuccessUrl,
        sessionId: sessionId,
        message: 'Test mode - immediate upgrade without payment',
        mode: 'test',
        note: 'No real payment required in test mode'
      });
    }
    
    // 🔥 REAL DODO PAYMENT INTEGRATION
    try {
      console.log('🚀 Creating real Dodo payment session');
      
      // Use the actual Dodo Payment product URL with success/cancel redirects
      const dodoProductUrl = `https://checkout.dodopayments.com/buy/pdt_NjgiFrU6ivuwnagRbUPZc?` + 
        `quantity=1&` +
        `success_url=${encodeURIComponent(process.env.SITE_URL + '/payment/success?session=' + sessionId + '&plan=' + plan + '&mode=production')}&` +
        `cancel_url=${encodeURIComponent(process.env.SITE_URL + '/payment/cancelled?session=' + sessionId)}&` +
        `metadata=${encodeURIComponent(JSON.stringify({userId, plan, sessionId, app: 'footrate-ai'}))}`;
      
      console.log('✅ Real Dodo Payment URL created:', dodoProductUrl);
      
      return res.status(200).json({
        paymentUrl: dodoProductUrl,
        sessionId: sessionId,
        message: 'Real Dodo Payment checkout created successfully',
        mode: 'production',
        note: 'Using actual Dodo Payment product'
      });
      
    } catch (error) {
      console.error('❌ Dodo Payment error:', error);
      
      // Fallback to simulation if needed
      const fallbackUrl = `${process.env.SITE_URL}/payment/success?session=${sessionId}&plan=${plan}&mode=fallback`;
      
      return res.status(200).json({
        paymentUrl: fallbackUrl,
        sessionId: sessionId,
        message: 'Fallback to simulation due to error',
        mode: 'fallback',
        error: error.message
      });
    }

  } catch (error) {
    console.error('💥 Payment session creation error:', error);
    return res.status(500).json({ 
      error: 'Failed to create payment session',
      details: error.message 
    });
  }
}
