from datetime import datetime

from pydantic import BaseModel

from blog.models import Comment


class CommentSchema(BaseModel):
    id: int
    author: str
    text: str
    created_at: datetime
    is_mine: bool = False

    @classmethod
    def from_model(cls, comment: Comment, is_mine: bool = False) -> 'CommentSchema':
        author = getattr(comment, "author_username", comment.author.username)
        return cls(
            id=comment.id,
            author=author,
            text=comment.text,
            created_at=comment.created_at,
            is_mine=is_mine,
        )


class CommentCreateRequest(BaseModel):
    text: str
