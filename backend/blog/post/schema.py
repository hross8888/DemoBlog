from datetime import datetime

from pydantic import BaseModel


class PostSchema(BaseModel):
    id: int
    author: str
    text: str
    created_at: datetime
    likes_count: int
    liked_by_me: bool
    comment_count: int
    is_mine: bool = False

    @classmethod
    def from_model(cls, post, is_mine=False) -> "PostSchema":
        author = getattr(post, "author_username", post.author.username)
        likes_count = getattr(post, "likes_count", 0)
        liked_by_me = getattr(post, "liked_by_me", False)
        comment_count = getattr(post, "comment_count", 0)

        return cls(
            id=post.id,
            author=author,
            text=post.text,
            created_at=post.created_at,
            likes_count=likes_count,
            liked_by_me=liked_by_me,
            comment_count=comment_count,
            is_mine=is_mine
        )


class PostCreateRequest(BaseModel):
    text: str
