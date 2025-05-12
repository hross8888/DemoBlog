from django.contrib.auth.models import User

from ..models import Post


def create_post(author: User, text: str) -> Post:
    return Post.objects.create(author=author, text=text)


def delete_post(author: User, post_id: int) -> bool:
    deleted, _ = Post.objects.filter(author=author, id=post_id).delete()
    return deleted > 0
