from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models import User, Wallet, Subscription
from app.schemas import (
    ProfileUpdate,
    ProfileResponse,
    WalletResponse,
    SubscriptionResponse,
    Location,
)
from app.db import get_db
import json

profile_router = APIRouter()


@profile_router.get(
    "/me/{user_id}",
    response_model=ProfileResponse,
    summary="Get profile by user ID",
)
async def get_profile_by_user_id(user_id: str, db: Session = Depends(get_db)):
    profile = db.query(User).filter(User.id == user_id).first()
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Parse location data
    location_data = None
    if profile.location:
        try:
            if isinstance(profile.location, str):
                loc_dict = json.loads(profile.location)
            else:
                loc_dict = profile.location
            location_data = Location(
                latitude=loc_dict.get("latitude"), longitude=loc_dict.get("longitude")
            )
        except (json.JSONDecodeError, AttributeError, KeyError):
            location_data = None

    # Get subscriptions
    subscriptions = db.query(Subscription).filter(Subscription.user_id == user_id).all()
    subscription_data = (
        [SubscriptionResponse.from_orm(sub) for sub in subscriptions]
        if subscriptions
        else []
    )

    # Get or create wallet
    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    if wallet is None:
        wallet = Wallet(user_id=user_id, balance=0.0, coins=0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    wallet_data = WalletResponse.from_orm(wallet)

    return ProfileResponse(
        id=profile.id,
        username=profile.username,
        email=profile.email,
        is_active=profile.is_active,
        location=location_data,
        subscriptions=subscription_data,  # Now passing a list
        wallet=wallet_data,
    )


@profile_router.put(
    "/me/{user_id}",
    response_model=ProfileResponse,
    summary="Update profile by user ID",
)
async def update_profile_by_user_id(
    user_id: str,
    profile: ProfileUpdate,
    db: Session = Depends(get_db),
):
    db_profile = db.query(User).filter(User.id == user_id).first()
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    for key, value in profile.dict().items():
        setattr(db_profile, key, value)
    db.commit()
    db.refresh(db_profile)
    return db_profile


@profile_router.put("/me", response_model=ProfileResponse, summary="Update profile")
async def update_profile(
    profile: ProfileUpdate,
    user_id: str,
    db: Session = Depends(get_db),
):
    return await update_profile_by_user_id(user_id, profile, db)
