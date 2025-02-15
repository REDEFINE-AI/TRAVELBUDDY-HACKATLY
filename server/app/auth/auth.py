from fastapi.responses import RedirectResponse
from uuid import uuid4
from fastapi import FastAPI, APIRouter, status, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app import models
from app.schemas import UserOut, UserAuth, TokenSchema
from app.utils import get_hashed_password
from app.db import get_db
from sqlalchemy.orm import Session
from .supabase_auth import supabase
from fastapi.encoders import jsonable_encoder

auth_router = APIRouter()


@auth_router.post("/signup", summary="Create new user", response_model=UserOut)
async def create_user(data: UserAuth, db: Session = Depends(get_db)):

    try:
        response = supabase.auth.sign_up(
            {
                "email": data.email,
                "password": data.password,
                "options": {
                    "data": {
                        "first_name": data.username,
                    },
                },
            }
        )
        # print(response.User)
        new_user = models.User(
            email=response.user.email,
            username=data.username,
            id=response.user.id,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return response.user

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@auth_router.post(
    "/login",
    summary="Create access and refresh tokens for user",
    response_model=TokenSchema,
)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    try:
        data = supabase.auth.sign_in_with_password(
            {
                "email": form_data.username,
                "password": form_data.password,
            }
        )
        return {
            "access_token": data.session.access_token,
            "refresh_token": data.session.refresh_token,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Incorrect email or password. Please try again! {e}",
        )
