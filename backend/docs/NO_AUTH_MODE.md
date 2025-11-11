# 🔓 Modo Sem Autenticação - IChaves Backend

Este documento explica como o projeto funciona sem middleware de autenticação e como testar as funcionalidades.

## 📋 Visão Geral

O projeto foi modificado para funcionar **sem middleware de autenticação obrigatório**. Isso permite:

- ✅ Testar todas as funcionalidades sem configuração de autenticação
- ✅ Desenvolver e testar APIs sem complexidade de autenticação
- ✅ Implementar autenticação posteriormente sem quebrar o código existente

## 🔧 Como Funciona

### 1. **Middleware de Mock Auth Opcional**

Foi criado um middleware opcional (`src/middleware/mockAuth.ts`) que simula autenticação quando necessário:

```typescript
// Middleware aplicado automaticamente em todas as rotas
app.use(optionalMockAuth);
```

### 2. **Identificação de Usuário**

O sistema identifica usuários através de:

- **Query Parameters**: `?userID=1&userRole=student`
- **Request Body**: `{ "userID": 1, "userRole": "admin" }`
- **Headers**: `X-User-ID: 1`, `X-User-Role: student`

### 3. **Valores Padrão**

Se nenhuma informação de usuário for fornecida:
- **userID**: `1` (usuário padrão)
- **userRole**: `student` (papel padrão)

## 🚀 Como Testar

### **Exemplo 1: Reservar Chave (Estudante)**

```bash
curl -X POST http://localhost:3001/api/actions/reservar \
  -H "Content-Type: application/json" \
  -d '{
    "IDClassroomFK": 1,
    "Notes": "Aula de matemática",
    "userID": 1,
    "userRole": "student"
  }'
```

### **Exemplo 2: Suspender Chave (Admin)**

```bash
curl -X POST http://localhost:3001/api/actions/suspender \
  -H "Content-Type: application/json" \
  -d '{
    "IDClassroomFK": 1,
    "Reason": "Manutenção",
    "Notes": "Sala em manutenção",
    "userID": 2,
    "userRole": "admin"
  }'
```

### **Exemplo 3: Usando Headers**

```bash
curl -X GET "http://localhost:3001/api/actions/permissions" \
  -H "X-User-ID: 1" \
  -H "X-User-Role: student"
```

### **Exemplo 4: Usando Query Parameters**

```bash
curl -X GET "http://localhost:3001/api/actions/permissions?userRole=admin"
```

## 📊 Endpoints Disponíveis

### **Actions (Ações)**

| Método | Endpoint | Descrição | Parâmetros |
|--------|----------|-----------|------------|
| POST | `/api/actions/reservar` | Reservar chave | `IDClassroomFK`, `Notes`, `userID`, `userRole` |
| POST | `/api/actions/trocar` | Trocar chave | `IDClassroomFK`, `Notes`, `userID`, `userRole` |
| POST | `/api/actions/devolver` | Devolver chave | `IDClassroomFK`, `Notes`, `userID`, `userRole` |
| POST | `/api/actions/solicitar` | Solicitar chave (admin) | `IDClassroomFK`, `TargetUserID`, `Notes`, `userID`, `userRole` |
| POST | `/api/actions/suspender` | Suspender chave (admin) | `IDClassroomFK`, `Reason`, `Notes`, `userID`, `userRole` |
| POST | `/api/actions/liberar` | Liberar chave (admin) | `IDClassroomFK`, `Notes`, `userID`, `userRole` |
| GET | `/api/actions/permissions` | Obter permissões | `userRole` (query) |
| GET | `/api/actions/classroom/:id/state` | Estado da sala | `userRole` (query) |
| GET | `/api/actions/user/:id/permissions` | Permissões do usuário | `userRole` (query) |

### **Exemplos de Erro**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/examples/validation` | Erros de validação |
| GET | `/api/examples/auth` | Erros de autenticação |
| GET | `/api/examples/forbidden` | Erros de autorização |
| GET | `/api/examples/not-found` | Erros de não encontrado |

## 🔄 Fluxo de Dados

```
Request → CORS → Security → Logging → Mock Auth (opcional) → Routes → Controllers → Services → Database
```

## 🛠️ Implementação de Autenticação Futura

Quando a autenticação real for implementada:

1. **Substitua o middleware mock**:
   ```typescript
   // Remover
   app.use(optionalMockAuth);
   
   // Adicionar
   app.use(realAuthMiddleware);
   ```

2. **Os controllers já estão preparados** para usar `req.user` quando disponível

3. **O AuthUtils** já está configurado para funcionar com autenticação real

## 📝 Notas Importantes

- ✅ **Todos os endpoints funcionam** sem autenticação obrigatória
- ✅ **Validações de dados** continuam funcionando normalmente
- ✅ **Sistema de erros** mantém a mesma estrutura
- ✅ **Logs de desenvolvimento** mostram informações de usuário mock
- ✅ **Código preparado** para autenticação futura

## 🚨 Limitações Atuais

- ⚠️ **Sem validação real de identidade** (apenas simulação)
- ⚠️ **Sem controle de sessão** (cada request é independente)
- ⚠️ **Sem controle de permissões real** (baseado apenas no role fornecido)

## 🔍 Debugging

Para ver logs de autenticação mock:

```bash
# Definir NODE_ENV como development
export NODE_ENV=development

# Iniciar servidor
npm run dev
```

Os logs mostrarão:
```
[MockAuth] User 1 (student) accessing POST /api/actions/reservar
```
