import json
from fastapi import APIRouter, Form, Depends, HTTPException, status
from app.models import Hotel, Activity, Sight
import os
from fastapi.encoders import jsonable_encoder
from dotenv import load_dotenv
from app.db import get_db
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import JSONB
from openai import OpenAI
from app.schemas import TripPackagesResponse, TripDetails, PackagesWrapper

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

    For each package, create a detailed day-by-day itinerary including:
    - Hotel stay with accommodation details
    - Morning, afternoon, and evening activities properly scheduled
    - Mix of attractions and activities throughout the day
    - Meal times and recommended local dining options
    - Transportation arrangements between locations

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
              "dayPlan": [
                {{
                  "time": "07:00 AM",
                  "type": "hotel",
                  "activity": "Breakfast at hotel restaurant",
                  "description": "Start your day with a complimentary breakfast",
                  "duration": "1 hour"
                }},
                {{
                  "time": "09:00 AM",
                  "type": "attraction",
                  "activity": "Visit scenic location",
                  "description": "Guided tour of the attraction",
                  "duration": "2 hours",
                  "price": 50,
                  "bookingUrl": "https://example.com"
                }},
                {{
                  "time": "12:00 PM",
                  "type": "break",
                  "activity": "Lunch break",
                  "description": "Local restaurant recommendation",
                  "duration": "1 hour"
                }},
                {{
                  "time": "02:00 PM",
                  "type": "activity",
                  "activity": "Adventure activity",
                  "description": "Exciting outdoor experience",
                  "duration": "3 hours",
                  "price": 75,
                  "bookingUrl": "https://example.com"
                }},
                {{
                  "time": "06:00 PM",
                  "type": "hotel",
                  "activity": "Return to hotel and dinner",
                  "description": "Dinner at hotel restaurant",
                  "duration": "2 hours"
                }}
              ]
            }}
          ]
        }}
      ]
    }}

    Important notes for the AI:
    1. Organize activities logically based on location and timing
    2. Include breakfast, lunch, and dinner arrangements
    3. Allow reasonable time for transportation between locations
    4. Consider weather and daylight hours for outdoor activities
    5. Use the actual prices and booking URLs from the provided data
    6. Ensure all JSON properties are properly quoted with double quotes
    7. Do not include trailing commas in arrays or objects
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
            max_tokens=4000,
            temperature=0.7,
        )

        # Extract content from the new response format
        content = response.choices[0].message.content.strip()

        print(content)

        try:
            packages = json.loads(content)  # Ensure valid JSON response
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error parsing OpenAI response: {str(e)}",
            )

        # Helper function to process activity data
        def process_activity(activity):
            activity_dict = jsonable_encoder(activity)
            # Parse the location string into a list
            if isinstance(activity_dict["location"], str):
                activity_dict["location"] = json.loads(activity_dict["location"])
            return activity_dict

        # Ensure the response matches the expected schema
        response_data = TripPackagesResponse(
            trip_details=TripDetails(
                hotels=[jsonable_encoder(hotel) for hotel in hotels],
                activities=[process_activity(activity) for activity in activities],
                attractions=[
                    jsonable_encoder(attraction) for attraction in attractions
                ],
            ),
            packages=PackagesWrapper(packages=packages["packages"]),
        )

        return response_data

    except Exception as e:
        # Log the error for debugging
        print(f"Error generating trip packages: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating trip packages: {str(e)}",
        )
