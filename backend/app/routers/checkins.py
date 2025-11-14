from fastapi import APIRouter, HTTPException, Depends
import uuid
from datetime import datetime

from app.models.schemas import CheckinCreate, Checkin, APIResponse
from app.services.json_store import json_store
from app.routers.auth import get_current_user, User

router = APIRouter()

@router.post("", response_model=APIResponse)
async def create_checkin(
    checkin_data: CheckinCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new check-in"""
    # Verify place exists
    place = await json_store.get_item("places", checkin_data.place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    
    checkin = {
        "id": str(uuid.uuid4()),
        "user_id": current_user.id,
        "place_id": checkin_data.place_id,
        "rating": checkin_data.rating,
        "note": checkin_data.note,
        "photos": checkin_data.photos,
        "likes": 0,
        "comments": 0,
        "created_at": datetime.utcnow().isoformat()
    }
    
    await json_store.add_item("checkins", checkin)
    
    # Update place check-in count
    current_checkins = place.get("checkins_count", 0)
    await json_store.update_item("places", checkin_data.place_id, {
        "checkins_count": current_checkins + 1
    })
    
    # Update user stats
    user_data = await json_store.get_item("users", current_user.id)
    if user_data:
        current_user_checkins = user_data.get("checkins", 0)
        await json_store.update_item("users", current_user.id, {
            "checkins": current_user_checkins + 1
        })
    
    # Add place and user info to response
    checkin["place"] = {
        "name": place["name"],
        "city": place["city"],
        "cover_photo": place["cover_photo"]
    }
    checkin["user"] = {
        "username": current_user.username,
        "avatar": current_user.avatar,
        "full_name": current_user.full_name
    }
    
    return APIResponse(data=Checkin(**checkin))

@router.get("/{checkin_id}", response_model=APIResponse)
async def get_checkin(checkin_id: str):
    """Get check-in details"""
    checkin = await json_store.get_item("checkins", checkin_id)
    if not checkin:
        raise HTTPException(status_code=404, detail="Check-in not found")
    
    # Add user and place info
    user = await json_store.get_item("users", checkin["user_id"])
    place = await json_store.get_item("places", checkin["place_id"])
    
    if user:
        checkin["user"] = {
            "username": user["username"],
            "avatar": user["avatar"],
            "full_name": user["full_name"]
        }
    
    if place:
        checkin["place"] = {
            "name": place["name"],
            "city": place["city"],
            "cover_photo": place["cover_photo"]
        }
    
    return APIResponse(data=Checkin(**checkin))

@router.post("/{checkin_id}/like", response_model=APIResponse)
async def like_checkin(checkin_id: str, current_user: User = Depends(get_current_user)):
    """Like a check-in"""
    checkin = await json_store.get_item("checkins", checkin_id)
    if not checkin:
        raise HTTPException(status_code=404, detail="Check-in not found")
    
    current_likes = checkin.get("likes", 0)
    new_likes = current_likes + 1
    
    await json_store.update_item("checkins", checkin_id, {"likes": new_likes})
    
    return APIResponse(data={"likes": new_likes, "liked": True})

@router.get("", response_model=APIResponse)
async def get_recent_checkins(limit: int = 20):
    """Get recent check-ins from all users"""
    checkins = await json_store.get_collection("checkins")
    checkins.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    
    # Add user and place info to each check-in
    for checkin in checkins[:limit]:
        user = await json_store.get_item("users", checkin["user_id"])
        place = await json_store.get_item("places", checkin["place_id"])
        
        if user:
            checkin["user"] = {
                "username": user["username"],
                "avatar": user["avatar"],
                "full_name": user["full_name"]
            }
        
        if place:
            checkin["place"] = {
                "name": place["name"],
                "city": place["city"],
                "cover_photo": place["cover_photo"]
            }
    
    return APIResponse(data=checkins[:limit])
