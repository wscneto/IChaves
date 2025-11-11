# 🏗️ IChaves Backend

Sistema de gerenciamento de chaves e salas de aula desenvolvido com Node.js, Express, TypeScript e Prisma.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/JohnWKenny/IChaves-Backend)

## 🚀 Deploy no Render

Este projeto está configurado para deploy automático no Render. Para fazer o deploy:

1. **Fork este repositório** ou clone para seu GitHub
2. **Conecte ao Render**: Acesse [render.com](https://render.com) e crie uma nova Web Service
3. **Conecte seu repositório**: Selecione este repositório do GitHub
4. **Configure as variáveis de ambiente** no dashboard do Render:
   - `DATABASE_URL`: String de conexão do PostgreSQL (do banco criado no Render)
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://ichaves-frontend.vercel.app`
   - `JWT_SECRET`: Chave secreta para JWT
5. **Deploy automático**: O Render fará o build, migrações, seeds e deploy automaticamente

## 📚 Documentação

- **[🚀 Guia de Início](./docs/GETTING_STARTED.md)** - Como configurar e executar o sistema
- **[🔓 Modo Sem Autenticação](./docs/NO_AUTH_MODE.md)** - Como usar o projeto sem middleware de autenticação
- **[🐳 Docker e PostgreSQL](./docs/DOCKER_POSTGRESQL.md)** - Como usar Docker e visualizar dados no VS Code
- **[🏗️ Estrutura do Projeto](./docs/STRUCTURE.md)** - Arquitetura e organização do código
- **[🔄 Fluxo de Dados](./docs/FLOW.md)** - Como os dados fluem através do sistema
- **[📚 Bibliotecas](./docs/LIBRARIES.md)** - Explicação de todas as dependências e suas funções

## 🔓 Modo Sem Autenticação

**O projeto funciona sem middleware de autenticação obrigatório!** 

Isso permite testar todas as funcionalidades sem configuração complexa de autenticação. Veja como:

```bash
# Teste simples - o servidor funciona sem autenticação
npm start

# Teste com usuário mock via query params
curl "http://localhost:3001/api/actions/permissions?userRole=student"

# Teste com usuário mock via headers
curl -H "X-User-ID: 1" -H "X-User-Role: admin" "http://localhost:3001/api/actions/permissions"
```

**📖 [Guia Completo do Modo Sem Autenticação](./docs/NO_AUTH_MODE.md)**

## ⚡ Início Rápido

### Pré-requisitos
- Docker e Docker Compose instalados
- Git

### Configuração Local
```bash
# Clone o repositório
git clone https://github.com/JohnWKenny/IChaves-Backend.git
cd IChaves-Backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp env.example .env
# Edite o arquivo .env com suas configurações

# Inicie os serviços com Docker
docker-compose up -d

# Execute as migrações
docker-compose exec backend npm run db:migrate

# Execute o seed (dados de exemplo)
docker-compose exec backend npm run db:seed
```

### Configuração para Produção (Render)
```bash
# Clone o repositório
git clone https://github.com/JohnWKenny/IChaves-Backend.git
cd IChaves-Backend

# Instale as dependências
npm install

# Execute as migrações para produção
npm run db:deploy
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

## 🔧 Variáveis de Ambiente

### Desenvolvimento Local
Copie o arquivo `env.example` para `.env` e configure as seguintes variáveis:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ichaves_db"

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# JWT (if using authentication)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
```

### Produção (Render)
Configure estas variáveis no dashboard do Render:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | String de conexão PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | Ambiente de execução | `production` |
| `FRONTEND_URL` | URL do frontend | `https://your-frontend.vercel.app` |
| `JWT_SECRET` | Chave secreta JWT | `sua-chave-super-secreta` |
| `RATE_LIMIT_WINDOW_MS` | Janela de rate limiting | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Máximo de requests por IP | `100` |
| `PORT` | Porta do servidor | `10000` (automático no Render) |

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

#### Desenvolvimento Local
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

#### Produção (Render)
```bash
# Executar migrações em produção
npm run db:deploy

# Gerar cliente Prisma
npx prisma generate

# Abrir Prisma Studio (se configurado)
npx prisma studio
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

## 🤝 Contribuindo

1. **Fork o projeto**
2. **Crie uma branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit suas mudanças** (`git commit -m 'Add some AmazingFeature'`)
4. **Push para a branch** (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔗 Links Úteis

- **Repositório:** [https://github.com/JohnWKenny/IChaves-Backend](https://github.com/JohnWKenny/IChaves-Backend)
- **Issues:** [https://github.com/JohnWKenny/IChaves-Backend/issues](https://github.com/JohnWKenny/IChaves-Backend/issues)
- **Render Deploy:** [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/JohnWKenny/IChaves-Backend)

---

**Desenvolvido com ❤️ pela equipe IChaves**

> 💡 **Dica:** Consulte a [documentação completa](./docs/) para informações detalhadas sobre cada aspecto do projeto.
