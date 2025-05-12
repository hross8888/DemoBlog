from ninja import Router
from ninja.errors import HttpError

from blog.like.schema import LikeResponse
from blog.like.services import toggle_like
from blog.models import Post

router = Router(tags=["likes"])


@router.post("/like/{post_id}", response=LikeResponse)
def like_post(request, post_id: int):
    try:
        liked = toggle_like(request.auth, post_id)
    except Post.DoesNotExist:
        raise HttpError(404, "Пост не найден")

    return LikeResponse(liked=liked)
