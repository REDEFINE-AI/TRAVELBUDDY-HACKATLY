from fastapi import APIRouter, Form, Depends
from typing import List
import requests
from app.models import Hotel, Activity, Sight
import os
from fastapi.encoders import jsonable_encoder
from dotenv import load_dotenv
from app.db import get_db
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import JSONB  # Import JSONB

load_dotenv()

trip_router = APIRouter()


# RAPID_API_KEY = os.getenv("RAPID_API_KEY")
# VIATOR_API_KEY = os.getenv("VIATOR_API_KEY")
# UNSPLASH_API_KEY = os.getenv("UNSPLASH_API_KEY")

# API_KEY_PLLACES = "20fb0ba9056a4612b29f13fa14567952"


# @trip_router.post("/", summary="get trip")
# async def get_trip(
#     destination: str = Form(...),
#     start_date: str = Form(...),
#     end_date: str = Form(...),
#     travelers: int = Form(...),
# ):
#     place_id = await get_place_id(destination)
#     hotels = await fetch_hotels(place_id)
#     attractions = await fetch_attractions(place_id)
#     activities = await fetch_activities(place_id)

#     data = {
#         "hotels": hotels,
#         "activities": activities,
#         "attractions": attractions,
#         "start_date": start_date,
#         "end_date": end_date,
#         "travelers": travelers,
#         "destination": destination,
#     }

#     return {"data": jsonable_encoder(data)}


# async def get_place_id(destination: str) -> str:
#     url = f"https://api.geoapify.com/v1/geocode/search?text={destination}&format=json&apiKey={API_KEY_PLLACES}"

#     response = requests.get(url)
#     print(response.json()['results'][0]['place_id'] )
#     return response.json()['results'][0]['place_id']


# async def fetch_hotels(destination: str) -> List[Hotel]:
#     url = f"https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=place:{destination}&limit=10&apiKey={API_KEY_PLLACES}"
#     response = requests.get(url)
#     print(response.json())
#     return response.json()['features']


# async def fetch_attractions(destination: str) -> List[Activity]:
#     url = f"https://api.geoapify.com/v2/places?categories=tourism.attraction&filter=place:{destination}&limit=10&apiKey={API_KEY_PLLACES}"
#     response = requests.get(url)
#     print(response.json())
#     return response.json()['features']


# async def fetch_activities(destination: str) -> List[Activity]:
#     url = f"https://api.geoapify.com/v2/places?categories=entertainment&filter=place:{destination}&limit=10&apiKey={API_KEY_PLLACES}"
#     response = requests.get(url)
#     print(response.json())
#     return response.json()['features']


@trip_router.post("/", summary="Get Trip")
async def get_trip(
    destination: str = Form(...),
    start_date: str = Form(...),
    end_date: str = Form(...),
    travelers: int = Form(...),
    db: Session = Depends(get_db),
):
    # Filtering hotels based on JSONB specific_location containing destination
    hotels = (
        db.query(Hotel)
        .filter(
            Hotel.specific_location.cast(JSONB).op("@>")(f'["{destination}"]')
        )  # JSONB containment
        .limit(10)
        .all()
    )

    # Filtering activities based on string `location` field containing destination
    activities = (
        db.query(Activity)
        .filter(Activity.location.contains(destination))
        .limit(10)
        .all()
    )

    # Filtering attractions (sights) based on string `location` field containing destination
    attractions = (
        db.query(Sight).filter(Sight.location.contains(destination)).limit(10).all()
    )

    # Structuring response data
    data = {
        "hotels": hotels,
        "activities": activities,
        "attractions": attractions,
        "start_date": start_date,
        "end_date": end_date,
        "travelers": travelers,
        "destination": destination,
    }

    return {"data": jsonable_encoder(data)}
