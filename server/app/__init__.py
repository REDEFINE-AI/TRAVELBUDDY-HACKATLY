from fastapi import FastAPI
from app import models
from app.db import engine
from app.basic_auth.auth import auth_router
from app.dashboard.dashboard import dashboard_router
from app.translator.translator import translator_router
from app.trip.trip import trip_router
from app.profile.profile import profile_router  # Added missing import
from app.subscription.subscription import subscription_router  # Added missing import
from app.wallet.wallet import wallet_router  # Added missing import
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
models.Base.metadata.create_all(bind=engine)
app.include_router(auth_router, prefix="/auth")
app.include_router(dashboard_router, prefix="/dashboard")
app.include_router(profile_router, prefix="/profile")
app.include_router(subscription_router, prefix="/subscription")
app.include_router(translator_router, prefix="/translator")
app.include_router(trip_router, prefix="/trip")
app.include_router(wallet_router, prefix="/wallet")
