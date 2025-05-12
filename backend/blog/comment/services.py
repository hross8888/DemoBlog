from django.contrib.auth.models import User

from ..models import Comment


def create_comment(author: User, post_id: int, text: str) -> Comment:
    return Comment.objects.create(author=author, post_id=post_id, text=text)


def delete_comment(author: User, comment_id: int) -> bool:
    deleted, _ = Comment.objects.filter(author=author, id=comment_id).delete()
    return deleted > 0
