# 🚀 Guia de Início - Backend IChaves

Este guia te ajudará a configurar e executar o backend do sistema IChaves.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Docker** (versão 20 ou superior)
- **Docker Compose** (versão 2 ou superior)
- **Git** (controle de versão)

> **Nota:** O sistema usa Docker para PostgreSQL e o backend, então não é necessário instalar Node.js ou PostgreSQL localmente.

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd IChaves/backend
```

### 2. Configure o ambiente Docker
```bash
# Copie o arquivo de exemplo (opcional)
cp .env.example .env

# Edite o arquivo .env se necessário (as variáveis já estão no docker-compose.yml)
```

### 3. Inicie os serviços com Docker
```bash
# Inicie PostgreSQL e Backend 
docker-compose up -d 

# Execute as migrações do banco
docker-compose exec backend npm run db:migrate

# Execute o seed para dados de exemplo
docker-compose exec backend npm run db:seed
```

## 🏃‍♂️ Executando o Sistema

### Modo Desenvolvimento (Docker)
```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f backend

# Parar os serviços
docker-compose down
```

O servidor será iniciado em `http://localhost:3001`

### Modo Produção (Docker)
```bash
# Build das imagens
docker-compose build

# Iniciar em modo produção
docker-compose up -d
```

### Desenvolvimento Local (Opcional)
Se preferir desenvolver localmente sem Docker:

```bash
# Instalar dependências
npm install

# Configurar banco local
npm run db:migrate
npm run db:seed

# Executar servidor
npm run dev
```

## 🧪 Testando o Sistema

### Teste do Servidor (Docker)
```bash
# Executar teste dentro do container
docker-compose exec backend npm run test:server

# Demonstração de tratamento de erros
docker-compose exec backend npm run demo:errors
```

### Teste Local (se desenvolvendo sem Docker)
```bash
npm run test:server
npm run demo:errors
```

## 🚀 Executando Scripts

### Scripts Disponíveis

#### **Teste do Servidor**
```bash
# Docker
docker-compose exec backend npm run test:server

# Local
npm run test:server
```
**Função:** Testa se o servidor está funcionando corretamente, incluindo:
- Inicialização do servidor
- Health check endpoint
- Configuração de CORS
- Conectividade com banco de dados

#### **Demonstração de Tratamento de Erros**
```bash
# Docker
docker-compose exec backend npm run demo:errors

# Local
npm run demo:errors
```
**Função:** Demonstra o sistema completo de tratamento de erros:
- Erros de validação
- Erros de autenticação
- Erros 404
- Respostas de sucesso
- Logs estruturados

#### **Migrações do Banco**
```bash
# Docker
docker-compose exec backend npm run db:migrate

# Local
npm run db:migrate
```
**Função:** Executa as migrações do Prisma para criar/atualizar tabelas

#### **Seed do Banco**
```bash
# Docker
docker-compose exec backend npm run db:seed

# Local
npm run db:seed
```
**Função:** Popula o banco com dados de exemplo

### Scripts de Desenvolvimento

#### **Servidor de Desenvolvimento**
```bash
# Docker
docker-compose up -d

# Local
npm run dev
```

#### **Build do Projeto**
```bash
# Docker (não necessário - já buildado)
docker-compose build

# Local
npm run build
```

#### **Servidor de Produção**
```bash
# Docker
docker-compose up -d

# Local
npm run start
```

## 📊 Endpoints Disponíveis

### Health Check
- **GET** `/health` - Status do servidor

### Exemplos de Erro
- **GET** `/api/examples/validation` - Erro de validação
- **GET** `/api/examples/auth` - Erro de autenticação
- **GET** `/api/examples/not-found` - Erro 404
- **GET** `/api/examples/success` - Resposta de sucesso

### Rotas de Exemplo Feitas para Mostrar o Fluxo
- **GET** `/api/users` - Listar usuários
- **POST** `/api/users` - Criar usuário
- **GET** `/api/users/:id` - Buscar usuário por ID
- **PUT** `/api/users/:id` - Atualizar usuário
- **DELETE** `/api/users/:id` - Deletar usuário

## 🔧 Scripts Disponíveis

### Scripts Docker
| Script | Descrição |
|--------|-----------|
| `docker-compose up -d` | Iniciar todos os serviços |
| `docker-compose down` | Parar todos os serviços |
| `docker-compose logs -f backend` | Ver logs do backend |
| `docker-compose exec backend npm run <script>` | Executar script no container |

### Scripts NPM (dentro do container)
| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build do projeto |
| `npm run start` | Servidor de produção |
| `npm run test:server` | Teste do servidor |
| `npm run demo:errors` | Demo do sistema de erros |
| `npm run db:migrate` | Executar migrações |
| `npm run db:seed` | Executar seed |

> **💡 Dica:** Para comandos detalhados, consulte a seção [🚀 Executando Scripts](#-executando-scripts) acima.

## 🐛 Solução de Problemas

### Erro de Porta em Uso (Docker)
```bash
# Parar containers que podem estar usando as portas
docker-compose down

# Verificar processos usando as portas
docker ps

# Forçar parada de containers
docker-compose down --remove-orphans
```

### Erro de Banco de Dados (Docker)
```bash
# Verificar se PostgreSQL está rodando
docker-compose ps postgres

# Ver logs do PostgreSQL
docker-compose logs postgres

# Reiniciar apenas o banco
docker-compose restart postgres

# Executar migrações novamente
docker-compose exec backend npm run db:migrate
```

### Erro de Container
```bash
# Rebuild da imagem
docker-compose build --no-cache backend

# Reiniciar todos os serviços
docker-compose down && docker-compose up -d
```

### Erro de Dependências (Desenvolvimento Local)
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

## 🐳 Configuração Docker

### Serviços Disponíveis

O `docker-compose.yml` configura dois serviços:

#### **PostgreSQL Database**
- **Container:** `ichaves-postgres`
- **Porta:** `5432`
- **Banco:** `IChaves`
- **Usuário:** `postgres`
- **Senha:** `1234567890`

#### **Backend Application**
- **Container:** `ichaves-backend`
- **Porta:** `3001`
- **Ambiente:** Desenvolvimento
- **Dependências:** PostgreSQL

### Variáveis de Ambiente (Docker)

As seguintes variáveis estão configuradas no `docker-compose.yml`:

```yaml
DATABASE_URL: "postgresql://postgres:1234567890@postgres:5432/IChaves"
JWT_SECRET: "ichaves-super-secret-key-2024"
JWT_EXPIRES_IN: "7d"
PORT: 3001
NODE_ENV: "development"
CORS_ORIGIN: "http://localhost:3000"
```

### Comandos Docker Úteis

```bash
# Ver status dos containers
docker-compose ps

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f postgres

# Executar comandos dentro do container
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed

# Acessar shell do container
docker-compose exec backend sh

# Rebuild apenas um serviço
docker-compose build backend

# Parar e remover volumes
docker-compose down -v
```

## 📝 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/     # Controladores HTTP
│   ├── services/        # Lógica de negócio
│   ├── routes/          # Rotas da API
│   ├── middleware/      # Middlewares
│   ├── models/         # Caso necessario, mas o Prisma já faz esse papel
│   ├── utils/          # Utilitários
│   └── types/          # Tipos TypeScript
├── prisma/
│   ├── schema.prisma   # Schema do banco
│   ├── migrations/     # Migrações
│   └── seed.ts         # Dados iniciais
├── scripts/            # Scripts de teste
└── docs/              # Documentação
```

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do servidor
2. Consulte a [Documentação da Estrutura](./STRUCTURE.md)
3. Entenda o [Fluxo de Dados](./FLOW.md)
4. Abra uma issue no repositório

## 🎯 Próximos Passos

Após configurar o sistema:

1. Leia a [Documentação da Estrutura](./STRUCTURE.md)
2. Entenda o [Fluxo de Dados](./FLOW.md)
3. Explore os endpoints disponíveis
4. Desenvolva novas funcionalidades

---

**Bem-vindo ao IChaves! 🎉**
