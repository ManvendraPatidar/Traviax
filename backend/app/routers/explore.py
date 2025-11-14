from fastapi import APIRouter, HTTPException, Query
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


def load_db_data() -> Dict[str, Any]:
    """Load richer home screen data from db.json file"""
    try:
        db_file_path = Path(__file__).parent.parent.parent / "mock_data" / "db.json"
        with open(db_file_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail="Home data file not found") from exc
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail="Invalid JSON in home data file") from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error loading home data: {exc}") from exc

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

@router.get("/search")
async def search_explore_items(q: str = Query("", description="Search keyword")) -> Dict[str, Any]:
    """Search across hotels, places, and activities."""
    try:
        query = q.strip()
        if not query:
            return {"success": True, "data": [], "error": None}

        mock_data = load_mock_data()
        query_lower = query.lower()

        def item_matches(item: Dict[str, Any]) -> bool:
            searchable_fields = ["name", "title", "location", "category"]
            for field in searchable_fields:
                value = item.get(field)
                if value and query_lower in str(value).lower():
                    return True
            return False

        def build_result(item: Dict[str, Any], item_type: str) -> Dict[str, Any]:
            image = item.get("image")
            if not image:
                photos = item.get("photos", [])
                image = photos[0] if photos else ""

            rating = item.get("rating")
            try:
                rating_value = float(rating) if rating is not None else 0.0
            except (TypeError, ValueError):
                rating_value = 0.0

            return {
                "id": item.get("id", ""),
                "type": item_type,
                "title": item.get("name") or item.get("title") or "",
                "image": image or "",
                "rating": rating_value,
            }

        results: List[Dict[str, Any]] = []

        for hotel in mock_data.get("hotels", []):
            if item_matches(hotel):
                results.append(build_result(hotel, "hotel"))

        for place in mock_data.get("places", []):
            if item_matches(place):
                results.append(build_result(place, "place"))

        for activity in mock_data.get("activities", []):
            if item_matches(activity):
                results.append(build_result(activity, "activity"))

        return {
            "success": True,
            "data": results,
            "error": None,
        }
    except HTTPException:
        raise
    except Exception as exc:
        return {
            "success": False,
            "data": [],
            "error": str(exc),
        }

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

@router.get("/trending-places")
async def get_trending_places() -> Dict[str, Any]:
    """Return curated list of trending places for the home screen"""
    try:
        db_data = load_db_data()
        trending_places = db_data.get("trending_places", [])

        return {
            "success": True,
            "data": trending_places,
            "count": len(trending_places)
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

@router.get("/itineraries/{itinerary_id}")
async def get_itinerary_by_id(itinerary_id: str) -> Dict[str, Any]:
    """Return full itinerary details by ID"""
    try:
        db_data = load_db_data()
        itineraries = db_data.get("itineraries", [])
        itinerary = next((i for i in itineraries if i.get("id") == itinerary_id), None)
        if not itinerary:
            raise HTTPException(status_code=404, detail="Itinerary not found")
        return {
            "success": True,
            "data": itinerary
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/itineraries")
async def get_home_itineraries(limit: int = Query(6, ge=1, le=20)) -> Dict[str, Any]:
    """Return summarized itineraries for home screen consumption"""
    try:
        db_data = load_db_data()
        itineraries = db_data.get("itineraries", [])

        summaries: List[Dict[str, Any]] = []
        for itinerary in itineraries[:limit]:
            summaries.append({
                "id": itinerary.get("id"),
                "title": itinerary.get("title"),
                "location": itinerary.get("location"),
                "duration": itinerary.get("duration"),
                "dateRange": itinerary.get("dateRange"),
                "heroImage": itinerary.get("heroImage"),
                "rating": itinerary.get("rating"),
                "price": itinerary.get("price"),
                "currency": itinerary.get("currency"),
            })

        return {
            "success": True,
            "data": summaries,
            "count": len(summaries)
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

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
