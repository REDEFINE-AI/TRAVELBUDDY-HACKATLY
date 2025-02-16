import datetime
from sqlalchemy import (
    Boolean,
    Column,
    String,
    ForeignKey,
    Integer,
    DateTime,
    Float,
    Enum,
    JSON,
    Text,
)
from sqlalchemy.orm import relationship
from app.db import Base
from app.utils import generate_uuid
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    username = Column(String, nullable=True)
    email = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True)
    location = Column(String)

    # Relationships
    trips = relationship("Trip", back_populates="user")
    translations = relationship("Translator", back_populates="user")
    wallets = relationship("Wallet", back_populates="user")


class Translator(Base):
    __tablename__ = "translators"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    original_text = Column(String)
    translation = Column(String)
    target_language = Column(String)
    created_at = Column(DateTime, default=datetime.now)
    user_id = Column(String, ForeignKey("users.id"))

    # Relationships
    user = relationship("User", back_populates="translations")


class Activity(Base):
    __tablename__ = "activities"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    time = Column(String)
    description = Column(String)
    price = Column(Float)
    location = Column(String)
    image = Column(String)
    booking_url = Column(String)
    duration = Column(String)
    category = Column(
        Enum(
            "sightseeing",
            "culture",
            "adventure",
            "relaxation",
            name="activity_categories",
        )
    )


class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    name = Column(String)
    rating = Column(Float)
    location = Column(String)
    description = Column(String)
    amenities = Column(JSON)
    image = Column(String)
    booking_url = Column(String)


class Sight(Base):
    __tablename__ = "sights"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    name = Column(String)
    location = Column(String)
    description = Column(String)
    image = Column(String)


class Trip(Base):
    __tablename__ = "trips"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    title = Column(String)
    description = Column(String)
    destination = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    travelers = Column(Integer)
    user_id = Column(String, ForeignKey("users.id"))

    # Relationships
    user = relationship("User", back_populates="trips")
    places = relationship("Place", back_populates="trip")
    itinerary = relationship("Itinerary", back_populates="trip")


class Place(Base):
    __tablename__ = "places"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    name = Column(String)
    location = Column(String)
    description = Column(String)
    image = Column(String)
    trip_id = Column(String, ForeignKey("trips.id"))

    # Relationships
    trip = relationship("Trip", back_populates="places")


class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    trip_id = Column(String, ForeignKey("trips.id"))

    # Relationships
    trip = relationship("Trip", back_populates="itinerary")
    items = relationship("ItineraryItem", back_populates="itinerary")


class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    balance = Column(Float, default=0.0)
    user_id = Column(String, ForeignKey("users.id"))

    # Relationships
    user = relationship("User", back_populates="wallets")


class ItineraryItem(Base):
    __tablename__ = "itinerary_items"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    name = Column(String)
    description = Column(String)
    img = Column(String)
    day_no = Column(String)
    category = Column(
        String,
        Enum(
            "hotel",
            "sights",
            "activities",
            name="itenary_categories",
        ),
    )
    itinerary_id = Column(String, ForeignKey("itineraries.id"))

    # Relationships
    itinerary = relationship("Itinerary", back_populates="items")
    links = relationship("ItineraryItemLink", back_populates="itinerary_item")


class ItineraryItemLink(Base):
    __tablename__ = "itinerary_item_links"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    itinerary_item_id = Column(String, ForeignKey("itinerary_items.id"))
    activity_id = Column(String, ForeignKey("activities.id"), nullable=True)
    sight_id = Column(String, ForeignKey("sights.id"), nullable=True)
    hotel_id = Column(String, ForeignKey("hotels.id"), nullable=True)

    # Relationships
    itinerary_item = relationship("ItineraryItem", back_populates="links")
    activity = relationship("Activity")
    sight = relationship("Sight")
    hotel = relationship("Hotel")


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    location = Column(Text)
    like_count = Column(Integer)
    dislike_count = Column(Integer)
    category_id = Column(Integer, ForeignKey("category.id"))
    created_at = Column(DateTime, default=datetime.now)
    user_id = Column(String, ForeignKey("users.id"))
    user = relationship("User", back_populates="posts")
    category = relationship("Category", back_populates="posts")


class Category(Base):
    __tablename__ = "category"

    id = Column(Integer, primary_key=True, index=True)
    category_type = Column(String)


class Tags(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
