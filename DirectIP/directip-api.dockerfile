FROM node:latest

WORKDIR /usr/src/app/directip-api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7777

CMD ["npm", "run", "directip-api"]
