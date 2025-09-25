# 🔄 Fluxo de Dados - Backend IChaves

Este documento explica como os dados fluem através do sistema, desde a requisição HTTP até a resposta.

## 🌊 Visão Geral do Fluxo

```
Client → Express → Routes → Controller → Service → Prisma → Database
  ↑                                                                  ↓
  ← HTTP Response ← Error Handler ← Service ← Prisma ← Database ←
```

## 📋 Fluxo Detalhado

### **1. Requisição HTTP**
```
POST /api/users
Content-Type: application/json
{
  "Name": "João Silva",
  "Email": "joao@example.com",
  "Password": "ValidPass123"
}
```

### **2. Middleware Stack**
```
Request → CORS → Helmet → Rate Limit → Morgan → Body Parser → Routes
```

**Cada middleware processa:**
- **CORS:** Verifica origem da requisição
- **Helmet:** Adiciona headers de segurança
- **Rate Limit:** Controla taxa de requisições
- **Morgan:** Registra log da requisição
- **Body Parser:** Converte JSON para objeto

### **3. Roteamento**
```typescript
// src/routes/index.ts
router.use('/users', usersRouter);

// src/routes/users.ts
router.post('/', UserController.createUser);
```

**Processo:**
1. Express identifica a rota `/api/users`
2. Redireciona para `usersRouter`
3. `usersRouter` mapeia `POST /` para `UserController.createUser`

### **4. Controller**
```typescript
// src/controllers/userController.ts
static createUser = ErrorHandler.asyncHandler(async (req, res) => {
  const { Name, Email, Password } = req.body;
  
  // Validação de entrada
  ValidationUtils.validateRequired(Name, 'Name', req);
  ValidationUtils.validateEmail(Email, req);
  
  // Chamada do service
  const user = await UserService.createUser({ Name, Email, Password });
  
  // Resposta HTTP
  res.status(201).json({
    success: true,
    data: user,
    message: 'User created successfully'
  });
});
```

**Processo:**
1. Extrai dados do `req.body`
2. Valida dados obrigatórios
3. Chama `UserService.createUser()`
4. Formata resposta de sucesso
5. Retorna HTTP 201 com dados

### **5. Service**
```typescript
// src/services/userService.ts
static async createUser(userData: CreateUserData) {
  try {
    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { Email: userData.Email }
    });

    if (existingUser) {
      throw new AppError(
        ErrorCode.RESOURCE_CONFLICT,
        'User with this email already exists',
        409
      );
    }

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        Name: userData.Name,
        Email: userData.Email,
      },
      select: {
        IDUser: true,
        Name: true,
        Email: true,
      }
    });

    return user;
  } catch (error) {
    // Tratamento de erros
  }
}
```

**Processo:**
1. Valida regras de negócio
2. Verifica se email já existe
3. Chama `prisma.user.create()`
4. Retorna dados do usuário criado

### **6. Prisma Client**
```typescript
// Prisma traduz para SQL
const user = await prisma.user.create({
  data: { Name: "João Silva", Email: "joao@example.com" },
  select: { IDUser: true, Name: true, Email: true }
});

// SQL gerado:
// INSERT INTO "User" ("Name", "Email") 
// VALUES ('João Silva', 'joao@example.com') 
// RETURNING "IDUser", "Name", "Email";
```

**Processo:**
1. Recebe objeto JavaScript
2. Traduz para SQL
3. Executa no banco de dados
4. Retorna dados como objeto JavaScript

### **7. Database**
```sql
-- PostgreSQL executa:
INSERT INTO "User" ("Name", "Email") 
VALUES ('João Silva', 'joao@example.com') 
RETURNING "IDUser", "Name", "Email";

-- Resultado:
-- IDUser: 1
-- Name: "João Silva"  
-- Email: "joao@example.com"
```

## 🔄 Fluxo de Resposta

### **1. Database → Prisma**
```typescript
// Prisma recebe dados do banco
{
  IDUser: 1,
  Name: "João Silva",
  Email: "joao@example.com"
}
```

### **2. Prisma → Service**
```typescript
// Service recebe dados do Prisma
return user; // { IDUser: 1, Name: "João Silva", Email: "joao@example.com" }
```

### **3. Service → Controller**
```typescript
// Controller recebe dados do Service
const user = await UserService.createUser({ Name, Email, Password });
// user = { IDUser: 1, Name: "João Silva", Email: "joao@example.com" }
```

### **4. Controller → HTTP Response**
```typescript
// Controller formata resposta
res.status(201).json({
  success: true,
  data: {
    IDUser: 1,
    Name: "João Silva",
    Email: "joao@example.com"
  },
  message: 'User created successfully'
});
```

### **5. HTTP Response → Client**
```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "data": {
    "IDUser": 1,
    "Name": "João Silva",
    "Email": "joao@example.com"
  },
  "message": "User created successfully"
}
```

## ❌ Fluxo de Erro

### **Cenário: Email já existe**

### **1. Service detecta erro**
```typescript
if (existingUser) {
  throw new AppError(
    ErrorCode.RESOURCE_CONFLICT,
    'User with this email already exists',
    409
  );
}
```

### **2. Error Handler captura**
```typescript
// src/middleware/errorHandler.ts
static handleError = (error, req, res, next) => {
  const appError = error instanceof AppError ? error : createErrorFromUnknown(error);
  this.sendErrorResponse(appError, req, res);
};
```

### **3. Resposta de erro formatada**
```typescript
// Error Handler formata resposta
res.status(409).json({
  error: {
    code: "RESOURCE_CONFLICT",
    message: "User with this email already exists",
    timestamp: "2025-09-25T17:00:00.000Z",
    requestId: "req_1758819600000_abc123"
  },
  success: false
});
```

### **4. Client recebe erro**
```json
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "error": {
    "code": "RESOURCE_CONFLICT",
    "message": "User with this email already exists",
    "timestamp": "2025-09-25T17:00:00.000Z",
    "requestId": "req_1758819600000_abc123"
  },
  "success": false
}
```

## 🔍 Fluxos Específicos

### **GET /api/users (Listar usuários)**

```
1. Client → GET /api/users
2. Express → Routes → UserController.getAllUsers
3. Controller → UserService.getAllUsers
4. Service → prisma.user.findMany()
5. Prisma → SELECT * FROM "User"
6. Database → Lista de usuários
7. Database → Prisma → Service → Controller → HTTP Response → Client
```

### **GET /api/users/:id (Buscar usuário)**

```
1. Client → GET /api/users/1
2. Express → Routes → UserController.getUserById
3. Controller → UserService.getUserById("1")
4. Service → prisma.user.findUnique({ where: { IDUser: 1 } })
5. Prisma → SELECT * FROM "User" WHERE "IDUser" = 1
6. Database → Dados do usuário
7. Database → Prisma → Service → Controller → HTTP Response → Client
```

### **PUT /api/users/:id (Atualizar usuário)**

```
1. Client → PUT /api/users/1 + dados
2. Express → Routes → UserController.updateUser
3. Controller → UserService.updateUser("1", dados)
4. Service → prisma.user.update({ where: { IDUser: 1 }, data: dados })
5. Prisma → UPDATE "User" SET ... WHERE "IDUser" = 1
6. Database → Usuário atualizado
7. Database → Prisma → Service → Controller → HTTP Response → Client
```

### **DELETE /api/users/:id (Deletar usuário)**

```
1. Client → DELETE /api/users/1
2. Express → Routes → UserController.deleteUser
3. Controller → UserService.deleteUser("1")
4. Service → prisma.user.delete({ where: { IDUser: 1 } })
5. Prisma → DELETE FROM "User" WHERE "IDUser" = 1
6. Database → Confirmação de exclusão
7. Database → Prisma → Service → Controller → HTTP Response → Client
```

## 🛡️ Middleware de Segurança

### **CORS**
```typescript
// Verifica origem da requisição
if (origin && whitelist.indexOf(origin) !== -1) {
  callback(null, true); // Permite
} else {
  callback(new Error('Not allowed by CORS')); // Bloqueia
}
```

### **Rate Limiting**
```typescript
// Controla taxa de requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requisições por IP
});
```

### **Helmet**
```typescript
// Adiciona headers de segurança
app.use(helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ["'none'"] } },
  crossOriginEmbedderPolicy: false
}));
```

## 📊 Logs e Monitoramento

### **Morgan (HTTP Logs)**
```
::ffff:127.0.0.1 - - [25/Sep/2025:17:00:00 +0000] "POST /api/users HTTP/1.1" 201 156 "-" "PostmanRuntime/7.28.0"
```

### **Error Logs**
```json
{
  "requestId": "req_1758819600000_abc123",
  "timestamp": "2025-09-25T17:00:00.000Z",
  "method": "POST",
  "url": "/api/users",
  "error": {
    "name": "ValidationError",
    "message": "Email is required",
    "stack": "..."
  }
}
```

## 🎯 Benefícios do Fluxo

### **✅ Rastreabilidade**
- Cada etapa é logada
- Request ID único
- Stack trace completo

### **✅ Tratamento de Erros**
- Erros capturados em qualquer camada
- Respostas padronizadas
- Logs estruturados

### **✅ Performance**
- Middleware otimizado
- Queries eficientes
- Cache quando apropriado

### **✅ Segurança**
- Validação em múltiplas camadas
- Sanitização de dados
- Headers de segurança

## 📚 Próximos Passos

1. Leia o [Guia de Início](./GETTING_STARTED.md)
2. Entenda a [Estrutura do Projeto](./STRUCTURE.md)
3. Teste os fluxos com os scripts
4. Desenvolva novos endpoints

---

**Fluxo de dados robusto e confiável! 🔄**
