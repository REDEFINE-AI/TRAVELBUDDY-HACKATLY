from fastapi.responses import RedirectResponse
from uuid import uuid4
from fastapi import FastAPI, APIRouter, status, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app import models
from app.schemas import UserOut, UserAuth, TokenSchema
from app.utils import (
    get_hashed_password,
    create_access_token,
    create_refresh_token,
    verify_password,
)
from app.db import get_db
from sqlalchemy.orm import Session

auth_router = APIRouter()


@auth_router.post("/signup", summary="Create new user", response_model=UserOut)
async def create_user(data: UserAuth, db: Session = Depends(get_db)):
    # Check if user already exists
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    # Create and save new user
    new_user = models.User(
        email=data.email,
        password=get_hashed_password(data.password),
        id=str(uuid4()),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@auth_router.post(
    "/login",
    summary="Create access and refresh tokens for user",
    response_model=TokenSchema,
)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )

    return {
        "access_token": create_access_token(user.email),
        "refresh_token": create_refresh_token(user.email),
    }
