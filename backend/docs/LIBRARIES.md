# 📚 Bibliotecas e Dependências - Backend IChaves

Este documento explica todas as bibliotecas utilizadas no projeto, suas funções e por que foram escolhidas.

## 🎯 Dependências Principais (Production)

### **🌐 Express** (`express: ^5.1.0`)
**Função:** Framework web para Node.js
**Uso no projeto:**
- Criação do servidor HTTP
- Definição de rotas e middlewares
- Manipulação de requisições e respostas

```typescript
import express from 'express';
const app = express();
app.get('/health', (req, res) => res.json({ status: 'OK' }));
```

**Por que escolhemos:** Framework mais popular e maduro para APIs Node.js

---

### **🗄️ Prisma** (`prisma: ^6.16.2` + `@prisma/client: ^6.16.2`)
**Função:** ORM (Object-Relational Mapping) para banco de dados
**Uso no projeto:**
- Definição do schema do banco (`schema.prisma`)
- Geração automática do cliente TypeScript
- Operações CRUD no banco PostgreSQL

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const user = await prisma.user.create({ data: { name: 'João' } });
```

**Por que escolhemos:** Type-safe, geração automática de tipos, migrações fáceis

---

### **🔐 JSON Web Token** (`jsonwebtoken: ^9.0.2`)
**Função:** Geração e validação de tokens JWT
**Uso no projeto:**
- Autenticação de usuários (quando implementado)
- Criação de tokens de sessão
- Verificação de autorização

```typescript
import jwt from 'jsonwebtoken';
const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET);
```

**Por que escolhemos:** Padrão da indústria para autenticação stateless
**Nota:** Atualmente não implementado - usuários não têm senhas no sistema

---

### **🌍 CORS** (`cors: ^2.8.5`)
**Função:** Configuração de Cross-Origin Resource Sharing
**Uso no projeto:**
- Permite requisições do frontend (localhost:3000)
- Configuração de origens permitidas
- Headers CORS personalizados

```typescript
import cors from 'cors';
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
```

**Por que escolhemos:** Necessário para comunicação frontend-backend

---

### **🛡️ Helmet** (`helmet: ^8.1.0`)
**Função:** Middleware de segurança para Express
**Uso no projeto:**
- Adiciona headers de segurança HTTP
- Proteção contra ataques comuns (XSS, CSRF)
- Configuração de Content Security Policy

```typescript
import helmet from 'helmet';
app.use(helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ["'none'"] } }
}));
```

**Por que escolhemos:** Melhora significativamente a segurança da aplicação

---

### **⏱️ Express Rate Limit** (`express-rate-limit: ^8.1.0`)
**Função:** Limitação de taxa de requisições
**Uso no projeto:**
- Previne ataques de força bruta
- Controla número de requisições por IP
- Proteção contra DDoS

```typescript
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requisições por IP
});
```

**Por que escolhemos:** Proteção essencial contra ataques automatizados

---

### **📝 Morgan** (`morgan: ^1.10.1`)
**Função:** Middleware de logging HTTP
**Uso no projeto:**
- Registra todas as requisições HTTP
- Logs estruturados para debugging
- Monitoramento de performance

```typescript
import morgan from 'morgan';
app.use(morgan('combined'));
// Log: ::1 - - [25/Sep/2025:17:00:00 +0000] "GET /health HTTP/1.1" 200 73
```

**Por que escolhemos:** Logging essencial para desenvolvimento e produção

---

### **🔧 dotenv** (`dotenv: ^17.2.2`)
**Função:** Carregamento de variáveis de ambiente
**Uso no projeto:**
- Carrega variáveis do arquivo `.env`
- Configuração de banco de dados
- Chaves secretas e configurações

```typescript
import dotenv from 'dotenv';
dotenv.config();
const dbUrl = process.env.DATABASE_URL;
```

**Por que escolhemos:** Gerenciamento seguro de configurações

---

## 🛠️ Dependências de Desenvolvimento (DevDependencies)

### **📘 TypeScript** (`typescript: ^5.9.2`)
**Função:** Superset do JavaScript com tipagem estática
**Uso no projeto:**
- Tipagem estática para melhor desenvolvimento
- Detecção de erros em tempo de compilação
- IntelliSense e autocomplete melhorados

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}
```

**Por que escolhemos:** Maior segurança e produtividade no desenvolvimento

---

### **🔄 ts-node** (`ts-node: ^10.9.2`)
**Função:** Execução de arquivos TypeScript diretamente
**Uso no projeto:**
- Execução de scripts TypeScript sem compilação
- Desenvolvimento mais rápido
- Scripts de teste e seed

```bash
ts-node src/server.ts
```

**Por que escolhemos:** Desenvolvimento mais ágil sem build steps

---

### **👀 Nodemon** (`nodemon: ^3.1.10`)
**Função:** Reinicialização automática do servidor
**Uso no projeto:**
- Reinicia o servidor quando arquivos mudam
- Desenvolvimento mais eficiente
- Hot reload para desenvolvimento

```json
"dev": "nodemon src/server.ts"
```

**Por que escolhemos:** Desenvolvimento mais produtivo

---

### **🔍 ESLint** (`eslint: ^9.36.0` + `@eslint/js: ^9.36.0`)
**Função:** Linter para JavaScript/TypeScript
**Uso no projeto:**
- Análise estática de código
- Detecção de problemas e más práticas
- Padronização de código

```json
{
  "extends": ["@eslint/js/recommended"],
  "rules": {
    "no-console": "warn"
  }
}
```

**Por que escolhemos:** Qualidade e consistência do código

---

### **🎨 Prettier** (`prettier: 3.6.2`)
**Função:** Formatador de código
**Uso no projeto:**
- Formatação automática de código
- Consistência visual
- Integração com ESLint

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2
}
```

**Por que escolhemos:** Código sempre bem formatado

---

### **📦 Tipos TypeScript**
**Funções:** Definições de tipos para bibliotecas JavaScript

#### **@types/node** (`@types/node: ^24.5.2`)
- Tipos para APIs do Node.js
- `process`, `Buffer`, `fs`, etc.

#### **@types/express** (`@types/express: ^5.0.3`)
- Tipos para Express.js
- `Request`, `Response`, `NextFunction`

#### **@types/cors** (`@types/cors: ^2.8.19`)
- Tipos para middleware CORS
- Configurações de CORS

#### **@types/morgan** (`@types/morgan: ^1.9.10`)
- Tipos para middleware Morgan
- Configurações de logging

**Por que escolhemos:** Type safety completo para todas as bibliotecas

---

### **🔧 Ferramentas de Build**

#### **jiti** (`jiti: ^2.6.0`)
- Carregador de módulos TypeScript
- Execução de arquivos TS sem compilação

#### **globals** (`globals: ^16.4.0`)
- Definições globais para ESLint
- Variáveis globais do Node.js

#### **typescript-eslint** (`typescript-eslint: ^8.44.1`)
- ESLint rules específicas para TypeScript
- Integração ESLint + TypeScript

---

## 🏗️ Arquitetura das Bibliotecas

### **Camada de Apresentação**
```
Express → CORS → Helmet → Rate Limit → Morgan
```

### **Camada de Segurança**
```
Helmet → Rate Limit → JWT → bcryptjs
```

### **Camada de Dados**
```
Prisma Client → PostgreSQL
```

### **Camada de Validação**
```
Zod → Express → Prisma
```

## 📊 Resumo por Categoria

| **Categoria** | **Bibliotecas** | **Função Principal** |
|---------------|-----------------|---------------------|
| **🌐 Web Framework** | Express | Servidor HTTP |
| **🗄️ Database** | Prisma, @prisma/client | ORM e acesso a dados |
| **🔐 Security** | Helmet, Rate Limit, bcryptjs, JWT | Segurança e autenticação |
| **🌍 CORS** | CORS | Comunicação frontend |
| **📝 Logging** | Morgan | Logs HTTP |
| **✅ Validation** | Zod | Validação de dados |
| **🔧 Config** | dotenv | Variáveis de ambiente |
| **📘 Development** | TypeScript, ts-node, nodemon | Desenvolvimento |
| **🔍 Quality** | ESLint, Prettier | Qualidade de código |

## 🎯 Por que essa Stack?

### **✅ Vantagens:**
- **Type Safety:** TypeScript + Prisma + Zod
- **Segurança:** Helmet + Rate Limit + bcryptjs
- **Produtividade:** Express + Prisma + Nodemon
- **Qualidade:** ESLint + Prettier
- **Escalabilidade:** Arquitetura modular

### **🚀 Performance:**
- **Prisma:** Queries otimizadas
- **Rate Limiting:** Proteção contra spam
- **Helmet:** Headers de performance
- **Morgan:** Logs eficientes

### **🛡️ Segurança:**
- **JWT:** Autenticação stateless
- **bcryptjs:** Hash seguro de senhas
- **Helmet:** Headers de segurança
- **CORS:** Controle de origem

## 📚 Próximos Passos

1. Leia o [Guia de Início](./GETTING_STARTED.md)
2. Entenda a [Estrutura do Projeto](./STRUCTURE.md)
3. Explore o [Fluxo de Dados](./FLOW.md)
4. Desenvolva novas funcionalidades

---

**Stack moderna e robusta! 🚀**
