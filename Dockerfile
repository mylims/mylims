FROM node:current

WORKDIR /usr/mylims

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN node ace addons:prune

EXPOSE 3333

VOLUME ["/usr/mylims/addons", "/usr/mylims/config"]

CMD ["node", "./build/server.js"]