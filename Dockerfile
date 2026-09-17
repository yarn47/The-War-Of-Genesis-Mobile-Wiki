# ─── 빌드 ─────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /src

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# API 주소는 빌드 시점에 JS에 들어감 (docker build --build-arg VITE_API_URL=...)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ─── 서빙 ─────────────────────────────────────────────────
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist /usr/share/nginx/html
