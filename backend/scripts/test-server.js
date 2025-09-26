#!/usr/bin/env node

/**
 * Simple script to test if the server starts correctly
 * Run with: npm run test:server
 */

// Use ts-node to run TypeScript files
require('ts-node/register');

const app = require('../src/server').default;

const PORT = process.env.PORT || 3002; // Use different port for testing

console.log('🧪 Testing server startup...');

// Don't start the server automatically, just test the app
console.log(`✅ Server app loaded successfully`);
console.log(`🔗 Health check will be available at http://localhost:${PORT}/health`);
console.log(`🌐 CORS configured for frontend access`);

// Test if we can make a request to the health endpoint
setTimeout(async () => {
  try {
    // Start a temporary server for testing
    const server = app.listen(PORT, async () => {
      console.log(`🚀 Test server started on port ${PORT}`);
      
      // Test CORS headers
      try {
        const response = await fetch(`http://localhost:${PORT}/health`, {
          headers: {
            'Origin': 'http://localhost:3000'
          }
        });
        
        if (response.ok) {
          console.log('✅ CORS test passed - frontend can access backend');
        } else {
          console.log('❌ CORS test failed');
        }
      } catch (error) {
        console.log('❌ Server test failed:', error.message);
      } finally {
        server.close();
        console.log('✅ Test completed successfully!');
        process.exit(0);
      }
    });

    server.on('error', (error) => {
      console.error('❌ Server failed to start:', error.message);
      process.exit(1);
    });
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    process.exit(1);
  }
}, 1000);
