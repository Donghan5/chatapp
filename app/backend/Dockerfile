# FROM node:20-alpine

# WORKDIR /usr/src/app

# COPY . .
# RUN npm install


# WORKDIR /usr/src/app/app/backend

# RUN npm run build

# EXPOSE 3000

# CMD ["node", "dist/main.js"]

###########
# TESTING #
###########

FROM node:20

WORKDIR /usr/src/app

COPY tsconfig.base.json ./
COPY package.json ./

COPY node_modules ./node_modules

COPY packages ./packages

COPY app/backend ./app/backend

WORKDIR /usr/src/app/app/backend

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]