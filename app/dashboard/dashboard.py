from fastapi import APIRouter


dashboard_router = APIRouter()


@dashboard_router.get("/", summary="home")
async def home():
    return {
        "data": {
            "user": "soorya",
            "location": "thrissur",
            "notification": 5,
        }
    }
