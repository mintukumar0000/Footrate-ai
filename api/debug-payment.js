// Debug endpoint for Dodo Payment integration
// File: /api/debug-payment.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const timestamp = new Date().toISOString();
  
  // Check environment variables
  const environment = {
    DODO_SECRET_KEY: process.env.DODO_SECRET_KEY ? '✅ Set' : '❌ Missing',
    DODO_PUBLIC_KEY: process.env.DODO_PUBLIC_KEY ? '✅ Set' : '❌ Missing',
    DODO_PRODUCT_ID: process.env.DODO_PRODUCT_ID ? '✅ Set' : '❌ Missing',
    SITE_URL: process.env.SITE_URL ? '✅ Set' : '❌ Missing',
    hasSecretKey: !!process.env.DODO_SECRET_KEY,
    secretKeyLength: process.env.DODO_SECRET_KEY ? process.env.DODO_SECRET_KEY.length : 0
  };

  // Test Dodo Payment API endpoints (correct domains)
  const apiEndpoints = [
    'https://api.dodopayments.com/v1/checkout/sessions',
    'https://api.dodopayments.com/v1/payments',
    'https://api.dodopayments.com/v1/health',
    'https://app.dodopayments.com/api/v1/checkout/sessions'
  ];

  const apiTest = {
    status: '❌ All endpoints failed',
    triedEndpoints: apiEndpoints,
    lastError: '',
    message: ''
  };

  for (const endpoint of apiEndpoints) {
    try {
      console.log(`Testing endpoint: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.DODO_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log(`Endpoint ${endpoint} response:`, response.status);
      
      if (response.ok) {
        apiTest.status = '✅ Endpoint accessible';
        apiTest.workingEndpoint = endpoint;
        apiTest.message = `Successfully connected to ${endpoint}`;
        break;
      } else {
        const errorText = await response.text();
        console.log(`Endpoint ${endpoint} error:`, errorText);
        apiTest.lastError = `${endpoint}: ${response.status} - ${errorText}`;
      }
    } catch (error) {
      console.log(`Endpoint ${endpoint} failed:`, error.message);
      apiTest.lastError = `${endpoint}: ${error.message}`;
    }
  }

  // Test dashboard accessibility
  let dashboardTest = '❌ Dashboard not accessible';
  try {
    const dashboardResponse = await fetch('https://app.dodopayments.com', {
      method: 'GET',
      timeout: 10000
    });
    
    if (dashboardResponse.ok) {
      dashboardTest = '✅ Dashboard accessible';
    } else {
      dashboardTest = `❌ Dashboard error: ${dashboardResponse.status}`;
    }
  } catch (error) {
    dashboardTest = `❌ Dashboard error: ${error.message}`;
  }

  const result = {
    timestamp,
    environment,
    apiTest,
    dashboardTest,
    message: 'Debug information for Dodo Payment integration'
  };

  console.log('Debug result:', result);
  
  return res.status(200).json(result);
}
