from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder


dashboard_router = APIRouter()


@dashboard_router.get("/", summary="home")
async def home():
    data = jsonable_encoder(
        {
            "user": "soorya",
            "location": "thrissur",
            "notification": 5,
        }
    )
    return {"data": data}
