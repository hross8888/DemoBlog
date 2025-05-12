"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI

from authapp.api import router as auth_router
from authapp.security import AuthBearer
from backend import settings
from blog.comment.api import router as comment_router
from blog.like.api import router as like_router
from blog.post.api import router as blog_router

api = NinjaAPI(
    auth=AuthBearer(),
    docs_url=None if not settings.DEBUG else "/docs",
    openapi_url=None if not settings.DEBUG else "/openapi.json",
)

api.add_router("/auth/", auth_router)
api.add_router("/post/", blog_router)
api.add_router("/like/", like_router)
api.add_router("/comment/", comment_router)
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]
