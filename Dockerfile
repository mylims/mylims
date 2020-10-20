FROM node:14 as builder
WORKDIR /usr/mylims
COPY .env.example ./.env
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN node scripts/prune-addons.mjs
RUN npm run build
RUN rm build/.env
# TODO(targos): replace this once Adonis supports custom tsconfig for production.
RUN rm -r build/tests

FROM node:14
WORKDIR /usr/mylims
ENV NODE_ENV production
#ENV ENV_SILENT true
COPY --from=builder /usr/mylims/build ./
COPY package*.json ./
RUN npm ci --ignore-scripts
RUN node ace generate:manifest
EXPOSE 3333
CMD [ "node", "server.js" ]