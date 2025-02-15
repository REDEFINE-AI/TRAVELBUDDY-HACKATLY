from fastapi import APIRouter, Form
from typing import List
import requests
from app.models import Hotel, Activity
import os
from fastapi.encoders import jsonable_encoder
from dotenv import load_dotenv

load_dotenv()

trip_router = APIRouter()


RAPID_API_KEY = os.getenv("RAPID_API_KEY")
VIATOR_API_KEY = os.getenv("VIATOR_API_KEY")
UNSPLASH_API_KEY = os.getenv("UNSPLASH_API_KEY")

API_KEY_PLLACES = "20fb0ba9056a4612b29f13fa14567952"


@trip_router.post("/", summary="get trip")
async def get_trip(
    destination: str = Form(...),
    start_date: str = Form(...),
    end_date: str = Form(...),
    travelers: int = Form(...),
):
    place_id = await get_place_id(destination)
    hotels = await fetch_hotels(place_id)
    attractions = await fetch_attractions(place_id)
    activities = await fetch_activities(place_id)

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


async def get_place_id(destination: str) -> str:
    url = f"https://api.geoapify.com/v1/geocode/search?text={destination}&format=json&apiKey={API_KEY_PLLACES}"

    response = requests.get(url)
    print(response.json()['results'][0]['place_id'] )
    return response.json()['results'][0]['place_id']


async def fetch_hotels(destination: str) -> List[Hotel]:
    url = f"https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=place:{destination}&limit=10&apiKey={API_KEY_PLLACES}"
    response = requests.get(url)
    print(response.json())
    return response.json()['features']


async def fetch_attractions(destination: str) -> List[Activity]:
    url = f"https://api.geoapify.com/v2/places?categories=tourism.attraction&filter=place:{destination}&limit=10&apiKey={API_KEY_PLLACES}"
    response = requests.get(url)
    print(response.json())
    return response.json()['features']


async def fetch_activities(destination: str) -> List[Activity]:
    url = f"https://api.geoapify.com/v2/places?categories=entertainment&filter=place:{destination}&limit=10&apiKey={API_KEY_PLLACES}"
    response = requests.get(url)
    print(response.json())
    return response.json()['features']
