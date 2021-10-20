FROM node:16 AS deps
WORKDIR /usr/mylims-front
COPY .env.example ./.env
COPY package*.json ./
RUN npm ci --ignore-scripts
RUN npm rebuild

FROM node:16 AS builder
WORKDIR /usr/mylims-front
COPY . .
COPY --from=deps /usr/mylims-front/node_modules ./node_modules
RUN npm run tailwind:build
RUN npm run build
RUN rm .env

FROM steebchen/nginx-spa:stable
COPY --from=builder /usr/mylims-front/dist /app
EXPOSE 80
CMD ["nginx"]
