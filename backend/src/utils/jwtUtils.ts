/**
 * Utilitários para manipulação de JSON Web Tokens (JWT).
 * Responsável por gerar e verificar tokens de autenticação.
 */
import jwt from 'jsonwebtoken';

// 1. Leitura das variáveis de ambiente essenciais para JWT.
const JWT_SECRET_ENV = process.env.JWT_SECRET;
const JWT_EXPIRES_IN_ENV = process.env.JWT_EXPIRES_IN;

// 2. Verificação crítica na inicialização do módulo.
// Se as variáveis não estiverem definidas, a aplicação não pode operar de forma segura.
if (!JWT_SECRET_ENV || !JWT_EXPIRES_IN_ENV) {
  console.error('FATAL ERROR: JWT_SECRET ou JWT_EXPIRES_IN não estão definidos nas variáveis de ambiente.');
  process.exit(1); // Encerra a aplicação, pois a autenticação está comprometida.
}

interface TokenPayload {
  sub: string; // 'subject', geralmente o ID do usuário.
}

// Após a verificação, TypeScript sabe que essas variáveis são strings.
// Podemos atribuí-las a novas constantes com tipos mais específicos para jwt.sign.
const JWT_SECRET: jwt.Secret = JWT_SECRET_ENV;
const JWT_EXPIRES_IN: string | number = JWT_EXPIRES_IN_ENV;

/**
 * Gera um token JWT com base em um payload.
 * O segredo e o tempo de expiração são lidos das variáveis de ambiente.
 *
 * @param payload - Os dados a serem incluídos no token, como o ID do usuário.
 * @returns O token JWT gerado como uma string.
 */
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { // Agora JWT_SECRET é explicitamente jwt.Secret
    expiresIn: JWT_EXPIRES_IN,           // E JWT_EXPIRES_IN é string | number
    algorithm: 'HS256',
  });
};