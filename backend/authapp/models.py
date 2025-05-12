import uuid
from datetime import datetime, timedelta, timezone

from django.contrib.auth.models import User
from django.db import models

from backend import settings

expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXP_MINUTES)


def generate_jti():
    return str(uuid.uuid4())


def default_expires_at():
    return datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXP_MINUTES)


class JWTToken(models.Model):
    jti = models.CharField(max_length=36, default=generate_jti)
    subject = models.ForeignKey(User, on_delete=models.CASCADE, related_name="subjects")
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=default_expires_at)

    class Meta:
        indexes = [
            models.Index(fields=["subject"]),
            models.Index(fields=["expires_at"]),
        ]
