const http = require('http');

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
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
          resolve({ status: res.statusCode, body: parsedBody });
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
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

async function runHistoryTests() {
  console.log('🧪 Testando rotas de history...\n');

  try {
    // Create history - success
    console.log('1️⃣ Testando POST /api/histories (sucesso)...');
    const createPayload = {
      IDUserFK: 1, // Assuming user with ID 1 exists
      IDClassroomFK: 1 // Assuming classroom with ID 1 exists
    };
    const createRes = await makeRequest('POST', '/api/histories', createPayload);
    console.log(`   Status: ${createRes.status}`);
    console.log('   Response:', JSON.stringify(createRes.body, null, 2));
    const createdId = createRes.body?.data?.IDHistory;
    console.log('');

    // Create history - validation error (invalid user)
    console.log('2️⃣ Testando POST /api/histories (usuário inválido)...');
    const invalidUserRes = await makeRequest('POST', '/api/histories', {
      ...createPayload,
      IDUserFK: 999
    });
    console.log(`   Status: ${invalidUserRes.status}`);
    console.log('   Response:', JSON.stringify(invalidUserRes.body, null, 2));
    console.log('');

    // Get all histories
    console.log('3️⃣ Testando GET /api/histories...');
    const listRes = await makeRequest('GET', '/api/histories');
    console.log(`   Status: ${listRes.status}`);
    console.log('   Response:', JSON.stringify(listRes.body, null, 2));
    console.log('');

    // Get all histories with filter
    console.log('4️⃣ Testando GET /api/histories?is_active=true...');
    const listFilteredRes = await makeRequest('GET', '/api/histories?is_active=true');
    console.log(`   Status: ${listFilteredRes.status}`);
    console.log('   Response:', JSON.stringify(listFilteredRes.body, null, 2));
    console.log('');

    if (createdId) {
      // Get history by ID
      console.log('5️⃣ Testando GET /api/histories/:id...');
      const getRes = await makeRequest('GET', `/api/histories/${createdId}`);
      console.log(`   Status: ${getRes.status}`);
      console.log('   Response:', JSON.stringify(getRes.body, null, 2));
      console.log('');

      // Update history - add return date
      console.log('6️⃣ Testando PUT /api/histories/:id...');
      const updateRes = await makeRequest('PUT', `/api/histories/${createdId}`, {
        ReturnDate: new Date().toISOString()
      });
      console.log(`   Status: ${updateRes.status}`);
      console.log('   Response:', JSON.stringify(updateRes.body, null, 2));
      console.log('');

    } else {
      console.log('⚠️ Não foi possível obter o ID criado para testes de GET/PUT.');
    }

    console.log('✅ Testes de history concluídos!');
  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
  }
}

runHistoryTests();
