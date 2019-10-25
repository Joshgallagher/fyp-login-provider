FROM node:10.16.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install && npm cache clean --force

CMD [ "node", "app.js" ]
