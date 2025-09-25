# 🏗️ Backend IChaves

Sistema de gerenciamento de chaves e salas de aula desenvolvido com Node.js, Express, TypeScript e Prisma.

## 📚 Documentação

- **[🚀 Guia de Início](./docs/GETTING_STARTED.md)** - Como configurar e executar o sistema
- **[🏗️ Estrutura do Projeto](./docs/STRUCTURE.md)** - Arquitetura e organização do código
- **[🔄 Fluxo de Dados](./docs/FLOW.md)** - Como os dados fluem através do sistema
- **[📚 Bibliotecas](./docs/LIBRARIES.md)** - Explicação de todas as dependências e suas funções

## ⚡ Início Rápido

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd IChaves/backend

# Inicie os serviços com Docker
docker-compose up -d

# Execute as migrações
docker-compose exec backend npm run db:migrate

# Execute o seed
docker-compose exec backend npm run db:seed
```

O servidor estará disponível em `http://localhost:3001`

## 🛠️ Tecnologias

- **Docker** - Containerização
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Linguagem tipada
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Zod** - Validação de dados

## 📊 Endpoints

### Health Check
- `GET /health` - Status do servidor

### Usuários (rotas de exemplo)
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `GET /api/users/:id` - Buscar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Exemplos
- `GET /api/examples/*` - Endpoints de demonstração

## 🧪 Scripts de Teste

```bash
# Teste do servidor
docker-compose exec backend npm run test:server

# Demonstração de erros
docker-compose exec backend npm run demo:errors
```

## 📁 Estrutura

```
backend/
├── src/
│   ├── controllers/    # Controladores HTTP
│   ├── services/       # Lógica de negócio
│   ├── routes/         # Rotas da API
│   ├── middleware/     # Middlewares
│   ├── utils/          # Utilitários
│   └── types/          # Tipos TypeScript
├── prisma/
│   ├── schema.prisma   # Schema do banco
│   └── migrations/      # Migrações
├── scripts/            # Scripts de teste
└── docs/              # Documentação
```

## 🎯 Arquitetura

```
Client → Routes → Controller → Service → Prisma → Database
  ↑                                                      ↓
  ← HTTP Response ← Error Handler ← Service ← Prisma ←
```

## 🚀 Desenvolvimento

1. Leia a [documentação completa](./docs/)
2. Configure o ambiente de desenvolvimento
3. Explore os endpoints existentes
4. Desenvolva novas funcionalidades

## 📄 Licença

Este projeto está sob a licença ISC.

---

**Desenvolvido com ❤️ pela equipe IChaves**
