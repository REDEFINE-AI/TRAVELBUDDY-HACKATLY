from fastapi import APIRouter, status, HTTPException, Depends, Form
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from app import models
from app.schemas import UserOut, UserAuth, TokenSchema
from app.db import get_db
from sqlalchemy.orm import Session
from .supabase_auth import supabase
import json

auth_router = APIRouter()


class Location(BaseModel):
    latitude: float
    longitude: float


@auth_router.post("/signup", summary="Create new user", response_model=TokenSchema)
async def create_user(
    email: str = Form(...),
    password: str = Form(...),
    username: str = Form(...),
    location: str = Form(...),  # Receive location as a string
    db: Session = Depends(get_db),
):
    try:
        location_data = json.loads(
            location
        )  # Parse the location string to a dictionary
        location_obj = Location(**location_data)  # Create a Location object

        response = supabase.auth.sign_up(
            {
                "email": email,
                "password": password,
                "options": {
                    "data": {
                        "first_name": username,
                    },
                },
            }
        )
        user_data = response.user
        session_data = response.session

        new_user = models.User(
            email=user_data.email,
            username=username,
            location={
                "latitude": location_obj.latitude,
                "longitude": location_obj.longitude,
            },
            id=user_data.id,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "access_token": session_data.access_token,
            "refresh_token": session_data.refresh_token,
        }

    except Exception as e:
        # If an error occurs, delete the user from Supabase
        if "user_data" in locals():
            supabase.auth.admin.delete_user(user_data.id)
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
