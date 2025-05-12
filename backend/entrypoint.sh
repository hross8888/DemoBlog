#!/bin/sh

set -e

echo "Ждём БД..."
# Ждёт подключения к БД
while ! nc -z postgres 5432; do
  sleep 0.1
done

echo "Применяем миграции..."
python manage.py migrate --noinput

echo "Создаём суперпользователя..."

DJANGO_SUPERUSER_USERNAME=${DJANGO_SUPERUSER_USERNAME}
DJANGO_SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL}
DJANGO_SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD}

python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username="$DJANGO_SUPERUSER_USERNAME").exists():
    User.objects.create_superuser(
        username="$DJANGO_SUPERUSER_USERNAME",
        email="$DJANGO_SUPERUSER_EMAIL",
        password="$DJANGO_SUPERUSER_PASSWORD"
    )
EOF

echo "Собираем статику..."
python manage.py collectstatic --noinput

echo "Запускаем gunicorn..."
exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000
