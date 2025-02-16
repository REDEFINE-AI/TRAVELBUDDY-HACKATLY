from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime


class Location(BaseModel):
    latitude: float
    longitude: float


class UserAuth(BaseModel):
    email: EmailStr
    password: str
    username: str
    location: str


class UserOut(BaseModel):
    email: EmailStr
    id: str


class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str


class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    location: Optional[Location] = None


class WalletTransaction(BaseModel):
    id: str
    wallet_id: str
    amount: float
    transaction_type: str
    transaction_date: datetime

    class Config:
        orm_mode: True


class WalletResponse(BaseModel):
    id: str
    balance: float
    coins: int
    user_id: str
    transactions: List[WalletTransaction]

    class Config:
        orm_mode: True


class SubscriptionResponse(BaseModel):
    id: str
    user_id: str
    plan: str
    start_date: datetime
    translator_limit: int
    trip_limit: int
    ar_limit: int
    end_date: datetime

    class Config:
        orm_mode: True


class ProfileResponse(BaseModel):
    id: str
    username: Optional[str] = None
    email: EmailStr
    is_active: Optional[bool] = True
    location: Optional[Location] = None
    subscriptions: Optional[SubscriptionResponse] = None
    wallet: Optional[WalletResponse] = None  # Include wallet data

    class Config:
        orm_mode: True


class Hotel(BaseModel):
    id: str
    hotel_id: Optional[str]
    name: str
    rating: float
    location: Dict[str, Any]  # Changed from JSON to Dict
    specific_location: List[str]
    description: Optional[str]
    amenities: List[str]  # Changed from dict to List[str]
    image: str
    booking_url: str

    class Config:
        orm_mode: True


class Activity(BaseModel):
    id: str
    name: str
    description: str
    price: float
    location: List[str]  # This will expect a list of strings
    image: str
    isBookable: bool

    class Config:
        orm_mode: True


class Sight(BaseModel):
    id: str
    name: str
    location: str
    description: str
    image: str

    class Config:
        orm_mode: True


class Trip(BaseModel):
    id: str
    title: str
    description: str
    destination: str
    start_date: datetime
    end_date: datetime
    travelers: int
    user_id: str

    class Config:
        orm_mode: True


class Place(BaseModel):
    id: str
    name: str
    location: str
    description: str
    image: str
    trip_id: str

    class Config:
        orm_mode: True


class ItineraryItemLink(BaseModel):
    id: str
    itinerary_item_id: str
    activity_id: Optional[str] = None
    sight_id: Optional[str] = None
    hotel_id: Optional[str] = None

    class Config:
        orm_mode: True


class ItineraryItem(BaseModel):
    id: str
    name: str
    description: str
    img: str
    day_no: str
    category: str
    itinerary_id: str
    links: List[ItineraryItemLink]

    class Config:
        orm_mode: True


class Itinerary(BaseModel):
    id: str
    trip_id: str
    items: List[ItineraryItem]

    class Config:
        orm_mode: True


class PackageHotel(BaseModel):
    name: str
    pricePerNight: float
    rating: float
    amenities: List[str]


class PackageActivity(BaseModel):
    time: str
    description: str
    price: float
    bookingUrl: str


class DayPlanItem(BaseModel):
    time: str
    type: str  # 'hotel', 'attraction', 'activity', or 'break'
    activity: str
    description: str
    duration: str
    price: Optional[float] = None
    bookingUrl: Optional[str] = None


class ItineraryDay(BaseModel):
    date: str
    dayPlan: List[DayPlanItem]


class TravelPackage(BaseModel):
    id: str
    type: str
    title: str
    description: str
    price: float
    hotel: PackageHotel
    itinerary: List[ItineraryDay]


class TripDetails(BaseModel):
    hotels: List[Hotel]
    activities: List[Activity]
    attractions: List[Sight]

    class Config:
        orm_mode = True


class PackagesWrapper(BaseModel):
    packages: List[TravelPackage]

    class Config:
        orm_mode = True


class TripPackagesResponse(BaseModel):
    trip_details: TripDetails
    packages: PackagesWrapper

    class Config:
        orm_mode = True
