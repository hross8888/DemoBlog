import redis
from django.apps import AppConfig
from django.conf import settings

from . import redis_wrapper


class AuthappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authapp'

    def ready(self):
        try:
            client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=settings.REDIS_DB,
                password=settings.REDIS_PASS,
                decode_responses=True,
            )
            client.ping()  # Проверяем соединение
            redis_wrapper.redis_client = client
        except redis.RedisError as e:
            raise RuntimeError(f"Не удалось подключиться к Redis: {e}")
