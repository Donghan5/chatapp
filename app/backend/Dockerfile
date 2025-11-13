FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install

COPY . .


WORKDIR /usr/src/app/app/backend

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]