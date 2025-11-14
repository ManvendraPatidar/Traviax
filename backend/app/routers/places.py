from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
import uuid
from datetime import datetime
import json
from pathlib import Path

from app.models.schemas import Place, APIResponse, Checkin
from app.services.json_store import json_store
from app.routers.auth import get_current_user, User

router = APIRouter()

def load_mock_places() -> List[dict]:
    try:
        mock_file_path = Path(__file__).parent.parent.parent / "mock_data" / "mock.json"
        with open(mock_file_path, "r", encoding="utf-8") as mock_file:
            mock_data = json.load(mock_file)
        return mock_data.get("places", [])
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail="Mock data file not found") from exc
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail="Invalid JSON in mock data file") from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error loading mock places: {exc}") from exc

@router.get("", response_model=APIResponse)
async def search_places(
    query: Optional[str] = Query(None, description="Search query"),
    city: Optional[str] = Query(None, description="Filter by city"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(20, ge=1, le=100)
):
    """Search and filter places"""
    places = load_mock_places()

    # Apply filters
    if query:
        places = [p for p in places if 
                 query.lower() in p.get("name", "").lower() or 
                 query.lower() in p.get("summary", "").lower() or
                 query.lower() in p.get("location", "").lower()]

    if city:
        places = [
            p for p in places
            if p.get("city", "").lower() == city.lower()
            or city.lower() in p.get("location", "").lower()
        ]

    if category:
        places = [p for p in places if p.get("category", "").lower() == category.lower()]

    # Sort by rating
    places.sort(key=lambda x: x.get("rating", 0), reverse=True)
    
    return APIResponse(data=places[:limit])

@router.get("/{place_id}", response_model=APIResponse)
async def get_place_details(place_id: str):
    """Get detailed place information"""
    place = await json_store.get_item("places", place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    
    # Get recent check-ins for this place
    checkins = await json_store.filter_items("checkins", place_id=place_id)
    checkins.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    
    # Add user info to check-ins
    for checkin in checkins[:10]:  # Last 10 check-ins
        user = await json_store.get_item("users", checkin["user_id"])
        if user:
            checkin["user"] = {
                "username": user["username"],
                "avatar": user["avatar"],
                "full_name": user["full_name"]
            }
    
    place["recent_checkins"] = checkins[:10]
    
    # Calculate average rating from check-ins
    if checkins:
        ratings = [c.get("rating", 0) for c in checkins if c.get("rating")]
        if ratings:
            place["calculated_rating"] = sum(ratings) / len(ratings)
    
    return APIResponse(data=Place(**place))

@router.get("/{place_id}/checkins", response_model=APIResponse)
async def get_place_checkins(
    place_id: str,
    limit: int = Query(20, ge=1, le=100)
):
    """Get all check-ins for a place"""
    place = await json_store.get_item("places", place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    
    checkins = await json_store.filter_items("checkins", place_id=place_id)
    checkins.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    
    # Add user info to each check-in
    for checkin in checkins[:limit]:
        user = await json_store.get_item("users", checkin["user_id"])
        if user:
            checkin["user"] = {
                "username": user["username"],
                "avatar": user["avatar"],
                "full_name": user["full_name"]
            }
    
    return APIResponse(data=checkins[:limit])

@router.post("/{place_id}/save", response_model=APIResponse)
async def save_place(place_id: str, current_user: User = Depends(get_current_user)):
    """Save/unsave a place for later"""
    place = await json_store.get_item("places", place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    
    # In a real app, track saved places per user
    # For demo, just increment saved count
    current_saved = place.get("saved_count", 0)
    new_saved = current_saved + 1
    
    await json_store.update_item("places", place_id, {"saved_count": new_saved})
    
    return APIResponse(data={"saved": True, "saved_count": new_saved})

@router.get("/categories/list", response_model=APIResponse)
async def get_place_categories():
    """Get list of available place categories"""
    places = await json_store.get_collection("places")
    categories = list(set(place.get("category", "Other") for place in places))
    categories.sort()
    
    return APIResponse(data=categories)

@router.get("/cities/popular", response_model=APIResponse)
async def get_popular_cities():
    """Get list of popular cities"""
    places = await json_store.get_collection("places")
    city_counts = {}
    
    for place in places:
        city = place.get("city", "Unknown")
        city_counts[city] = city_counts.get(city, 0) + 1
    
    # Sort by count and return top cities
    popular_cities = sorted(city_counts.items(), key=lambda x: x[1], reverse=True)
    
    return APIResponse(data=[{"city": city, "places_count": count} for city, count in popular_cities[:10]])
