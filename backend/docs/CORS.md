# CORS Configuration - IChaves Backend

Este documento explica como o CORS está configurado no backend do IChaves para permitir acesso do frontend.

## Configuração Atual

O CORS está configurado para permitir acesso do frontend Nuxt.js nas seguintes origens:

### Desenvolvimento
- `http://localhost:3000` (porta padrão do Nuxt)
- `http://127.0.0.1:3000` (localhost alternativo)
- `http://localhost:3001` (porta alternativa)
- `http://127.0.0.1:3001` (localhost alternativo)

### Produção
- URL definida na variável de ambiente `FRONTEND_URL`

## Arquivos de Configuração

### 1. `src/server.ts`
Arquivo principal do servidor que inicializa o Express e configura o CORS.

### 2. `src/middleware/cors.ts`
Configuração modular do CORS com diferentes opções para desenvolvimento e produção.

### 3. `env.example`
Template de variáveis de ambiente com configurações de CORS.

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend com as seguintes variáveis:

```env
# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=3001
NODE_ENV=development
```

## Como Funciona

### Desenvolvimento (`NODE_ENV=development`)
- CORS permissivo - permite qualquer origem
- Logs informativos sobre a configuração usada

### Produção (`NODE_ENV=production`)
- CORS restritivo - apenas origens específicas permitidas
- Bloqueia requisições de origens não autorizadas
- Logs de aviso para tentativas de acesso bloqueadas

## Headers Permitidos

O CORS está configurado para permitir os seguintes headers:

- `Origin`
- `X-Requested-With`
- `Content-Type`
- `Accept`
- `Authorization`
- `Cache-Control`
- `Pragma`

## Headers Expostos

O frontend pode acessar os seguintes headers da resposta:

- `X-Total-Count` (para paginação)

## Métodos HTTP Permitidos

- `GET`
- `POST`
- `PUT`
- `DELETE`
- `PATCH`
- `OPTIONS`

## Credenciais

O CORS está configurado para permitir credenciais (`credentials: true`), o que significa que:
- Cookies podem ser enviados
- Headers de autorização são permitidos
- Autenticação baseada em sessão funciona

## Testando a Configuração

### 1. Verificar se o servidor está rodando
```bash
curl http://localhost:3001/health
```

### 2. Testar CORS do frontend
No console do navegador (frontend):
```javascript
fetch('http://localhost:3001/health', {
  method: 'GET',
  credentials: 'include'
})
.then(response => response.json())
.then(data => console.log(data));
```

### 3. Verificar logs do servidor
O servidor irá mostrar logs sobre:
- Configuração CORS usada (desenvolvimento/produção)
- Tentativas de acesso bloqueadas
- Requisições bem-sucedidas

## Solução de Problemas

### Erro: "Not allowed by CORS"
1. Verifique se a URL do frontend está na lista de origens permitidas
2. Confirme se `FRONTEND_URL` está configurada corretamente no `.env`
3. Verifique se o servidor está rodando na porta correta

### Erro: "Credentials not allowed"
1. Confirme se `credentials: true` está configurado (já está por padrão)
2. Verifique se o frontend está enviando `credentials: 'include'` nas requisições

### Problemas com Cookies
1. Certifique-se de que o frontend está configurado para enviar cookies
2. Verifique se os domínios estão corretos (localhost vs 127.0.0.1)

## Personalização

Para adicionar novas origens permitidas, edite o arquivo `src/middleware/cors.ts`:

```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  process.env.FRONTEND_URL,
  'https://seu-dominio-producao.com', // Adicione aqui
].filter(Boolean);
```

## Segurança

- Em produção, sempre use HTTPS
- Configure `FRONTEND_URL` com a URL exata do frontend em produção
- Monitore logs para tentativas de acesso não autorizadas
- Considere usar subdomínios específicos em vez de wildcards
