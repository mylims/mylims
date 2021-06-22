FROM node:16 AS deps
WORKDIR /usr/mylims-front
COPY package.json package-lock.json ./
RUN npm ci

FROM node:16 as builder
WORKDIR /usr/mylims-front
COPY . .
COPY --from=deps /usr/mylims-front/node_modules ./node_modules
RUN npm run build

FROM node:16
WORKDIR /usr/mylims-front
ENV NODE_ENV production

COPY --from=builder /usr/mylims-front/next.config.js ./
COPY --from=builder /usr/mylims-front/public ./public
COPY --from=builder /usr/mylims-front/.next ./.next
COPY --from=builder /usr/mylims-front/node_modules ./node_modules
COPY --from=builder /usr/mylims-front/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]
