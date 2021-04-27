FROM node:14 AS deps
WORKDIR /usr/mylims
COPY .env.example ./.env
COPY package*.json ./
RUN npm ci --ignore-scripts
RUN npm rebuild

FROM node:14 AS builder
WORKDIR /usr/mylims
COPY . .
COPY --from=deps /usr/mylims/node_modules ./node_modules
RUN node scripts/prune-addons.mjs
RUN npm run build
RUN rm build/.env

FROM node:14
WORKDIR /usr/mylims
ENV NODE_ENV production
#ENV ENV_SILENT true
COPY --from=builder /usr/mylims/build ./
COPY --from=deps /usr/mylims/package*.json ./
RUN npm ci --ignore-scripts
EXPOSE 3333
CMD [ "node", "server.js" ]