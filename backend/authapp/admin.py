from django.contrib import admin

from .models import JWTToken


@admin.register(JWTToken)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "jti", "subject", "created_at", "expires_at")
    list_filter = ("subject", "created_at")
    search_fields = ("subject__id", "subject__username")
    ordering = ("-created_at",)
