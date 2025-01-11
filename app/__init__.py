from fastapi import FastAPI
from app import models
from app.db import engine
from app.auth.auth import auth_router

app = FastAPI()
models.Base.metadata.create_all(bind=engine)
app.include_router(auth_router, prefix="/auth")
