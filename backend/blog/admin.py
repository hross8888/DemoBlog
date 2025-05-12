from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

from .models import Comment, Like, Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "author", "text", "created_at")
    list_filter = ("author", "created_at")
    search_fields = ("text", "author__username")
    ordering = ("-created_at",)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "post_id", "author", "text", "created_at", "post_link")
    list_filter = ("author", "created_at")
    search_fields = ("text", "author__username", "post__text")
    ordering = ("-created_at",)

    @admin.display(description="Post")
    def post_link(self, obj):
        url = reverse("admin:blog_post_change", args=[obj.post.id])
        return format_html('<a href="{}">Go to post</a>', url, obj.post.id)


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ("id", "post_id", "user", "post_link")
    list_filter = ("user",)
    search_fields = ("user__username", "post__text")

    @admin.display(description="Post")
    def post_link(self, obj):
        url = reverse("admin:blog_post_change", args=[obj.post.id])
        return format_html('<a href="{}">Go to post</a>', url, obj.post.id)
