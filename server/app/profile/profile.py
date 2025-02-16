from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models import User, Wallet
from app.schemas import ProfileUpdate, ProfileResponse, WalletResponse
from app.db import get_db

profile_router = APIRouter()


@profile_router.get(
    "/user/{user_id}",
    response_model=ProfileResponse,
    summary="Get profile by user ID",
)
async def get_profile_by_user_id(user_id: str, db: Session = Depends(get_db)):
    profile = db.query(User).filter(User.id == user_id).first()
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")

    subscription = (
        profile.subscriptions
    )  # Assuming User has a relationship with Subscription

    wallet = db.query(Wallet).filter(Wallet.user_id == user_id).first()
    if wallet is None:
        raise HTTPException(status_code=404, detail="Wallet not found")

    wallet_data = WalletResponse.from_orm(wallet)

    return {"profile": profile, "subscription": subscription, "wallet": wallet_data}


@profile_router.put(
    "/user/{user_id}",
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


@profile_router.get(
    "/me",
    response_model=ProfileResponse,
    summary="Get profile with subscription and wallet",
)
async def get_profile(user_id: str, db: Session = Depends(get_db)):
    return await get_profile_by_user_id(user_id, db)


@profile_router.put("/me", response_model=ProfileResponse, summary="Update profile")
async def update_profile(
    profile: ProfileUpdate,
    user_id: str,
    db: Session = Depends(get_db),
):
    return await update_profile_by_user_id(user_id, profile, db)
