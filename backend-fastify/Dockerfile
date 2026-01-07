FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .
RUN npm install


WORKDIR /usr/src/app/app/backend

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]