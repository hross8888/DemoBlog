# ====== Stage 1: build frontend ======
FROM node:18-alpine AS build

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build


# ====== Stage 2: nginx + certbot + templates ======
FROM nginx:stable-alpine-slim

# Установка зависимостей: certbot, bash, envsubst
RUN apk add --no-cache certbot certbot-nginx bash gettext

# Копируем собранный фронт
COPY --from=build /app/dist /usr/share/nginx/html

# Удаляем дефолтный конфиг, чтобы не мешал
RUN rm /etc/nginx/conf.d/default.conf || true

# Папка для Let's Encrypt challenge
RUN mkdir -p /var/www/certbot

# Копируем шаблоны конфигов
COPY infra/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY infra/nginx/default_http.conf.template /etc/nginx/templates/default_http.conf.template
COPY infra/nginx/proxy.conf.template /etc/nginx/templates/proxy.conf.template

# Копируем entrypoint
COPY infra/nginx/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
