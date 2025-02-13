# 빌드 스테이지
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 프로덕션 스테이지
FROM nginx:alpine
# dist 폴더 COPY 제거 (볼륨 마운트로 대체)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
