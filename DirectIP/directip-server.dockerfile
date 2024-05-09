FROM node:latest

WORKDIR /usr/src/app/directip-server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 10800

CMD ["npm", "run", "directip-server"]
