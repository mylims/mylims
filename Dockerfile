FROM node:14 as builder
WORKDIR /usr/mylims
COPY package*.json ./
RUN npm ci
COPY . .
RUN node prune-addons.mjs
RUN npm run build
EXPOSE 3333
VOLUME ["/usr/mylims/addons", "/usr/mylims/config"]

FROM node:14
WORKDIR /usr/mylims
COPY --from=builder /usr/mylims/build ./
COPY package*.json .
RUN npm ci

CMD ["node", "./build/server.js"]