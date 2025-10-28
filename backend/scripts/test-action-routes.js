/**
 * Test script for Action routes
 * Tests all action endpoints with sample data
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Sample test data
const testData = {
  classroom: {
    IDClassroomFK: 1
  },
  user: {
    studentID: 1,
    adminID: 2,
    targetStudentID: 3
  }
};

// Mock user data (in real implementation, this would come from authentication)
const mockUsers = {
  student: {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    role: 'student'
  },
  admin: {
    id: '2',
    name: 'Maria Admin',
    email: 'maria@example.com',
    role: 'admin'
  }
};

// Helper function to make requests
async function makeRequest(method, endpoint, data = null, user = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    // Mock authentication by adding user to request
    if (user) {
      config.headers['X-User-ID'] = user.id;
      config.headers['X-User-Role'] = user.role;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

// Test functions
async function testReservarAction() {
  console.log('\n=== Testing RESERVAR Action ===');
  
  const data = {
    IDClassroomFK: testData.classroom.IDClassroomFK,
    Notes: 'Reserving key for project work'
  };

  try {
    const result = await makeRequest('POST', '/actions/reservar', data, mockUsers.student);
    console.log('✅ Reservar action successful:', result);
  } catch (error) {
    console.log('❌ Reservar action failed:', error.response?.data || error.message);
  }
}

async function testReservarActionErrors() {
  console.log('\n=== Testing RESERVAR Action Error Scenarios ===');
  
  // Test with invalid classroom ID
  console.log('\n--- Testing with invalid classroom ID ---');
  try {
    const data = { IDClassroomFK: -1, Notes: 'Test' };
    await makeRequest('POST', '/actions/reservar', data, mockUsers.student);
  } catch (error) {
    console.log('✅ Invalid classroom ID error caught:', error.response?.data?.error?.message);
  }

  // Test with missing classroom ID
  console.log('\n--- Testing with missing classroom ID ---');
  try {
    const data = { Notes: 'Test' };
    await makeRequest('POST', '/actions/reservar', data, mockUsers.student);
  } catch (error) {
    console.log('✅ Missing classroom ID error caught:', error.response?.data?.error?.message);
  }

  // Test with admin role (should fail)
  console.log('\n--- Testing with admin role (should fail) ---');
  try {
    const data = { IDClassroomFK: testData.classroom.IDClassroomFK, Notes: 'Test' };
    await makeRequest('POST', '/actions/reservar', data, mockUsers.admin);
  } catch (error) {
    console.log('✅ Admin role error caught:', error.response?.data?.error?.message);
  }

  // Test with invalid notes length
  console.log('\n--- Testing with invalid notes length ---');
  try {
    const data = { 
      IDClassroomFK: testData.classroom.IDClassroomFK, 
      Notes: 'A'.repeat(501) // Too long
    };
    await makeRequest('POST', '/actions/reservar', data, mockUsers.student);
  } catch (error) {
    console.log('✅ Invalid notes length error caught:', error.response?.data?.error?.message);
  }
}

async function testTrocarAction() {
  console.log('\n=== Testing TROCAR Action ===');
  
  const data = {
    IDClassroomFK: testData.classroom.IDClassroomFK,
    TargetUserID: testData.user.targetStudentID,
    Notes: 'Transferring key to another student'
  };

  try {
    const result = await makeRequest('POST', '/actions/trocar', data, mockUsers.student);
    console.log('✅ Trocar action successful:', result);
  } catch (error) {
    console.log('❌ Trocar action failed:', error.response?.data || error.message);
  }
}

async function testDevolverAction() {
  console.log('\n=== Testing DEVOLVER Action ===');
  
  const data = {
    IDClassroomFK: testData.classroom.IDClassroomFK,
    Notes: 'Returning key to administration'
  };

  try {
    const result = await makeRequest('POST', '/actions/devolver', data, mockUsers.student);
    console.log('✅ Devolver action successful:', result);
  } catch (error) {
    console.log('❌ Devolver action failed:', error.response?.data || error.message);
  }
}

async function testSolicitarAction() {
  console.log('\n=== Testing SOLICITAR Action ===');
  
  const data = {
    IDClassroomFK: testData.classroom.IDClassroomFK,
    TargetUserID: testData.user.studentID,
    Notes: 'Admin assigning key to student'
  };

  try {
    const result = await makeRequest('POST', '/actions/solicitar', data, mockUsers.admin);
    console.log('✅ Solicitar action successful:', result);
  } catch (error) {
    console.log('❌ Solicitar action failed:', error.response?.data || error.message);
  }
}

async function testSuspenderAction() {
  console.log('\n=== Testing SUSPENDER Action ===');
  
  const data = {
    IDClassroomFK: testData.classroom.IDClassroomFK,
    Reason: 'Maintenance required',
    Notes: 'Suspending classroom for maintenance'
  };

  try {
    const result = await makeRequest('POST', '/actions/suspender', data, mockUsers.admin);
    console.log('✅ Suspender action successful:', result);
  } catch (error) {
    console.log('❌ Suspender action failed:', error.response?.data || error.message);
  }
}

async function testSuspenderActionErrors() {
  console.log('\n=== Testing SUSPENDER Action Error Scenarios ===');
  
  // Test with student role (should fail)
  console.log('\n--- Testing with student role (should fail) ---');
  try {
    const data = { 
      IDClassroomFK: testData.classroom.IDClassroomFK, 
      Reason: 'Test reason',
      Notes: 'Test'
    };
    await makeRequest('POST', '/actions/suspender', data, mockUsers.student);
  } catch (error) {
    console.log('✅ Student role error caught:', error.response?.data?.error?.message);
  }

  // Test with missing reason
  console.log('\n--- Testing with missing reason ---');
  try {
    const data = { 
      IDClassroomFK: testData.classroom.IDClassroomFK, 
      Notes: 'Test'
    };
    await makeRequest('POST', '/actions/suspender', data, mockUsers.admin);
  } catch (error) {
    console.log('✅ Missing reason error caught:', error.response?.data?.error?.message);
  }

  // Test with short reason
  console.log('\n--- Testing with short reason ---');
  try {
    const data = { 
      IDClassroomFK: testData.classroom.IDClassroomFK, 
      Reason: 'Hi', // Too short
      Notes: 'Test'
    };
    await makeRequest('POST', '/actions/suspender', data, mockUsers.admin);
  } catch (error) {
    console.log('✅ Short reason error caught:', error.response?.data?.error?.message);
  }

  // Test with long reason
  console.log('\n--- Testing with long reason ---');
  try {
    const data = { 
      IDClassroomFK: testData.classroom.IDClassroomFK, 
      Reason: 'A'.repeat(201), // Too long
      Notes: 'Test'
    };
    await makeRequest('POST', '/actions/suspender', data, mockUsers.admin);
  } catch (error) {
    console.log('✅ Long reason error caught:', error.response?.data?.error?.message);
  }
}

async function testLiberarAction() {
  console.log('\n=== Testing LIBERAR Action ===');
  
  const data = {
    IDClassroomFK: testData.classroom.IDClassroomFK,
    Notes: 'Releasing classroom after maintenance'
  };

  try {
    const result = await makeRequest('POST', '/actions/liberar', data, mockUsers.admin);
    console.log('✅ Liberar action successful:', result);
  } catch (error) {
    console.log('❌ Liberar action failed:', error.response?.data || error.message);
  }
}

async function testGetPermissions() {
  console.log('\n=== Testing GET Permissions ===');
  
  try {
    const studentPermissions = await makeRequest('GET', '/actions/permissions', null, mockUsers.student);
    console.log('✅ Student permissions:', studentPermissions);
    
    const adminPermissions = await makeRequest('GET', '/actions/permissions', null, mockUsers.admin);
    console.log('✅ Admin permissions:', adminPermissions);
  } catch (error) {
    console.log('❌ Get permissions failed:', error.response?.data || error.message);
  }
}

async function testGetClassroomStateValidation() {
  console.log('\n=== Testing GET Classroom State Validation ===');
  
  try {
    const result = await makeRequest('GET', `/actions/classroom/${testData.classroom.IDClassroomFK}/state`, null, mockUsers.student);
    console.log('✅ Classroom state validation:', result);
  } catch (error) {
    console.log('❌ Get classroom state validation failed:', error.response?.data || error.message);
  }
}

async function testGetUserPermissions() {
  console.log('\n=== Testing GET User Permissions ===');
  
  try {
    const result = await makeRequest('GET', `/actions/user/${testData.user.studentID}/permissions`, null, mockUsers.student);
    console.log('✅ User permissions:', result);
  } catch (error) {
    console.log('❌ Get user permissions failed:', error.response?.data || error.message);
  }
}

// Integration tests
async function testCompleteWorkflow() {
  console.log('\n=== Testing Complete Workflow ===');
  
  try {
    // 1. Admin suspends classroom
    console.log('\n--- Step 1: Admin suspends classroom ---');
    const suspendData = {
      IDClassroomFK: testData.classroom.IDClassroomFK,
      Reason: 'Scheduled maintenance',
      Notes: 'Testing complete workflow'
    };
    await makeRequest('POST', '/actions/suspender', suspendData, mockUsers.admin);
    console.log('✅ Classroom suspended successfully');

    // 2. Admin releases classroom
    console.log('\n--- Step 2: Admin releases classroom ---');
    const releaseData = {
      IDClassroomFK: testData.classroom.IDClassroomFK,
      Notes: 'Maintenance completed'
    };
    await makeRequest('POST', '/actions/liberar', releaseData, mockUsers.admin);
    console.log('✅ Classroom released successfully');

    // 3. Student reserves classroom
    console.log('\n--- Step 3: Student reserves classroom ---');
    const reserveData = {
      IDClassroomFK: testData.classroom.IDClassroomFK,
      Notes: 'Project work'
    };
    await makeRequest('POST', '/actions/reservar', reserveData, mockUsers.student);
    console.log('✅ Classroom reserved successfully');

    // 4. Student transfers to another student
    console.log('\n--- Step 4: Student transfers to another student ---');
    const transferData = {
      IDClassroomFK: testData.classroom.IDClassroomFK,
      TargetUserID: testData.user.targetStudentID,
      Notes: 'Transferring responsibility'
    };
    await makeRequest('POST', '/actions/trocar', transferData, mockUsers.student);
    console.log('✅ Classroom transferred successfully');

    // 5. Student returns classroom
    console.log('\n--- Step 5: Student returns classroom ---');
    const returnData = {
      IDClassroomFK: testData.classroom.IDClassroomFK,
      Notes: 'Work completed'
    };
    await makeRequest('POST', '/actions/devolver', returnData, mockUsers.student);
    console.log('✅ Classroom returned successfully');

    console.log('\n🎉 Complete workflow test passed!');
  } catch (error) {
    console.log('❌ Complete workflow test failed:', error.response?.data || error.message);
  }
}

async function testErrorScenarios() {
  console.log('\n=== Testing Error Scenarios ===');
  
  // Test all error scenarios
  await testReservarActionErrors();
  await testSuspenderActionErrors();
  
  // Test invalid action type
  console.log('\n--- Testing invalid action type ---');
  try {
    await makeRequest('POST', '/actions/invalid', {}, mockUsers.student);
  } catch (error) {
    console.log('✅ Invalid action type error caught:', error.response?.data?.error?.message);
  }

  // Test missing authentication
  console.log('\n--- Testing missing authentication ---');
  try {
    await makeRequest('POST', '/actions/reservar', { IDClassroomFK: 1 }, null);
  } catch (error) {
    console.log('✅ Missing authentication error caught:', error.response?.data?.error?.message);
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting Action Routes Tests...');
  console.log('Make sure the server is running on http://localhost:3000');
  
  try {
    // Test utility endpoints first
    await testGetPermissions();
    await testGetClassroomStateValidation();
    await testGetUserPermissions();
    
    // Test action endpoints
    await testReservarAction();
    await testTrocarAction();
    await testDevolverAction();
    await testSolicitarAction();
    await testSuspenderAction();
    await testLiberarAction();
    
    // Test error scenarios
    await testErrorScenarios();
    
    // Test complete workflow
    await testCompleteWorkflow();
    
    console.log('\n🎉 All tests completed!');
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testReservarAction,
  testTrocarAction,
  testDevolverAction,
  testSolicitarAction,
  testSuspenderAction,
  testLiberarAction,
  testGetPermissions,
  testGetClassroomStateValidation,
  testGetUserPermissions
};
