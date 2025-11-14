from fastapi import APIRouter, HTTPException, Depends
from typing import List
import uuid
from datetime import datetime

from app.models.schemas import User, UserProfile, Post, PostCreate, APIResponse
from app.services.json_store import json_store
from app.routers.auth import get_current_user

router = APIRouter()

@router.get("/{user_id}", response_model=APIResponse)
async def get_user_profile(user_id: str):
    """Get complete user profile with all related data"""
    user = await json_store.get_item("users", user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's check-ins
    checkins = await json_store.filter_items("checkins", user_id=user_id)
    user["recent_checkins"] = checkins[:5]  # Last 5 check-ins
    user["total_checkins"] = len(checkins)
    
    # Get user's posts/wall posts
    posts = await json_store.filter_items("posts", user_id=user_id)
    posts.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    
    # Add user info to each post
    for post in posts:
        post["user"] = {
            "username": user["username"],
            "avatar": user["avatar"],
            "full_name": user["full_name"]
        }
    
    user["wall_posts"] = posts
    user["posts_count"] = len(posts)
    
    # Get user's visited places
    visited_places = await json_store.filter_items("places", visited_by=user_id)
    user["visited_places_list"] = visited_places
    
    # Get user's bookings
    bookings = await json_store.filter_items("bookings", user_id=user_id)
    user["bookings"] = bookings
    user["bookings_count"] = len(bookings)
    
    # Get user's events
    events = await json_store.filter_items("events", attendees=user_id)
    user["events"] = events
    user["events_count"] = len(events)
    
    return APIResponse(data=user)

@router.get("/{user_id}/wall", response_model=APIResponse)
async def get_user_wall(user_id: str):
    """Get user's wall posts"""
    posts = await json_store.filter_items("posts", user_id=user_id)
    
    # Sort by created_at descending
    posts.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    
    # Add user info to each post
    user = await json_store.get_item("users", user_id)
    for post in posts:
        if user:
            post["user"] = {
                "username": user["username"],
                "avatar": user["avatar"],
                "full_name": user["full_name"]
            }
    
    return APIResponse(data=posts)

@router.post("/{user_id}/post", response_model=APIResponse)
async def create_wall_post(
    user_id: str,
    post_data: PostCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new wall post"""
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Can only post to your own wall")
    
    post = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "content": post_data.content,
        "media": post_data.media,
        "likes": 0,
        "comments": 0,
        "created_at": datetime.utcnow().isoformat()
    }
    
    await json_store.add_item("posts", post)
    
    # Add user info to response
    post["user"] = {
        "username": current_user.username,
        "avatar": current_user.avatar,
        "full_name": current_user.full_name
    }
    
    return APIResponse(data=Post(**post))

@router.get("/{user_id}/checkins", response_model=APIResponse)
async def get_user_checkins(user_id: str):
    """Get user's check-ins timeline"""
    checkins = await json_store.filter_items("checkins", user_id=user_id)
    
    # Sort by created_at descending
    checkins.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    
    # Add place info to each check-in
    for checkin in checkins:
        place = await json_store.get_item("places", checkin["place_id"])
        if place:
            checkin["place"] = {
                "name": place["name"],
                "city": place["city"],
                "cover_photo": place["cover_photo"]
            }
    
    return APIResponse(data=checkins)

@router.get("/{user_id}/places", response_model=APIResponse)
async def get_user_visited_places(user_id: str):
    """Get places visited by user"""
    checkins = await json_store.filter_items("checkins", user_id=user_id)
    
    # Get unique places
    place_ids = list(set(checkin["place_id"] for checkin in checkins))
    places = []
    
    for place_id in place_ids:
        place = await json_store.get_item("places", place_id)
        if place:
            # Add user's rating for this place
            user_checkins = [c for c in checkins if c["place_id"] == place_id]
            if user_checkins:
                place["user_rating"] = user_checkins[-1]["rating"]
                place["last_visit"] = user_checkins[-1]["created_at"]
            places.append(place)
    
    return APIResponse(data=places)
