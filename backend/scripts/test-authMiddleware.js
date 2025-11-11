/**
 * Script de teste manual para o AuthMiddleware.
 * Este script simula requisições HTTP para validar os cenários de autenticação.
 *
 * Como funciona:
 * 1. Importa a classe AuthMiddleware e a biblioteca jsonwebtoken.
 * 2. Define um segredo JWT e um payload de usuário para os testes.
 * 3. Cria tokens: um válido, um expirado e um com segredo errado.
 * 4. Utiliza funções mock para simular os objetos `req`, `res` e `next` do Express.
 * 5. Executa uma série de testes para cada cenário:
 *    - Token válido.
 *    - Token ausente.
 *    - Token mal formatado (sem "Bearer ").
 *    - Token inválido (assinado com outro segredo).
 *    - Token expirado.
 */

// ts-node é usado para executar arquivos TypeScript diretamente
require('ts-node/register');
const jwt = require('jsonwebtoken');
const { AuthMiddleware } = require('../src/middleware/auth');

// --- Configuração do Teste ---
const JWT_SECRET = 'segredo-para-teste'; // Usa um segredo consistente para gerar e verificar
const userPayload = { id: 1, name: 'Usuário de Teste' };

// Gera um token válido que expira em 1 hora
const validToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' });

// Gera um token que já expirou
const expiredToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '-1s' });

// Gera um token com um segredo diferente
const tokenWithWrongSecret = jwt.sign(userPayload, 'outro-segredo');

// 🧪 Função para simular req e res
function mockReq({ headers = {}, body = {}, params = {}, query = {} } = {}) 
{
  const req = { headers, body, params, query };
  // Adiciona uma propriedade 'user' para ser preenchida pelo middleware
  req.user = null;
  return req;
}

function mockRes() 
{
  const res = 
  {
    statusCode: 200, // Default status code
    status(code) 
    {
      this.statusCode = code;
      return this;
    },
    json(data) 
    {
      console.log("📤 Resposta JSON:", { status: this.statusCode, body: data });
    }
  };
  return res;
}

function mockNext() 
{
  // Para teste manual, um simples console.log é suficiente.
  return (err) => 
    {
    if (err) 
    {
      console.error("❌ next() chamado com erro:", err);
    } else 
    {
      console.log("✅ next() chamado com sucesso!");
    }
  };
}

async function runTests() 
{
  console.log("=== 🧪 Iniciando testes do AuthMiddleware ===");

  // Instancia o middleware com o segredo de teste
  const authMiddleware = new AuthMiddleware(JWT_SECRET).authenticate;

  // --- Cenário 1: Token Válido ---
  console.log("\n--- 1. Testando com token válido ---");
  const req1 = mockReq({ headers: { authorization: `Bearer ${validToken}` } });
  authMiddleware(req1, mockRes(), mockNext());
  console.log("👤 Payload do usuário no req:", req1.user);

  // --- Cenário 2: Token Ausente ---
  console.log("\n--- 2. Testando com token ausente ---");
  const req2 = mockReq(); // Sem header de autorização
  authMiddleware(req2, mockRes(), mockNext());

  // --- Cenário 3: Token Mal Formatado ---
  console.log("\n--- 3. Testando com token mal formatado (sem 'Bearer') ---");
  const req3 = mockReq({ headers: { authorization: validToken } });
  authMiddleware(req3, mockRes(), mockNext());

  // --- Cenário 4: Token Inválido (segredo errado) ---
  console.log("\n--- 4. Testando com token inválido (segredo incorreto) ---");
  const req4 = mockReq({ headers: { authorization: `Bearer ${tokenWithWrongSecret}` } });
  authMiddleware(req4, mockRes(), mockNext());

  // --- Cenário 5: Token Expirado ---
  console.log("\n--- 5. Testando com token expirado ---");
  const req5 = mockReq({ headers: { authorization: `Bearer ${expiredToken}` } });
  authMiddleware(req5, mockRes(), mockNext());

  console.log("\n=== ✅ Testes concluídos ===");
}

runTests();