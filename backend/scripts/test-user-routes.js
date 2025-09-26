require('ts-node/register');
const http = require('http');

async function testUserRoutes() {
  console.log('🧪 Testando rotas de usuário...\n');

  try {
    // Test GET /api/users
    console.log('1️⃣ Testando GET /api/users...');
    const getUsersResponse = await makeRequest('GET', '/api/users');
    console.log(`   Status: ${getUsersResponse.status}`);
    console.log(`   Response:`, JSON.stringify(getUsersResponse.body, null, 2));
    console.log('');

    // Test POST /api/users
    console.log('2️⃣ Testando POST /api/users...');
    const createUserResponse = await makeRequest('POST', '/api/users', {
      Name: 'João Silva',
      Email: 'joao@example.com'
    });
    console.log(`   Status: ${createUserResponse.status}`);
    console.log(`   Response:`, JSON.stringify(createUserResponse.body, null, 2));
    console.log('');

    // Test validation error
    console.log('3️⃣ Testando erro de validação...');
    const validationErrorResponse = await makeRequest('POST', '/api/users', {
      Name: 'João Silva',
      // Missing Email
    });
    console.log(`   Status: ${validationErrorResponse.status}`);
    console.log(`   Response:`, JSON.stringify(validationErrorResponse.body, null, 2));
    console.log('');

    console.log('✅ Testes de usuário concluídos!');

  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
  }
}

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsedBody = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            body: parsedBody
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: body
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

testUserRoutes();
