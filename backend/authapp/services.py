import uuid
from datetime import datetime, timedelta, timezone

import jwt
from django.conf import settings
from django.contrib.auth.models import User

from authapp.models import JWTToken
from authapp.redis_wrapper import get_redis
from backend.settings import REVOKED_JWT_TTL


def create_access_token(user: User) -> str:
    jti = str(uuid.uuid4())
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXP_MINUTES)

    payload = {
        "sub": str(user.id),
        "exp": expire,
        "jti": jti,
    }

    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    JWTToken.objects.create(
        jti=jti,
        subject=user,
        expires_at=expire,
    )

    return token


def decode_token(token: str) -> dict:
    return jwt.decode(
        token,
        settings.JWT_SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],
        options={"verify_signature": True, "verify_exp": True},
    )


def delete_access_token(token: str) -> bool:
    try:
        payload = decode_token(token)
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return False

    jti = payload.get("jti")
    get_redis().setex(f"revoked_jwt:{jti}", REVOKED_JWT_TTL, 1)
    deleted, _ = JWTToken.objects.get(jti=jti).delete()
    return deleted > 0
