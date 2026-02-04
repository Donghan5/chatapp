FROM node:20-alpine AS builder

# 1. [작업 위치] 프로젝트의 뿌리(Root)입니다.
WORKDIR /usr/src/app

# 2. [파일 복사] 루트에 필요한 파일들을 먼저 배치합니다.
COPY tsconfig.base.json ./

# 3. [중요] packages 폴더를 '루트'에 복사해야 서로 찾을 수 있습니다.
COPY packages ./packages

# 4. [중요] node_modules도 '루트'에 둡니다. (Monorepo Hoisting 구조 유지)
COPY node_modules ./node_modules

# 5. [소스 복사] 프론트엔드 코드를 제 자리에 넣습니다.
COPY app/frontend ./app/frontend

# 6. [위치 이동] 이제 빌드를 위해 프론트엔드 방으로 들어갑니다.
WORKDIR /usr/src/app/app/frontend

# 7. 환경 변수 설정
ARG VITE_API_URL
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# 8. 빌드 실행 (이미 node_modules가 루트에 있어서 잘 찾음)
RUN npm run build

# --- Nginx 단계 (변경 없음) ---
FROM nginx:alpine
COPY --from=builder /usr/src/app/app/frontend/dist /usr/share/nginx/html
COPY --from=builder /usr/src/app/app/frontend/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]