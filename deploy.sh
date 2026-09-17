#!/usr/bin/env bash
# 서버에서 git pull 후 실행: 이미지 빌드 → genesis-wiki 컨테이너 교체
set -euo pipefail
cd "$(dirname "$0")"

# 기본은 같은 도메인의 /api (Caddy가 /api/* 를 백엔드 8080으로 전달)
# 다른 주소로 빌드하려면: VITE_API_URL=https://... ./deploy.sh
API_URL="${VITE_API_URL:-/api}"
echo "API 주소: $API_URL"

docker build --build-arg VITE_API_URL="$API_URL" -t genesis-wiki .

docker rm -f genesis-wiki 2>/dev/null || true
docker run -d --name genesis-wiki \
    -p 8081:80 \
    --restart unless-stopped \
    genesis-wiki

docker ps --filter name=genesis-wiki
