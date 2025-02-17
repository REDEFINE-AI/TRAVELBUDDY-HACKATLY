from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db import get_db
from app import models, schemas

auth_router = APIRouter()


@auth_router.post("/signup")
async def signup(
    email: str = Form(...),
    password: str = Form(...),
    username: str = Form(...),
    location: str = Form(...),
    db: Session = Depends(get_db),
):
    try:
        # Check if user exists
        query = select(models.User).filter(
            (models.User.email == email) | (models.User.username == username)
        )
        result = db.execute(query)
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise HTTPException(
                status_code=400, detail="Email or username already registered"
            )

        # Create new user
        db_user = models.User(
            email=email,
            username=username,
            hashed_password=password,
            location=location,
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        return db_user

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while creating the user: {str(e)}",
        )


@auth_router.post("/login")
async def login(
    email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)
):
    try:
        # Query user directly with email and password
        query = select(models.User).filter(
            models.User.email == email,
            models.User.hashed_password == password,  # Direct password comparison
        )
        result = db.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
            )

        return {
            "user_id": user.id,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during login: {str(e)}",
        )
