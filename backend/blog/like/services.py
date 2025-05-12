from django.contrib.auth.models import User

from ..models import Like, Post


def toggle_like(user: User, post_id: int) -> bool:
    post = Post.objects.get(id=post_id)
    like, created = Like.objects.get_or_create(user=user, post=post)

    if not created:
        like.delete()
        return False
    return True
