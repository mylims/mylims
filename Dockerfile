FROM node:16 AS builder
WORKDIR /usr/mylims
COPY .env.example ./.env
COPY . .
RUN npm ci
# RUN node scripts/prune-addons.mjs
RUN npm run build
RUN rm build/.env

FROM node:16
WORKDIR /usr/mylims
ENV NODE_ENV production
#ENV ENV_SILENT true
COPY --from=builder /usr/mylims/build ./
COPY ./scripts ./scripts
RUN npm ci --ignore-scripts && node scripts/prepare.mjs && npm rebuild
EXPOSE 3333
CMD ["node", "server.js"]
