# 🏗️ Backend IChaves

Sistema de gerenciamento de chaves e salas de aula desenvolvido com Node.js, Express, TypeScript e Prisma.

## 📚 Documentação

- **[🚀 Guia de Início](./docs/GETTING_STARTED.md)** - Como configurar e executar o sistema
- **[🐳 Docker e PostgreSQL](./docs/DOCKER_POSTGRESQL.md)** - Como usar Docker e visualizar dados no VS Code
- **[🏗️ Estrutura do Projeto](./docs/STRUCTURE.md)** - Arquitetura e organização do código
- **[🔄 Fluxo de Dados](./docs/FLOW.md)** - Como os dados fluem através do sistema
- **[📚 Bibliotecas](./docs/LIBRARIES.md)** - Explicação de todas as dependências e suas funções

## ⚡ Início Rápido

### Pré-requisitos
- Docker e Docker Compose instalados
- Git

### Configuração
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd IChaves/backend

# Inicie os serviços com Docker
docker-compose up -d

# Execute as migrações
docker-compose exec backend npm run db:migrate

# Execute o seed (dados de exemplo)
docker-compose exec backend npm run db:seed
```

### Acessos
- **Backend API:** `http://localhost:3001`
- **Health Check:** `http://localhost:3001/health`
- **Banco de Dados:** `localhost:5432`
- **Prisma Studio:** Execute `docker-compose exec backend npx prisma studio`

## 🛠️ Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Linguagem tipada
- **Prisma** - ORM para banco de dados
- **JWT** - Autenticação
- **CORS** - Controle de acesso
- **Helmet** - Segurança HTTP
- **Morgan** - Logging de requisições

### Infraestrutura
- **Docker** - Containerização
- **PostgreSQL** - Banco de dados
- **Docker Compose** - Orquestração de containers

## 📊 Endpoints da API

### Health Check
- `GET /health` - Status do servidor e informações de uptime

### Usuários
- `GET /api/users` - Listar todos os usuários
- `POST /api/users` - Criar novo usuário
- `GET /api/users/:id` - Buscar usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Exemplos e Demonstrações
- `GET /api/examples/*` - Endpoints de demonstração e testes

### Banco de Dados
- **Prisma Studio:** Interface visual para gerenciar dados
- **Migrações:** Sistema de versionamento do banco
- **Seed:** Dados iniciais para desenvolvimento

## 🧪 Scripts e Comandos Úteis

### Desenvolvimento
```bash
# Iniciar ambiente de desenvolvimento
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f backend

# Parar todos os serviços
docker-compose down
```

### Banco de Dados
```bash
# Executar migrações
docker-compose exec backend npm run db:migrate

# Popular com dados de exemplo
docker-compose exec backend npm run db:seed

# Abrir Prisma Studio
docker-compose exec backend npx prisma studio

# Resetar banco (CUIDADO: apaga todos os dados!)
docker-compose exec backend npx prisma migrate reset
```

### Testes e Demonstrações
```bash
# Teste do servidor
docker-compose exec backend npm run test:server

# Demonstração de tratamento de erros
docker-compose exec backend npm run demo:errors
```

## 📁 Estrutura do Projeto

```
backend/
├── src/                    # Código fonte
│   ├── controllers/        # Controladores HTTP
│   ├── services/          # Lógica de negócio
│   ├── routes/            # Rotas da API
│   ├── middleware/        # Middlewares (CORS, Error Handler)
│   ├── utils/             # Utilitários
│   └── types/             # Tipos TypeScript
├── prisma/                # Banco de dados
│   ├── schema.prisma      # Schema do banco
│   ├── migrations/        # Migrações
│   └── seed.ts           # Dados iniciais
├── scripts/               # Scripts de teste e demonstração
├── docs/                  # Documentação completa
├── docker-compose.yml     # Configuração Docker
├── Dockerfile            # Imagem Docker
└── package.json          # Dependências e scripts
```

## 🎯 Arquitetura

```
Cliente → Rotas → Controller → Service → Prisma → PostgreSQL
   ↑                                                      ↓
   ← HTTP Response ← Error Handler ← Service ← Prisma ←
```

### Fluxo de Dados
1. **Cliente** faz requisição HTTP
2. **Rotas** direcionam para o controller correto
3. **Controller** processa a requisição
4. **Service** executa a lógica de negócio
5. **Prisma** interage com o banco PostgreSQL
6. **Error Handler** trata erros e retorna resposta

## 🚀 Desenvolvimento

### Primeiros Passos
1. 📖 Leia a [documentação completa](./docs/)
2. 🐳 Configure o ambiente com [Docker](./docs/DOCKER_POSTGRESQL.md)
3. 🔍 Explore os endpoints existentes
4. 💻 Visualize dados no VS Code
5. 🛠️ Desenvolva novas funcionalidades

### Dicas Importantes
- Use `docker-compose logs -f backend` para ver logs em tempo real
- Execute `npm run db:seed` após mudanças no schema
- Use Prisma Studio para visualizar dados: `npx prisma studio`
- Consulte a documentação em `./docs/` para detalhes específicos

## 🔧 Troubleshooting

### Problemas Comuns
- **Container não inicia:** `docker-compose logs` para ver erros
- **Erro de conexão:** Verifique se as portas 3001 e 5432 estão livres
- **Problemas no banco:** Execute `docker-compose exec backend npx prisma migrate reset`
- **Dependências:** Use `docker-compose build --no-cache` para reconstruir

### Comandos de Emergência
```bash
# Limpar tudo e recomeçar
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# Verificar status
docker-compose ps
docker-compose logs backend
```

## 📄 Licença

Este projeto está sob a licença ISC.

---

**Desenvolvido com ❤️ pela equipe IChaves**

> 💡 **Dica:** Consulte a [documentação completa](./docs/) para informações detalhadas sobre cada aspecto do projeto.
