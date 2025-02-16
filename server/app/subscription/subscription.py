from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models import Subscription, User
from app.schemas import SubscriptionResponse
from app.db import get_db


subscription_router = APIRouter()


@subscription_router.get(
    "/", response_model=SubscriptionResponse, summary="Get subscription details"
)
async def get_subscription_details(
    user_id: str, db: Session = Depends(get_db)
):
    subscription = (
        db.query(Subscription).filter(Subscription.user_id == user_id).first()
    )
    if subscription is None:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return subscription
