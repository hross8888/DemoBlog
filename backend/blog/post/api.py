from typing import List

from django.db.models import Count, Exists, F, OuterRef
from django.http import JsonResponse
from ninja import Router
from ninja.errors import HttpError

from blog.common.dto import SuccessResponse

from ..models import Like, Post
from .schema import PostCreateRequest, PostSchema
from .services import create_post, delete_post

router = Router(tags=["posts"])


@router.get("/all", response=List[PostSchema])
def list_posts(request):
    user_liked_subquery = Like.objects.filter(
        post=OuterRef("pk"),
        user=request.auth
    )

    posts = (
        Post.objects
        .select_related("author")
        .annotate(
            author_username=F("author__username"),
            likes_count=Count("likes", distinct=True),
            liked_by_me=Exists(user_liked_subquery),
            comment_count=Count("comments", distinct=True),
        )
        .order_by("-created_at")
    )

    return [PostSchema.from_model(post, post.author_id == request.auth.id) for post in posts]


@router.post("/create", response=PostSchema)
def create(request, data: PostCreateRequest):
    post = create_post(request.auth, data.text)
    payload = PostSchema.from_model(post, True).model_dump()
    return JsonResponse(payload, status=201)


@router.delete("/delete/{post_id}")
def delete(request, post_id: int):
    success = delete_post(request.auth, post_id)
    if not success:
        raise HttpError(403, "Пост не принадлежит вам или не существует")

    return SuccessResponse()
