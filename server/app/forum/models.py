from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    location = Column(Text)
    like_count = Column(Integer)
    dislike_count = Column(Integer)
    category_id = Column(Integer, ForeignKey("category.id"))
    created_at = Column(DateTime, default=datetime.now)
    user_id = Column(String, ForeignKey("users.id"))
    user = relationship("User", back_populates="posts")
    category = relationship("Category", back_populates="posts")


class Category(Base):
    __tablename__ = "category"

    id = Column(Integer, primary_key=True, index=True)
    category_type = Column(String)


class Tags(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
