from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models import User
from app.schemas import ProfileUpdate, ProfileResponse
from app.db import get_db
from app.basic_auth.auth import get_current_user

profile_router = APIRouter()


@profile_router.get(
    "/me",
    response_model=ProfileResponse,
    summary="Get profile with subscription",
)
async def get_profile(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    profile = db.query(User).filter(User.id == current_user.id).first()
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    subscription = (
        profile.subscriptions
    )  # Assuming User has a relationship with Subscription
    return {"profile": profile, "subscription": subscription}


@profile_router.put("/me", response_model=ProfileResponse, summary="Update profile")
async def update_profile(
    profile: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_profile = db.query(User).filter(User.id == current_user.id).first()
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    for key, value in profile.dict().items():
        setattr(db_profile, key, value)
    db.commit()
    db.refresh(db_profile)
    return db_profile
