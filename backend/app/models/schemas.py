from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

# Base Response Schema
class APIResponse(BaseModel):
    success: bool = True
    data: Optional[Any] = None
    error: Optional[Dict[str, str]] = None

class ErrorResponse(BaseModel):
    success: bool = False
    error: Dict[str, str]

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str
    full_name: str
    bio: Optional[str] = None
    city: Optional[str] = None

class User(UserBase):
    id: str
    avatar: Optional[str] = None
    visited_places: int = 0
    checkins: int = 0
    cities: int = 0
    followers: int = 0
    following: int = 0
    likes: int = 0
    rated_places: int = 0
    coordinates: Optional[Dict[str, float]] = None
    badges: List[str] = []
    created_at: datetime

class UserProfile(User):
    pass

# Reel Schemas
class ReelBase(BaseModel):
    title: str
    location: str
    description: Optional[str] = None
    tags: List[str] = []

class Reel(ReelBase):
    id: str
    videoUrl: str
    thumbnail: str
    likes: int = 0
    comments: int = 0
    shares: int = 0
    views: int = 0
    creator_id: str
    duration: int
    created_at: datetime

class ReelResponse(BaseModel):
    reels: List[Reel]
    cursor: Optional[str] = None
    has_more: bool = False

# Place Schemas
class Coordinates(BaseModel):
    lat: float
    lng: float

class PlaceBase(BaseModel):
    name: str
    type: str
    city: str
    country: str

class Place(PlaceBase):
    id: str
    rating: float = 0.0
    cover_photo: str
    media: List[str] = []
    coordinates: Coordinates
    summary: str
    checkins_count: int = 0
    saved_count: int = 0
    category: str

# Check-in Schemas
class CheckinCreate(BaseModel):
    place_id: str
    rating: int = Field(..., ge=1, le=5)
    note: Optional[str] = None
    photos: List[str] = []

class Checkin(CheckinCreate):
    id: str
    user_id: str
    likes: int = 0
    comments: int = 0
    created_at: datetime

# Comment Schemas
class CommentCreate(BaseModel):
    content: str

class Comment(CommentCreate):
    id: str
    user_id: str
    reel_id: Optional[str] = None
    post_id: Optional[str] = None
    likes: int = 0
    created_at: datetime

# Post Schemas
class PostCreate(BaseModel):
    content: str
    media: List[str] = []

class Post(PostCreate):
    id: str
    user_id: str
    likes: int = 0
    comments: int = 0
    created_at: datetime

# Booking Schemas
class BookingType(str, Enum):
    FLIGHT = "flight"
    HOTEL = "hotel"
    ACTIVITY = "activity"

class BookingSearch(BaseModel):
    type: BookingType
    from_location: Optional[str] = None
    to_location: Optional[str] = None
    checkin_date: Optional[datetime] = None
    checkout_date: Optional[datetime] = None
    passengers: int = 1
    rooms: int = 1

class BookingResult(BaseModel):
    id: str
    type: BookingType
    title: str
    description: str
    price: float
    currency: str = "USD"
    provider: str
    details: Dict[str, Any]

class BookingConfirmation(BaseModel):
    reference: str
    status: str
    details: Dict[str, Any]

# Event Schemas
class Event(BaseModel):
    id: str
    title: str
    description: str
    location: str
    date: datetime
    price: float
    currency: str = "USD"
    attendees: int = 0
    max_attendees: int
    cover_photo: str
    organizer_id: str
    category: str

# Concierge Schemas
class ConciergeMessage(BaseModel):
    message: str
    user_id: Optional[str] = None

class ConciergeResponse(BaseModel):
    response: str
    suggestions: List[str] = []
    typing_duration: int = 2000  # milliseconds

# Trip Schemas
class TripActivity(BaseModel):
    time: str
    activity: str
    duration: str

class TripDay(BaseModel):
    day: int
    title: str
    activities: List[TripActivity]

class Trip(BaseModel):
    id: str
    user_id: str
    title: str
    destination: str
    start_date: datetime
    end_date: datetime
    days: List[TripDay]
    created_at: datetime

# Auth Schemas
class LoginRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User
