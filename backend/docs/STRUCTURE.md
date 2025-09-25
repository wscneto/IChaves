# 🏗️ Estrutura do Projeto - Backend IChaves

Este documento explica a organização e arquitetura do backend do sistema IChaves.

## 📁 Estrutura de Diretórios

```
backend/
├── 📁 src/                    # Código fonte principal
│   ├── 📁 controllers/        # Controladores HTTP
│   ├── 📁 services/           # Lógica de negócio
│   ├── 📁 routes/             # Definição de rotas
│   ├── 📁 middleware/         # Middlewares do Express
│   ├── 📁 models/             # Models do modelo MVC, mas é substituido pelo Prisma
│   ├── 📁 utils/              # Utilitários e helpers
│   ├── 📁 types/              # Definições de tipos TypeScript
│   └── 📄 server.ts           # Arquivo principal do servidor
├── 📁 prisma/                 # Configuração do banco de dados
│   ├── 📄 schema.prisma       # Schema do banco
│   ├── 📁 migrations/         # Migrações do banco
│   └── 📄 seed.ts             # Dados iniciais
├── 📁 scripts/                # Scripts de teste e utilitários
├── 📁 docs/                   # Documentação
├── 📄 package.json            # Configuração do projeto
├── 📄 tsconfig.json           # Configuração TypeScript
└── 📄 .env.example            # Exemplo de variáveis de ambiente
```

## 🎯 Arquitetura em Camadas

### **1. Camada de Apresentação (Routes + Controllers)**
```
HTTP Request → Routes → Controllers
```

**Responsabilidades:**
- Receber requisições HTTP
- Validar dados de entrada
- Chamar serviços apropriados
- Retornar respostas HTTP

### **2. Camada de Negócio (Services)**
```
Controllers → Services → Models
```

**Responsabilidades:**
- Implementar regras de negócio
- Coordenar operações de dados
- Validar lógica de negócio
- Tratar erros específicos

### **3. Camada de Dados (Models + Prisma)**
```
Services → Prisma Client → Database
```

**Responsabilidades:**
- Interagir com o banco de dados
- Executar queries SQL
- Mapear dados para objetos
- Gerenciar transações

## 📋 Detalhamento das Camadas

### 🎮 **Controllers** (`src/controllers/`)

**Propósito:** Gerenciar requisições HTTP e respostas

**Estrutura:**
```typescript
export class UserController {
  static createUser = ErrorHandler.asyncHandler(async (req, res) => {
    // Validação de entrada
    // Chamada do service
    // Resposta HTTP
  });
}
```

**Responsabilidades:**
- ✅ Validar dados de entrada
- ✅ Chamar services apropriados
- ✅ Tratar erros HTTP
- ✅ Formatar respostas
- ✅ Gerenciar status codes

### 🔧 **Services** (`src/services/`)

**Propósito:** Implementar lógica de negócio

**Estrutura:**
```typescript
export class UserService {
  static async createUser(userData: CreateUserData) {
    // Validações de negócio
    // Operações no banco
    // Retorno de dados
  }
}
```

**Responsabilidades:**
- ✅ Regras de negócio
- ✅ Validações complexas
- ✅ Coordenação de operações
- ✅ Tratamento de erros de negócio
- ✅ Integração com models

### 🗂️ **Models** (`prisma/schema.prisma`)

**Propósito:** Definir estrutura do banco de dados

**Estrutura:**
```prisma
model User {
  IDUser        Int      @id @default(autoincrement())
  Name          String
  Email         String   @unique
  // Relacionamentos
}
```

**Responsabilidades:**
- ✅ Definição de entidades
- ✅ Relacionamentos entre tabelas
- ✅ Validações de dados
- ✅ Índices e constraints
- ✅ Migrações de schema

### 🛣️ **Routes** (`src/routes/`)

**Propósito:** Definir endpoints da API

**Estrutura:**
```typescript
const router = Router();

router.post('/', UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

export default router;
```

**Responsabilidades:**
- ✅ Mapeamento de URLs
- ✅ Definição de métodos HTTP
- ✅ Parâmetros de rota
- ✅ Middlewares específicos
- ✅ Agregação de controllers

### 🛡️ **Middleware** (`src/middleware/`)

**Propósito:** Processar requisições antes dos controllers

**Tipos:**
- **CORS:** Configuração de origem cruzada
- **Error Handler:** Tratamento global de erros
- **Security:** Helmet, Rate Limiting
- **Logging:** Morgan para logs

**Fluxo:**
```
Request → CORS → Security → Logging → Routes → Controllers → Error Handler → Response
```

### 🔧 **Utils** (`src/utils/`)

**Propósito:** Funções auxiliares e utilitários

**Conteúdo:**
- **Error Utils:** Funções para lançar erros
- **Validation Utils:** Validações de dados
- **Auth Utils:** Utilitários de autenticação

### 📝 **Types** (`src/types/`)

**Propósito:** Definições de tipos TypeScript

**Conteúdo:**
- **Error Types:** Classes de erro customizadas
- **Express Types:** Extensões do Express
- **Service Types:** Interfaces de dados

## 🔄 Fluxo de Dados

### **Requisição HTTP:**
```
1. Client → HTTP Request
2. Express → Middleware Stack
3. Routes → Controller
4. Controller → Service
5. Service → Prisma → Database
6. Database → Prisma → Service
7. Service → Controller
8. Controller → HTTP Response
9. Client ← HTTP Response
```

### **Tratamento de Erros:**
```
1. Erro ocorre em qualquer camada
2. Error Handler captura o erro
3. Log do erro é gerado
4. Resposta de erro é formatada
5. Cliente recebe erro estruturado
```

## 🎨 Padrões de Design

### **1. Repository Pattern (via Prisma)**
- Abstração da camada de dados
- Operações CRUD padronizadas
- Queries complexas encapsuladas

### **2. Service Layer Pattern**
- Separação de lógica de negócio
- Reutilização de código
- Testabilidade melhorada

### **3. Controller Pattern**
- Separação de responsabilidades
- Tratamento de HTTP
- Validação de entrada

### **4. Middleware Pattern**
- Processamento em pipeline
- Reutilização de funcionalidades
- Composição de comportamentos

## 🔧 Configurações

### **TypeScript** (`tsconfig.json`)
- Configuração de compilação
- Paths e aliases
- Strict mode habilitado

### **Prisma** (`prisma/schema.prisma`)
- Schema do banco de dados
- Configuração de conexão
- Migrações automáticas

### **Package** (`package.json`)
- Dependências do projeto
- Scripts de desenvolvimento
- Configuração do Prisma

## 🚀 Benefícios da Arquitetura

### **✅ Manutenibilidade**
- Código organizado e modular
- Responsabilidades bem definidas
- Fácil localização de funcionalidades

### **✅ Escalabilidade**
- Adição de novas funcionalidades
- Modificação sem impacto
- Reutilização de componentes

### **✅ Testabilidade**
- Camadas isoladas
- Mocks e stubs facilitados
- Testes unitários e integração

### **✅ Flexibilidade**
- Mudanças de banco transparentes
- Diferentes interfaces (REST, GraphQL)
- Integração com serviços externos

## 📚 Próximos Passos

1. Leia o [Guia de Início](./GETTING_STARTED.md)
2. Entenda o [Fluxo de Dados](./FLOW.md)
3. Explore os arquivos de exemplo
4. Desenvolva novas funcionalidades

---

**Arquitetura robusta e escalável! 🏗️**
