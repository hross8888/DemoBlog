from django.db.models import F
from django.http import JsonResponse
from ninja import Router
from ninja.errors import HttpError

from blog.comment.schema import CommentCreateRequest, CommentSchema
from blog.comment.services import create_comment, delete_comment
from blog.common.dto import SuccessResponse
from blog.models import Comment

router = Router(tags=["comments"])


@router.get("/get_for_post/{post_id}", response=list[CommentSchema])
def list_comments_func(request, post_id: int):
    comments = (
        Comment.objects.filter(post_id=post_id)
        .annotate(author_username=F("author__username"))
        .order_by("-created_at")
    )
    return [CommentSchema.from_model(comment, comment.author_id == request.auth.id) for comment in comments]


@router.post("/create/{post_id}", response=CommentSchema)
def create_comment_func(request, post_id: int, data: CommentCreateRequest):
    comment = create_comment(request.auth, post_id, data.text)
    payload = CommentSchema.from_model(comment, True).model_dump()
    return JsonResponse(payload, status=201)


@router.delete("/delete/{comment_id}", response=SuccessResponse)
def delete_comment_func(request, comment_id: int):
    success = delete_comment(request.auth, comment_id)
    if not success:
        raise HttpError(403, "Комментарий не принадлежит вам или не существует")

    return SuccessResponse()
