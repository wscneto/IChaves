const axios = require('axios');

async function testPingService() {
  console.log('🧪 Testing Ping Service...\n');

  const baseUrl = process.env.TEST_URL || 'http://localhost:3001';
  
  try {
    // Test 1: Health check endpoint
    console.log('1️⃣ Testing health check endpoint...');
    const healthResponse = await axios.get(`${baseUrl}/health`);
    console.log(`✅ Health check: ${healthResponse.status}`);
    console.log(`   Response:`, JSON.stringify(healthResponse.data, null, 2));
    
    // Test 2: Ping service status
    console.log('\n2️⃣ Checking ping service status...');
    if (healthResponse.data.pingService) {
      console.log(`✅ Ping service status:`, JSON.stringify(healthResponse.data.pingService, null, 2));
    } else {
      console.log('⚠️ Ping service status not found in response');
    }
    
    // Test 3: Root endpoint
    console.log('\n3️⃣ Testing root endpoint...');
    const rootResponse = await axios.get(baseUrl);
    console.log(`✅ Root endpoint: ${rootResponse.status}`);
    console.log(`   Message: ${rootResponse.data.message}`);
    
    console.log('\n🎉 All tests passed!');
    console.log('\n📝 Note: The ping service will only run in production mode.');
    console.log('   To test the ping service locally, set NODE_ENV=production');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running: npm run dev');
    }
    process.exit(1);
  }
}

// Run tests
testPingService();
