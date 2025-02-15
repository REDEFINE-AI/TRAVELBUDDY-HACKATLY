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
)
from sqlalchemy.orm import relationship
from app.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
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

    id = Column(String, primary_key=True, index=True)
    original_text = Column(String)
    translation = Column(String)
    target_language = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.now)
    user_id = Column(String, ForeignKey("users.id"))

    # Relationships
    user = relationship("User", back_populates="translations")


class Activity(Base):
    __tablename__ = "activities"

    id = Column(String, primary_key=True, index=True)
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
    itinerary_item_id = Column(String, ForeignKey("itinerary_items.id"))

    # Relationships
    itinerary_item = relationship("ItineraryItem", back_populates="sights")


class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    rating = Column(Float)
    location = Column(String)
    description = Column(String)
    amenities = Column(JSON)
    image = Column(String)
    booking_url = Column(String)
    itinerary_item_id = Column(String, ForeignKey("itinerary_items.id"))

    # Relationships
    itinerary_item = relationship("ItineraryItem", back_populates="sights")


class Trip(Base):
    __tablename__ = "trips"

    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    destination = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    travelers = Column(Integer)
    user_id = Column(String, ForeignKey("users.id"))

    # Relationships
    user = relationship("User", back_populates="trips")
    hotel = relationship("Hotel", back_populates="trip", uselist=False)
    activities = relationship("Activity", back_populates="trip")
    places = relationship("Place", back_populates="trip")


class Place(Base):
    __tablename__ = "places"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    description = Column(String)
    image = Column(String)
    trip_id = Column(String, ForeignKey("trips.id"))

    # Relationships
    trip = relationship("Trip", back_populates="places")


class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(String, primary_key=True, index=True)
    trip_id = Column(String, ForeignKey("trips.id"))

    # Relationships
    trip = relationship("Trip", back_populates="itinerary")
    items = relationship("ItineraryItem", back_populates="itinerary")


class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(String, primary_key=True, index=True)
    balance = Column(Float, default=0.0)
    user_id = Column(String, ForeignKey("users.id"))

    # Relationships
    user = relationship("User", back_populates="wallets")


class ItineraryItem(Base):
    __tablename__ = "itinerary_items"

    id = Column(String, primary_key=True, index=True)
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


class Sight(Base):
    __tablename__ = "sights"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    description = Column(String)
    image = Column(String)
    itinerary_item_id = Column(String, ForeignKey("itinerary_items.id"))

    # Relationships
    itinerary_item = relationship("ItineraryItem", back_populates="sights")
