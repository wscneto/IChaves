# IChaves Frontend

Sistema de gerenciamento de chaves de salas de aula desenvolvido com Nuxt 4, Vue 3 e TypeScript.

## 🚀 Tecnologias

- **Nuxt 4** - Framework Vue.js para aplicações full-stack
- **Vue 3** - Framework JavaScript progressivo
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Pinia** - Store de estado para Vue
- **Nuxt UI** - Componentes UI para Nuxt

## 📋 Pré-requisitos

- Node.js 18+ 
- npm, pnpm, yarn ou bun

## 🛠️ Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd IChaves-Frontend

# Instale as dependências
npm install
# ou
pnpm install
# ou
yarn install
# ou
bun install
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
NUXT_PUBLIC_API_URL=http://localhost:3001/api
```

Para produção, configure a variável `NUXT_PUBLIC_API_URL` no Vercel com a URL da sua API.

## 🚀 Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
pnpm dev
# ou
yarn dev
# ou
bun run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## 🏗️ Build para Produção

```bash
npm run build
# ou
pnpm build
# ou
yarn build
# ou
bun run build
```

## 📦 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure a variável de ambiente `NUXT_PUBLIC_API_URL`
3. O deploy será feito automaticamente

### Outros provedores

Consulte a [documentação de deploy do Nuxt](https://nuxt.com/docs/getting-started/deployment) para outras opções.

## 📁 Estrutura do Projeto

```
├── assets/          # Recursos estáticos (CSS, imagens, fontes)
├── components/      # Componentes Vue reutilizáveis
├── data/           # Dados estáticos
├── layouts/        # Layouts da aplicação
├── pages/          # Páginas da aplicação (roteamento automático)
├── public/         # Arquivos públicos
├── services/       # Serviços de API
├── stores/         # Stores do Pinia
├── types/          # Definições de tipos TypeScript
└── nuxt.config.ts  # Configuração do Nuxt
```

## 🔗 API

O frontend consome uma API REST. Consulte o arquivo `docs/API.md` para documentação completa da API.

## 📝 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção
- `npm run generate` - Geração estática

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
