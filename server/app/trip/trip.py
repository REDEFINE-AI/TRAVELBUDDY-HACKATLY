import json
from fastapi import APIRouter, Form, Depends
from app.models import Hotel, Activity, Sight
import os
from fastapi.encoders import jsonable_encoder
from dotenv import load_dotenv
from app.db import get_db
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import JSONB
from openai import OpenAI
from app.schemas import TripPackagesResponse

load_dotenv()

trip_router = APIRouter()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@trip_router.post(
    "/",
    summary="Get Trip and Generate Travel Packages",
    response_model=TripPackagesResponse,
)
async def generate_trip_packages(
    destination: str = Form(...),
    start_date: str = Form(...),
    end_date: str = Form(...),
    travelers: int = Form(...),
    db: Session = Depends(get_db),
):

    print(destination, start_date, end_date, travelers)
    # Fetch trip details
    hotels = (
        db.query(Hotel)
        .filter(Hotel.specific_location.cast(JSONB).op("@>")(f'["{destination}"]'))
        .limit(10)
        .all()
    )

    activities = (
        db.query(Activity)
        .filter(Activity.location.cast(JSONB).op("@>")(f'["{destination}"]'))
        .limit(10)
        .all()
    )

    attractions = (
        db.query(Sight)
        .filter(Sight.location.cast(JSONB).op("@>")(f'["{destination}"]'))
        .limit(10)
        .all()
    )

    # Convert the fetched data to JSON format for OpenAI prompt
    hotels_json = json.dumps([jsonable_encoder(hotel) for hotel in hotels], indent=2)
    activities_json = json.dumps(
        [jsonable_encoder(activity) for activity in activities], indent=2
    )
    attractions_json = json.dumps(
        [jsonable_encoder(attraction) for attraction in attractions], indent=2
    )

    # Generate a structured prompt using the provided data
    prompt_content = f"""
    Create 3 travel packages (Budget, Comfort, and Luxury) for {travelers} travelers to {destination} from {start_date} to {end_date}.
    Use ONLY the provided hotels, activities, and attractions.

    Available Hotels:
    {hotels_json}

    Available Activities:
    {activities_json}

    Available Attractions:
    {attractions_json}

    For each package, include:
    - Specific hotel recommendations with price range
    - Daily activities with times and booking prices
    - Transportation options
    Format the response as valid JSON with this structure:
    {{
      "packages": [
        {{
          "id": "1",
          "type": "Budget",
          "title": "Budget Explorer",
          "description": "Perfect for budget travelers",
          "price": 1000,
          "hotel": {{
            "name": "Sample Hotel",
            "pricePerNight": 100,
            "rating": 4,
            "amenities": ["WiFi", "Pool"]
          }},
          "itinerary": [
            {{
              "date": "2024-03-20",
              "activities": [
                {{
                  "time": "09:00 AM",
                  "description": "Specific activity description",
                  "price": 50,
                  "bookingUrl": "https://example.com"
                }}
              ]
            }}
          ]
        }}
      ]
    }}
    """

    try:
        # Make request to OpenAI API using the new format
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a travel package generator that outputs only valid JSON.",
                },
                {"role": "user", "content": prompt_content},
            ],
            max_tokens=1500,
            temperature=0.7,
        )

        # Extract content from the new response format
        content = response.choices[0].message.content.strip()

        print(content)
        packages = json.loads(content)  # Ensure valid JSON response

        # Helper function to process activity data
        def process_activity(activity):
            activity_dict = jsonable_encoder(activity)
            # Parse the location string into a list
            if isinstance(activity_dict["location"], str):
                activity_dict["location"] = json.loads(activity_dict["location"])
            return activity_dict

        return {
            "trip_details": {
                "hotels": [jsonable_encoder(hotel) for hotel in hotels],
                "activities": [process_activity(activity) for activity in activities],
                "attractions": [
                    jsonable_encoder(attraction) for attraction in attractions
                ],
            },
            "packages": {"packages": packages["packages"]},
        }

    except Exception as e:
        return {"error": str(e)}
