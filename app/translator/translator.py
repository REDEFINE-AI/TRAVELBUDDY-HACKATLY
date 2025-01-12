from fastapi import APIRouter


translator_router = APIRouter()


@translator_router.post("/", summary="Create new user")
async def translate_text():
    return {"message": "This is a translation"}
