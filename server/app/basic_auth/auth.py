from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_db
from .. import schemas
from .. import models
import os

auth_router = APIRouter()

# Security configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
REFRESH_SECRET_KEY = os.getenv("JWT_REFRESH_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM_KEY", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

# Verify required environment variables
if not SECRET_KEY or not REFRESH_SECRET_KEY:
    raise ValueError(
        "JWT_SECRET_KEY and JWT_REFRESH_SECRET_KEY must be set in environment variables"
    )

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Helper functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)


async def get_user_by_username(db: AsyncSession, username: str):
    query = select(models.User).filter(models.User.username == username)
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def is_token_blacklisted(db: AsyncSession, token: str) -> bool:
    query = select(models.TokenBlacklist).filter(models.TokenBlacklist.token == token)
    result = await db.execute(query)
    return bool(result.scalar_one_or_none())


# Authentication endpoints
@auth_router.post("/signup", response_model=schemas.UserResponse)
async def signup(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    query = select(models.User).filter(
        (models.User.email == user.email) | (models.User.username == user.username)
    )
    result = await db.execute(query)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=400, detail="Email or username already registered"
        )

    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email, username=user.username, hashed_password=hashed_password
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


@auth_router.post("/login", response_model=schemas.TokenResponse)
async def login(
    user_credentials: schemas.LoginRequest, db: AsyncSession = Depends(get_db)
):
    # Verify user exists
    user = await get_user_by_username(db, user_credentials.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    # Verify password
    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    # Generate tokens
    access_token = create_access_token({"sub": user.username, "id": user.id})
    refresh_token = create_refresh_token({"sub": user.username, "id": user.id})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@auth_router.post("/refresh", response_model=schemas.TokenResponse)
async def refresh_token(
    refresh_request: schemas.RefreshRequest, db: AsyncSession = Depends(get_db)
):
    try:
        # Verify refresh token
        payload = jwt.decode(
            refresh_request.refresh_token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM]
        )

        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
            )

        username = payload.get("sub")
        if not username:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
            )

        # Check if token is blacklisted
        if await is_token_blacklisted(db, refresh_request.refresh_token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has been blacklisted",
            )

        # Generate new tokens
        access_token = create_access_token({"sub": username})
        refresh_token = create_refresh_token({"sub": username})

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        )


@auth_router.post("/logout")
async def logout(
    token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)
):
    # Add token to blacklist
    blacklisted_token = models.TokenBlacklist(token=token)
    db.add(blacklisted_token)
    await db.commit()
    return {"message": "Successfully logged out"}


# Dependency for protected routes
async def get_current_user(
    token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Check if token is blacklisted
        if await is_token_blacklisted(db, token):
            raise credentials_exception

        # Decode token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise credentials_exception

        # Check token type
        if payload.get("type") != "access":
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = await get_user_by_username(db, username)
    if user is None:
        raise credentials_exception

    return user
