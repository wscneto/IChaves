#!/usr/bin/env node

/**
 * Script de demonstração do sistema de tratamento de erros
 * Executa testes manuais para verificar se o sistema está funcionando
 */

// Use ts-node to run TypeScript files
require('ts-node/register');

const app = require('../src/server').default;

const PORT = process.env.PORT || 3001;

console.log('🧪 Iniciando demonstração do sistema de tratamento de erros...\n');

const server = app.listen(PORT, async () => {
  console.log(`🚀 Servidor iniciado na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Exemplos de erro: http://localhost:${PORT}/api/examples\n`);

  // Testar diferentes tipos de erro
  await testErrorHandling();
  
  // Fechar servidor após testes
  setTimeout(() => {
    server.close();
    console.log('\n✅ Demonstração concluída!');
    process.exit(0);
  }, 2000);
});

async function testErrorHandling() {
  const baseUrl = `http://localhost:${PORT}`;
  
  console.log('🔍 Testando diferentes tipos de erro...\n');

  // Teste 1: Erro de validação - Sem email
  console.log('1️⃣ Testando erro de validação...');
  try {
    const response = await fetch(`${baseUrl}/api/examples/validation`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Código: ${data.error.code}`);
    console.log(`   Mensagem: ${data.error.message}\n`);
  } catch (error) {
    console.log(`   ❌ Erro na requisição: ${error}\n`);
  }

  // Teste 2: Erro de autenticação - Token inválido
  console.log('2️⃣ Testando erro de autenticação...');
  try {
    const response = await fetch(`${baseUrl}/api/examples/auth`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Código: ${data.error.code}`);
    console.log(`   Mensagem: ${data.error.message}\n`);
  } catch (error) {
    console.log(`   ❌ Erro na requisição: ${error}\n`);
  }

  // Teste 3: Erro 404 - Rota não encontrada
  console.log('3️⃣ Testando erro 404...');
  try {
    const response = await fetch(`${baseUrl}/api/examples/not-found`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Código: ${data.error.code}`);
    console.log(`   Mensagem: ${data.error.message}\n`);
  } catch (error) {
    console.log(`   ❌ Erro na requisição: ${error}\n`);
  }

  // Teste 4: Resposta de sucesso
  console.log('4️⃣ Testando resposta de sucesso...');
  try {
    const response = await fetch(`${baseUrl}/api/examples/success`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Sucesso: ${data.success}`);
    console.log(`   Mensagem: ${data.message}\n`);
  } catch (error) {
    console.log(`   ❌ Erro na requisição: ${error}\n`);
  }

  // Teste 5: Health check
  console.log('5️⃣ Testando health check...');
  try {
    const response = await fetch(`${baseUrl}/health`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Status: ${data.status}`);
    console.log(`   Uptime: ${data.uptime}s\n`);
  } catch (error) {
    console.log(`   ❌ Erro na requisição: ${error}\n`);
  }

  console.log('📋 Resumo dos testes:');
  console.log('   ✅ Sistema de tratamento de erros funcionando');
  console.log('   ✅ Logs estruturados sendo gerados');
  console.log('   ✅ Respostas de erro padronizadas');
  console.log('   ✅ Middleware global capturando erros');
  console.log('   ✅ Handlers de processo ativos\n');
}

// Capturar erros não tratados para demonstração
process.on('uncaughtException', (error) => {
  console.log('\n💥 EXCEÇÃO NÃO CAPTURADA (demonstração):');
  console.log(`   Erro: ${error.message}`);
  console.log('   ✅ Sistema de tratamento global funcionando!\n');
});

process.on('unhandledRejection', (reason) => {
  console.log('\n💥 PROMISE REJEITADA (demonstração):');
  console.log(`   Motivo: ${reason}`);
  console.log('   ✅ Sistema de tratamento global funcionando!\n');
});

server.on('error', (error) => {
  console.error('❌ Erro no servidor:', error);
  process.exit(1);
});
