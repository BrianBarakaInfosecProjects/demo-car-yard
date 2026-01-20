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
RUN npm install --production && npm install --save ts-node

COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma

RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npx prisma db seed

EXPOSE 5000

CMD ["node", "dist/server.js"]
