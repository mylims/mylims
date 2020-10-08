FROM node:current

WORKDIR /usr/mylims

COPY package*.json ./

RUN npm install

COPY . .

RUN node prune-addons.mjs

RUN npm run build

EXPOSE 3333

VOLUME ["/usr/mylims/addons", "/usr/mylims/config"]

CMD ["node", "./build/server.js"]