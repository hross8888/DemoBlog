#!/bin/sh

set -e

CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

if [ "$WITH_PROXY" = "true" ]; then
  echo "[INFO] Режим WITH_PROXY включён. Генерируем nginx-конфиг без SSL..."
  envsubst '$DOMAIN' < /etc/nginx/templates/proxy.conf.template > /etc/nginx/conf.d/default.conf
  exec nginx -g "daemon off;"
fi

echo "[INFO] WITH_PROXY выключен. Проверяем наличие сертификата..."

if [ ! -f "$CERT_PATH" ]; then
  echo "[INFO] Сертификат не найден, запускаем временный nginx..."

  envsubst '$DOMAIN' < /etc/nginx/templates/default_http.conf.template > /etc/nginx/conf.d/default.conf

  nginx -g "daemon off;" &
  nginx_pid=$!

  sleep 3

  certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    -d "$DOMAIN" \
    --email "admin@$DOMAIN" \
    --agree-tos \
    --non-interactive \
    --quiet

  kill "$nginx_pid"
  sleep 2
fi

echo "[INFO] Генерируем финальный HTTPS конфиг..."
envsubst '$DOMAIN' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g "daemon off;"
