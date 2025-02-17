from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from app.models import User


# Base schemas for common fields
class PostBase(BaseModel):
    title: str
    content: str
    location: str
    like_count: int
    dislike_count: int
    category_id: int
    user_id: int


class CategoryBase(BaseModel):
    category_type: str


class TagsBase(BaseModel):
    content: str


# Schemas for creating new entries
class PostCreate(PostBase):
    pass


class CategoryCreate(CategoryBase):
    pass


class TagsCreate(TagsBase):
    pass


# Schemas for updating entries
class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    location: Optional[str] = None
    likeCount: Optional[int] = None
    dislikeCount: Optional[int] = None
    category_id: Optional[int] = None
    user_id: Optional[int] = None


class CategoryUpdate(BaseModel):
    categoryType: Optional[str] = None


class TagsUpdate(BaseModel):
    content: Optional[str] = None


# Schemas for reading/returning entries
class Post(PostBase):
    id: int
    created_at: datetime
    user_id: int
    category_id: int

    class Config:
        orm_mode = True  # Enable ORM compatibility


class Category(CategoryBase):
    id: int

    class Config:
        orm_mode = True


class Tags(TagsBase):
    id: int

    class Config:
        orm_mode = True


# Schemas for nested relationships
class PostWithUserAndCategory(Post):
    user: User
    category: Category
