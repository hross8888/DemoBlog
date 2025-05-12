from django.contrib.auth import authenticate
from ninja import Router
from ninja.errors import HttpError

from authapp.dto import SuccessResponse
from authapp.schema import LoginRequest, LoginResponse
from authapp.services import create_access_token, delete_access_token

router = Router(tags=["auth"])


@router.post("/login", response=LoginResponse, auth=None)
def login(request, data: LoginRequest):
    user = authenticate(username=data.username, password=data.password)
    if not user:
        raise HttpError(401, "Invalid credentials")

    token = create_access_token(user)
    return LoginResponse(access_token=token)


@router.post("/logout", response=SuccessResponse)
def logout(request):
    auth_header = request.headers.get("authorization")
    token = auth_header.removeprefix("Bearer ").strip()
    delete_access_token(token)
    return SuccessResponse()
