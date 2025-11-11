# 🚀 Guia de Deploy - IChaves Backend

Este guia explica como fazer o deploy do IChaves Backend no Render.

## 📋 Pré-requisitos

- Conta no [Render](https://render.com)
- Conta no [GitHub](https://github.com)
- Banco de dados PostgreSQL (recomendamos [Supabase](https://supabase.com) ou [Neon](https://neon.tech))

## 🔧 Configuração do Banco de Dados

### Opção 1: Render PostgreSQL (Recomendado)
1. No dashboard do Render, clique em **New +** → **PostgreSQL**
2. Configure o banco:
   - **Name**: `ichaves-database`
   - **Database**: `ichaves_db`
   - **User**: `ichaves_user`
   - **Region**: Escolha a mesma região do seu web service
3. Após criar, copie a **Internal Database URL**
4. Use esta string como `DATABASE_URL`

### Opção 2: Supabase
1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em **Settings** → **Database**
4. Copie a **Connection string** (URI)
5. Use esta string como `DATABASE_URL`

### Opção 3: Neon
1. Acesse [neon.tech](https://neon.tech) e crie uma conta
2. Crie um novo projeto
3. Copie a **Connection string**
4. Use esta string como `DATABASE_URL`

## 🚀 Deploy no Render

### Passo 1: Criar Web Service
1. Acesse [render.com](https://render.com)
2. Faça login com sua conta GitHub
3. Clique em **New +** → **Web Service**
4. Selecione **Connect a repository**
5. Escolha o repositório: `JohnWKenny/IChaves-Backend`
6. Clique em **Connect**

### Passo 2: Configurar o Serviço
Configure as seguintes opções:
- **Name**: `ichaves-backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Passo 3: Configurar Variáveis de Ambiente
No dashboard do Render, configure as seguintes variáveis:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `DATABASE_URL` | `postgresql://...` | String de conexão do PostgreSQL |
| `NODE_ENV` | `production` | Ambiente de produção |
| `FRONTEND_URL` | `https://seu-frontend.vercel.app` | URL do seu frontend |
| `JWT_SECRET` | `sua-chave-super-secreta` | Chave secreta para JWT |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Janela de rate limiting (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Máximo de requests por IP |

### Passo 4: Deploy
1. Clique em **Create Web Service**
2. Aguarde o build completar (inclui migrações e seeds automáticas)
3. O Render fornecerá uma URL como: `https://ichaves-backend.onrender.com`

### ⚡ Migrações e Seeds Automáticas
O projeto está configurado para executar automaticamente durante o deploy:
- **Migrações**: Aplicadas automaticamente (`prisma migrate deploy`)
- **Seeds**: Dados iniciais inseridos automaticamente (`prisma db seed`)
- **Cliente Prisma**: Gerado automaticamente (`prisma generate`)

Isso significa que seu banco será configurado automaticamente com:
- Estrutura das tabelas (User, Student, Admin, Classroom, History, Notification)
- Dados iniciais (usuário admin, salas de exemplo, etc.)

## 🔄 Executar Migrações (Opcional)

As migrações são executadas automaticamente durante o deploy. Se precisar executar manualmente:

### Via Render Shell
```bash
# Acesse o Shell do Render no dashboard
# Execute as migrações diretamente no ambiente de produção
npx prisma migrate deploy
npx prisma db seed
```

### Via Script Local
```bash
# Configurar DATABASE_URL localmente
export DATABASE_URL="sua-string-de-conexao"

# Executar setup completo
npm run db:setup
```

## 🧪 Testar o Deploy

Após o deploy, teste os endpoints:

```bash
# Health check
curl https://sua-url.onrender.com/health

# Listar usuários
curl https://sua-url.onrender.com/api/users
```

## 🔧 Configurações Adicionais

### Domínio Customizado
1. No dashboard do Render, vá em **Settings** → **Custom Domains**
2. Adicione seu domínio customizado
3. Configure os DNS conforme instruções

### Variáveis de Ambiente por Ambiente
Você pode configurar variáveis diferentes para:
- **Production**: Produção
- **Preview**: Branches de desenvolvimento
- **Development**: Ambiente local

## 🚨 Troubleshooting

### Erro de Build
- Verifique se todas as dependências estão no `package.json`
- Confirme se o `render.yaml` está configurado corretamente
- Verifique os logs de build no dashboard do Render

### Erro de Conexão com Banco
- Confirme se a `DATABASE_URL` está correta
- Verifique se o banco permite conexões externas
- Teste a conexão localmente

### Erro de Migrações
- Execute `npx prisma generate` localmente
- Confirme se o banco está acessível
- Verifique se as migrações estão no diretório `prisma/migrations`

## 📊 Monitoramento

### Logs
- Acesse o dashboard do Render
- Vá em **Logs** para ver logs em tempo real
- Monitore erros e performance

### Métricas
- **Uptime**: Monitora disponibilidade
- **Response Time**: Tempo de resposta
- **Error Rate**: Taxa de erros

## 🔄 Atualizações

Para atualizar o deploy:
1. Faça push das mudanças para o GitHub
2. O Render fará deploy automático
3. Execute migrações se necessário: `npm run db:deploy`

## 📞 Suporte

Se encontrar problemas:
1. Verifique os [logs do Render](https://dashboard.render.com)
2. Consulte a [documentação do Render](https://render.com/docs)
3. Abra uma [issue no GitHub](https://github.com/JohnWKenny/IChaves-Backend/issues)

