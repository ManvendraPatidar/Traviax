from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import json
import os
from pathlib import Path

router = APIRouter()

def load_mock_data() -> Dict[str, Any]:
    """Load mock data from mock.json file"""
    try:
        mock_file_path = Path(__file__).parent.parent.parent / "mock_data" / "mock.json"
        with open(mock_file_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Mock data file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON in mock data file")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading mock data: {str(e)}")

@router.get("/hotels")
async def get_hotels() -> Dict[str, Any]:
    """Get all hotels from mock data"""
    try:
        mock_data = load_mock_data()
        hotels = mock_data.get("hotels", [])
        
        return {
            "success": True,
            "data": hotels,
            "count": len(hotels)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/places")
async def get_places() -> Dict[str, Any]:
    """Get all places from mock data"""
    try:
        mock_data = load_mock_data()
        places = mock_data.get("places", [])
        
        return {
            "success": True,
            "data": places,
            "count": len(places)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/activities")
async def get_activities() -> Dict[str, Any]:
    """Get all activities from mock data"""
    try:
        mock_data = load_mock_data()
        activities = mock_data.get("activities", [])
        
        return {
            "success": True,
            "data": activities,
            "count": len(activities)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/hotels/{hotel_id}")
async def get_hotel_by_id(hotel_id: str) -> Dict[str, Any]:
    """Get a specific hotel by ID"""
    try:
        mock_data = load_mock_data()
        hotels = mock_data.get("hotels", [])
        
        hotel = next((h for h in hotels if h["id"] == hotel_id), None)
        if not hotel:
            raise HTTPException(status_code=404, detail="Hotel not found")
        
        return {
            "success": True,
            "data": hotel
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/places/{place_id}")
async def get_place_by_id(place_id: str) -> Dict[str, Any]:
    """Get a specific place by ID"""
    try:
        mock_data = load_mock_data()
        places = mock_data.get("places", [])
        
        place = next((p for p in places if p["id"] == place_id), None)
        if not place:
            raise HTTPException(status_code=404, detail="Place not found")
        
        return {
            "success": True,
            "data": place
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/activities/{activity_id}")
async def get_activity_by_id(activity_id: str) -> Dict[str, Any]:
    """Get a specific activity by ID"""
    try:
        mock_data = load_mock_data()
        activities = mock_data.get("activities", [])
        
        activity = next((a for a in activities if a["id"] == activity_id), None)
        if not activity:
            raise HTTPException(status_code=404, detail="Activity not found")
        
        return {
            "success": True,
            "data": activity
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
