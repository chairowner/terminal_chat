FROM node:18-alpine

WORKDIR /app

COPY ./server/package*.json ./
RUN npm install

COPY ./server ./

EXPOSE 3000 3001

CMD ["npm", "run", "dev"]
