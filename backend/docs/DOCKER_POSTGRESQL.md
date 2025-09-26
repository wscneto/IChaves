# Docker no Projeto IChaves - Guia Simples

## 📋 Índice
- [O que é Docker no nosso projeto?](#o-que-é-docker-no-nosso-projeto)
- [Como funciona](#como-funciona)
- [Comandos básicos](#comandos-básicos)
- [Conectando ao banco de dados](#conectando-ao-banco-de-dados)
- [Visualizando dados no VS Code](#visualizando-dados-no-vs-code)
- [Problemas comuns](#problemas-comuns)

## 🐳 O que é Docker no nosso projeto?

O Docker é como uma "caixa mágica" que contém tudo que nossa aplicação precisa para funcionar. Em vez de instalar programas diretamente no seu computador, o Docker cria ambientes isolados (chamados de containers) onde nossa aplicação roda.

### Por que usamos Docker?
- ✅ **Funciona igual em qualquer computador** (Windows, Mac, Linux)
- ✅ **Não precisa instalar nada** no seu PC (Node.js, PostgreSQL, etc.)
- ✅ **Não "bagunça" seu sistema** com instalações
- ✅ **Fácil de compartilhar** com outros desenvolvedores

### O que temos no projeto:
```
┌─────────────────┐    ┌─────────────────┐
│   Backend       │    │   Banco de     │
│   (nosso código)│◄──►│   Dados        │
│   Porta: 3001   │    │   Porta: 5432  │
└─────────────────┘    └─────────────────┘
```

**Backend:** Nosso código Node.js que faz a API funcionar  
**Banco de Dados:** Onde guardamos as informações (usuários, salas, etc.)

## 🔧 Como funciona

### Arquivos importantes:
- **`docker-compose.yml`** - Diz ao Docker quais "caixas" criar
- **`Dockerfile`** - Instruções de como montar nossa aplicação
- **`package.json`** - Lista de programas que nossa aplicação precisa

### O que acontece quando você roda o Docker:
1. **Docker lê** o arquivo `docker-compose.yml`
2. **Cria duas "caixas":**
   - Uma para nosso código (backend)
   - Uma para o banco de dados
3. **Conecta** as duas caixas para conversarem
4. **Inicia** tudo automaticamente

## 🚀 Comandos básicos

### Para iniciar o projeto:
```bash
# Liga tudo (backend + banco de dados)
docker-compose up

# Liga em segundo plano (sem mostrar logs)
docker-compose up -d
```

### Para parar o projeto:
```bash
# Para tudo
docker-compose down
```

### Para ver o que está acontecendo:
```bash
# Ver logs do backend
docker-compose logs backend

# Ver logs do banco de dados
docker-compose logs postgres
```

### Para executar comandos dentro do projeto:
```bash
# Criar tabelas no banco
docker-compose exec backend npm run db:migrate

# Popular o banco com dados de exemplo
docker-compose exec backend npm run db:seed

# Abrir o Prisma Studio (interface visual do banco)
docker-compose exec backend npx prisma studio
```

## 🗄️ Conectando ao banco de dados

### Informações para conectar:
- **Servidor:** `localhost`
- **Porta:** `5432`
- **Nome do banco:** `IChaves`
- **Usuário:** `postgres`
- **Senha:** `1234567890`

### Conectando pelo terminal:
```bash
# Entrar no banco de dados
docker-compose exec postgres psql -U postgres -d IChaves

# Comandos úteis dentro do banco:
\dt                    # Ver todas as tabelas
\d users              # Ver detalhes da tabela users
\q                    # Sair
```

## 💻 Visualizando dados no VS Code

### Passo 1: Instalar extensão:
No VS Code, instale a extensão:
- **PostgreSQL** (por Database Client)

### Passo 2: Conectar ao banco
1. Clique em Database
2. Preencha com os dados:
   - **Nome:** IChaves Database
   - **Group:** Desenvolvimento
   - **Host:** 127.0.0.1
   - **Username:** postgres
   - **Port:** 5432
   - **Password:** 1234567890
   - **Database:** IChaves
3. Clique em "Save" e "Connect"

### Passo 3: Explorar os dados
1. Abra o painel Database
2. Expanda "IChaves Database"
3. Expanda "public"
4. Expanda "Tables"
5. Clique em uma tabela e verar os valores

## ⚠️ Problemas comuns

### "Container não inicia"
```bash
# Ver o que está acontecendo
docker-compose logs

# Verificar se as portas estão ocupadas
netstat -an | findstr :5432
netstat -an | findstr :3001
```

### "Erro de conexão com banco"
```bash
# Ver se está rodando
docker-compose ps

# Reiniciar só o banco
docker-compose restart postgres
```

### "Problemas com tabelas"
```bash
# Recriar tabelas
docker-compose exec backend npx prisma migrate reset

# Popular com dados de exemplo
docker-compose exec backend npm run db:seed
```

### "Preciso limpar tudo"
```bash
# Para tudo e apaga dados (CUIDADO!)
docker-compose down -v

# Reconstruir do zero
docker-compose build --no-cache
docker-compose up
```

---

## 🎯 Dicas úteis

### Comandos rápidos (PowerShell)
Adicione ao seu perfil PowerShell:
```powershell
function dc { docker-compose $args }
function dcu { docker-compose up $args }
function dcd { docker-compose down $args }
```

### Script para desenvolvimento
Crie um arquivo `dev.ps1`:
```powershell
Write-Host "🚀 Iniciando projeto..." -ForegroundColor Green
docker-compose down
docker-compose up --build -d
Start-Sleep -Seconds 10
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npm run db:seed
Write-Host "✅ Pronto! Backend: http://localhost:3001" -ForegroundColor Green
```

---

## 📞 Precisa de ajuda?

1. **Ver logs:** `docker-compose logs`
2. **Reiniciar:** `docker-compose restart`
3. **Limpar tudo:** `docker-compose down -v`

**Última atualização:** Janeiro 2025
