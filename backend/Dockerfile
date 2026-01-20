FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl-dev openssl postgresql-client

COPY package*.json ./
RUN npm install --production ts-node

COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

RUN npx prisma generate
# Compile seed script to JS
RUN npx -p typescript -p @types/node tsc prisma/seed.ts --outDir prisma --module commonjs --target es2020 --esModuleInterop
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 5000

# Use entrypoint script that handles migrations, seed, and server start
CMD ["/app/docker-entrypoint.sh"]
