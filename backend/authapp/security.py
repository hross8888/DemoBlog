import jwt
from django.contrib.auth.models import User
from django.http import HttpRequest
from ninja.errors import HttpError
from ninja.security import HttpBearer

from authapp.models import JWTToken
from authapp.redis_wrapper import get_redis
from authapp.services import decode_token
from backend.settings import REVOKED_JWT_TTL


class AuthBearer(HttpBearer):
    def authenticate(self, request: HttpRequest, token: str) -> User:
        details = "Unauthorized"
        # Валидируем токен.
        try:
            payload = decode_token(token)
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            raise HttpError(401, details)

        jti = payload.get("jti")
        user_id = payload.get("sub")

        # Проверяем, не числится ли он как отозванный.
        if not jti or get_redis().exists(f"revoked_jwt:{jti}"):
            raise HttpError(401, details)

        # Проверяем, не отсутствует ли он в базе, возможно redis его потерял.
        token_obj = JWTToken.objects.filter(jti=jti, subject_id=user_id).first()
        if not token_obj:
            # В идеале высчитывать оставшееся время жизни токена, но для примера сойдет.
            get_redis().setex(f"revoked_jwt:{jti}", REVOKED_JWT_TTL, 1)
            raise HttpError(401, details)

        # Проверяем юзера, мб он удален.
        user = User.objects.filter(id=user_id).first()
        if not user:
            token_obj.delete()
            raise HttpError(401, details)

        return user
