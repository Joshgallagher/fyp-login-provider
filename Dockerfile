FROM node:10.16.0-alpine

WORKDIR /app

RUN apk add --no-cache tini

COPY package*.json ./

RUN npm install && npm cache clean --force

ENTRYPOINT [ "/sbin/tini", "--" ]

CMD [ "node", "app.js" ]
