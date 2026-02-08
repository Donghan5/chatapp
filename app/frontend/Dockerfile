FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY tsconfig.base.json ./

COPY packages ./packages

RUN npm install

####################################
# TESTING, if not working use this #
# Before, make sure of npm install #
####################################
# COPY node_modules ./node_modules

COPY app/frontend ./app/frontend

WORKDIR /usr/src/app/app/frontend

ARG VITE_API_URL
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/app/frontend/dist /usr/share/nginx/html
COPY --from=builder /usr/src/app/app/frontend/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]