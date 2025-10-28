const http = require('http');

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
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

async function runClassroomTests() {
  console.log('🧪 Testando rotas de classroom...\n');

  try {
    // Create classroom - success
    console.log('1️⃣ Testando POST /api/classrooms (sucesso)...');
    const createPayload = {
      Name: 'Sala 101',
      Responsible: 'Prof. Maria',
      Description: 'Sala de aula principal',
      State: 'Disponivel',
      SecretaryNote: 'Pronta para uso',
      Equipment: 'Projetor, Quadro, Computador',
      Capacity: 30
    };
    const createRes = await makeRequest('POST', '/api/classrooms', createPayload);
    console.log(`   Status: ${createRes.status}`);
    console.log('   Response:', JSON.stringify(createRes.body, null, 2));
    const createdId = createRes.body?.data?.IDClassroom;
    console.log('');

    // Create classroom - validation error (invalid state)
    console.log('2️⃣ Testando POST /api/classrooms (estado inválido)...');
    const invalidStateRes = await makeRequest('POST', '/api/classrooms', {
      ...createPayload,
      Name: 'Sala 102',
      State: 'Em manutenção'
    });
    console.log(`   Status: ${invalidStateRes.status}`);
    console.log('   Response:', JSON.stringify(invalidStateRes.body, null, 2));
    console.log('');

    // Create classroom - validation error (invalid capacity)
    console.log('3️⃣ Testando POST /api/classrooms (capacidade inválida)...');
    const invalidCapacityRes = await makeRequest('POST', '/api/classrooms', {
      ...createPayload,
      Name: 'Sala 103',
      Capacity: -5
    });
    console.log(`   Status: ${invalidCapacityRes.status}`);
    console.log('   Response:', JSON.stringify(invalidCapacityRes.body, null, 2));
    console.log('');

    // Get all classrooms
    console.log('4️⃣ Testando GET /api/classrooms...');
    const listRes = await makeRequest('GET', '/api/classrooms');
    console.log(`   Status: ${listRes.status}`);
    console.log('   Response:', JSON.stringify(listRes.body, null, 2));
    console.log('');

    // Get classroom by ID
    if (createdId) {
      console.log('5️⃣ Testando GET /api/classrooms/:id...');
      const getRes = await makeRequest('GET', `/api/classrooms/${createdId}`);
      console.log(`   Status: ${getRes.status}`);
      console.log('   Response:', JSON.stringify(getRes.body, null, 2));
      console.log('');

      // Update classroom - change state and capacity
      console.log('6️⃣ Testando PUT /api/classrooms/:id...');
      const updateRes = await makeRequest('PUT', `/api/classrooms/${createdId}`, {
        State: 'Em uso',
        Capacity: 35
      });
      console.log(`   Status: ${updateRes.status}`);
      console.log('   Response:', JSON.stringify(updateRes.body, null, 2));
      console.log('');

      // Delete classroom
      console.log('7️⃣ Testando DELETE /api/classrooms/:id...');
      const deleteRes = await makeRequest('DELETE', `/api/classrooms/${createdId}`);
      console.log(`   Status: ${deleteRes.status}`);
      console.log('   Response:', JSON.stringify(deleteRes.body, null, 2));
      console.log('');
    } else {
      console.log('⚠️ Não foi possível obter o ID criado para testes de GET/PUT/DELETE.');
    }

    console.log('✅ Testes de classroom concluídos!');
  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
  }
}

runClassroomTests();








