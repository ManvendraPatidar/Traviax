from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
import uuid
from datetime import datetime

from app.models.schemas import Event, APIResponse
from app.services.json_store import json_store
from app.routers.auth import get_current_user, User

router = APIRouter()

@router.get("", response_model=APIResponse)
async def get_events(
    city: Optional[str] = Query(None, description="Filter by city"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(20, ge=1, le=100)
):
    """Get upcoming events"""
    events = await json_store.get_collection("events")
    
    # Filter by city if provided
    if city:
        events = [e for e in events if city.lower() in e.get("location", "").lower()]
    
    # Filter by category if provided
    if category:
        events = [e for e in events if e.get("category", "").lower() == category.lower()]
    
    # Sort by date
    events.sort(key=lambda x: x.get("date", ""))
    
    # Add organizer info
    for event in events[:limit]:
        organizer = await json_store.get_item("users", event["organizer_id"])
        if organizer:
            event["organizer"] = {
                "username": organizer["username"],
                "avatar": organizer["avatar"],
                "full_name": organizer["full_name"]
            }
    
    return APIResponse(data=events[:limit])

@router.get("/{event_id}", response_model=APIResponse)
async def get_event_details(event_id: str):
    """Get detailed event information"""
    event = await json_store.get_item("events", event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Add organizer info
    organizer = await json_store.get_item("users", event["organizer_id"])
    if organizer:
        event["organizer"] = {
            "username": organizer["username"],
            "avatar": organizer["avatar"],
            "full_name": organizer["full_name"],
            "bio": organizer["bio"]
        }
    
    return APIResponse(data=Event(**event))

@router.post("/{event_id}/join", response_model=APIResponse)
async def join_event(event_id: str, current_user: User = Depends(get_current_user)):
    """Join an event"""
    event = await json_store.get_item("events", event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    current_attendees = event.get("attendees", 0)
    max_attendees = event.get("max_attendees", 999)
    
    if current_attendees >= max_attendees:
        raise HTTPException(status_code=400, detail="Event is full")
    
    # Update attendee count
    new_attendees = current_attendees + 1
    await json_store.update_item("events", event_id, {"attendees": new_attendees})
    
    return APIResponse(data={
        "joined": True,
        "attendees": new_attendees,
        "message": f"Successfully joined {event['title']}!"
    })

@router.get("/categories/list", response_model=APIResponse)
async def get_event_categories():
    """Get list of event categories"""
    events = await json_store.get_collection("events")
    categories = list(set(event.get("category", "Other") for event in events))
    categories.sort()
    
    return APIResponse(data=categories)
