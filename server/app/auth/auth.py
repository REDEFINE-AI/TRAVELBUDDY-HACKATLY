from fastapi import APIRouter, status, HTTPException, Depends, Form
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from app import models
from app.schemas import UserOut, UserAuth, TokenSchema
from app.db import get_db
from app.utils import JWTBearer, create_access_token
from sqlalchemy.orm import Session
from .supabase_auth import supabase
import json
import os
import requests

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

        access_token = create_access_token(data={"id": new_user.id})

        return {
            "access_token": access_token,
            "refresh_token": response.session.refresh_token,
        }

    except Exception as e:
        # If an error occurs, delete the user from Supabase using the service role key
        if "user_data" in locals():
            service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
            headers = {
                "Authorization": f"Bearer {service_role_key}",
                "apikey": service_role_key,
            }
            requests.delete(
                f"https://{os.getenv('SUPABASE_PROJECT_ID')}.supabase.co/auth/v1/admin/users/{user_data.id}",
                headers=headers,
            )
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
        user = (
            db.query(models.User)
            .filter(models.User.email == form_data.username)
            .first()
        )
        if user is None:
            raise HTTPException(status_code=400, detail="User not found")

        access_token = create_access_token(data={"id": user.id})

        return {
            "access_token": access_token,
            "refresh_token": data.session.refresh_token,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Incorrect email or password. Please try again! {e}",
        )


@auth_router.post("/logout", summary="Logout user")
async def logout(current_user: models.User = Depends(JWTBearer())):
    try:
        supabase.auth.sign_out()
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error logging out. Please try again! {e}",
        )
