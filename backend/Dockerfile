# 1. Use uma imagem base oficial do Node.js. A versão alpine é leve.
FROM node:18-alpine

# 2. Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# 3. Copie os arquivos de dependência e instale-as
# Isso aproveita o cache do Docker, reinstalando dependências apenas se o package.json mudar
COPY package*.json ./

# 4. Copie o schema do Prisma para gerar o client
COPY prisma ./prisma/

# 5. Instale as dependências
RUN npm install

# 6. Gere o Prisma Client (essencial para o seu código funcionar)
RUN npx prisma generate

# 7. Copie o restante do código da sua aplicação
COPY . .

# 8. Exponha a porta que sua aplicação vai usar (ajustado para 3001 conforme package.json)
EXPOSE 3001

# 9. O comando para iniciar a sua aplicação
# Usando npm run dev conforme definido no package.json
CMD ["npm", "run", "dev"]
