FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY server.js /app


ENV PORT = 3000

EXPOSE 3000

CMD [ "npm", "start"]