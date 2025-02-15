from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ..database import get_db
from . import models, schemas
from ..auth.auth import get_current_user

forum_router = APIRouter()

# Location endpoints
@forum_router.post("/locations/", response_model=schemas.Location)
async def create_location(
    location: schemas.LocationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_location = models.Location(**location.dict())
    db.add(db_location)
    await db.commit()
    await db.refresh(db_location)
    return db_location

@forum_router.get("/locations/", response_model=List[schemas.Location])
async def get_locations(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    query = select(models.Location).offset(skip).limit(limit)
    result = await db.execute(query)
    locations = result.scalars().all()
    return locations

# Post endpoints
@forum_router.post("/posts/", response_model=schemas.Post)
async def create_post(
    post: schemas.PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_post = models.Post(**post.dict(), user_id=current_user.id)
    db.add(db_post)
    await db.commit()
    await db.refresh(db_post)
    return db_post

@forum_router.get("/locations/{location_id}/posts/", response_model=List[schemas.Post])
async def get_location_posts(
    location_id: int,
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    query = select(models.Post).filter(models.Post.location_id == location_id).offset(skip).limit(limit)
    result = await db.execute(query)
    posts = result.scalars().all()
    return posts

# Comment endpoints
@forum_router.post("/comments/", response_model=schemas.Comment)
async def create_comment(
    comment: schemas.CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_comment = models.Comment(**comment.dict(), user_id=current_user.id)
    db.add(db_comment)
    await db.commit()
    await db.refresh(db_comment)
    return db_comment

@forum_router.get("/posts/{post_id}/comments/", response_model=List[schemas.Comment])
async def get_post_comments(
    post_id: int,
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    query = select(models.Comment).filter(models.Comment.post_id == post_id).offset(skip).limit(limit)
    result = await db.execute(query)
    comments = result.scalars().all()
    return comments



