from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models import Wallet, Wallet_Transaction, User
from app.db import get_db
from app.schemas import WalletResponse
from app.basic_auth.auth import get_current_user

wallet_router = APIRouter()


@wallet_router.get("/", response_model=WalletResponse, summary="Get wallet details")
async def get_wallet_details(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()
    if wallet is None:
        raise HTTPException(status_code=404, detail="Wallet not found")

    transactions = (
        db.query(Wallet_Transaction)
        .filter(Wallet_Transaction.wallet_id == wallet.id)
        .all()
    )

    return {"wallet": wallet, "transactions": transactions}
