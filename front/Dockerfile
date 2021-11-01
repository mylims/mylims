FROM node:16 AS builder
WORKDIR /usr/mylims-front
COPY . .
COPY .env.example ./.env
RUN npm ci 
RUN npm run tailwind:build
RUN npm run build
RUN rm .env

FROM steebchen/nginx-spa:stable
COPY --from=builder /usr/mylims-front/dist /app
EXPOSE 80
CMD ["nginx"]
