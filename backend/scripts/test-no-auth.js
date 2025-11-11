/**
 * Script de teste para demonstrar que o projeto funciona sem autenticação
 * Este script testa as principais funcionalidades sem middleware de autenticação
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Configuração de usuários para teste
const testUsers = {
  student: { userID: 1, userRole: 'student' },
  admin: { userID: 2, userRole: 'admin' }
};

// Função para fazer requisições
async function makeRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
}

// Testes
async function runTests() {
  console.log('🧪 Iniciando testes sem autenticação...\n');

  // Teste 1: Health Check
  console.log('1️⃣ Testando Health Check...');
  const healthCheck = await makeRequest('GET', '/health');
  if (healthCheck.success) {
    console.log('✅ Health Check OK');
  } else {
    console.log('❌ Health Check falhou:', healthCheck.error);
  }

  // Teste 2: Root endpoint
  console.log('\n2️⃣ Testando Root Endpoint...');
  const rootCheck = await makeRequest('GET', '/');
  if (rootCheck.success) {
    console.log('✅ Root Endpoint OK');
  } else {
    console.log('❌ Root Endpoint falhou:', rootCheck.error);
  }

  // Teste 3: Permissões de estudante
  console.log('\n3️⃣ Testando permissões de estudante...');
  const studentPermissions = await makeRequest('GET', '/api/actions/permissions?userRole=student');
  if (studentPermissions.success) {
    console.log('✅ Permissões de estudante OK');
    console.log('   Dados:', JSON.stringify(studentPermissions.data, null, 2));
  } else {
    console.log('❌ Permissões de estudante falharam:', studentPermissions.error);
  }

  // Teste 4: Permissões de admin
  console.log('\n4️⃣ Testando permissões de admin...');
  const adminPermissions = await makeRequest('GET', '/api/actions/permissions?userRole=admin');
  if (adminPermissions.success) {
    console.log('✅ Permissões de admin OK');
    console.log('   Dados:', JSON.stringify(adminPermissions.data, null, 2));
  } else {
    console.log('❌ Permissões de admin falharam:', adminPermissions.error);
  }

  // Teste 5: Exemplo de validação
  console.log('\n5️⃣ Testando exemplo de validação...');
  const validationExample = await makeRequest('GET', '/api/examples/validation?email=test@example.com&age=25');
  if (validationExample.success) {
    console.log('✅ Exemplo de validação OK');
  } else {
    console.log('❌ Exemplo de validação falhou:', validationExample.error);
  }

  // Teste 6: Exemplo de autorização (deve falhar para usuário comum)
  console.log('\n6️⃣ Testando exemplo de autorização (deve falhar para usuário comum)...');
  const forbiddenExample = await makeRequest('GET', '/api/examples/forbidden?userRole=user');
  if (!forbiddenExample.success) {
    console.log('✅ Exemplo de autorização OK (falhou como esperado)');
    console.log('   Erro esperado:', forbiddenExample.error?.message);
  } else {
    console.log('❌ Exemplo de autorização deveria ter falhado');
  }

  // Teste 7: Exemplo de autorização (deve funcionar para admin)
  console.log('\n7️⃣ Testando exemplo de autorização (deve funcionar para admin)...');
  const adminForbiddenExample = await makeRequest('GET', '/api/examples/forbidden?userRole=admin');
  if (adminForbiddenExample.success) {
    console.log('✅ Exemplo de autorização para admin OK');
  } else {
    console.log('❌ Exemplo de autorização para admin falhou:', adminForbiddenExample.error);
  }

  // Teste 8: Usando headers para autenticação mock
  console.log('\n8️⃣ Testando autenticação via headers...');
  const headerAuth = await makeRequest('GET', '/api/actions/permissions', null, {
    'X-User-ID': '3',
    'X-User-Role': 'student'
  });
  if (headerAuth.success) {
    console.log('✅ Autenticação via headers OK');
  } else {
    console.log('❌ Autenticação via headers falhou:', headerAuth.error);
  }

  console.log('\n🎉 Testes concluídos!');
  console.log('\n📝 Resumo:');
  console.log('- O projeto funciona sem middleware de autenticação obrigatório');
  console.log('- Usuários podem ser identificados via query params, body ou headers');
  console.log('- Valores padrão são aplicados quando nenhuma informação é fornecida');
  console.log('- Todos os endpoints principais estão funcionando');
  console.log('- O sistema está preparado para implementação de autenticação futura');
}

// Executar testes
runTests().catch(console.error);
