FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl-dev openssl

COPY package*.json ./
RUN npm install --production

COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma

RUN npx prisma generate

EXPOSE 5000

# Run migrations and seed on startup
CMD ["sh", "-c", "npx prisma migrate deploy && npx ts-node prisma/seed.ts && node dist/server.js"]
