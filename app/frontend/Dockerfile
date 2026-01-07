FROM node:18-alpine AS builder

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

WORKDIR /usr/src/app/app/frontend
ARG VITE_API_URL
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

FROM nginx:alpine

COPY --from=builder /usr/src/app/app/frontend/dist /usr/share/nginx/html

# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]