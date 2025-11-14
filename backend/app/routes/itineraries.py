from fastapi import APIRouter, HTTPException
from typing import List
import json
import os

router = APIRouter()

def load_itineraries_data():
    """Load itineraries from the mock data file"""
    try:
        mock_data_path = os.path.join(os.path.dirname(__file__), "../../mock_data/db.json")
        with open(mock_data_path, 'r') as file:
            data = json.load(file)
            return data.get('itineraries', [])
    except Exception as e:
        print(f"Error loading itineraries data: {e}")
        return []

@router.get("/api/itineraries")
async def get_all_itineraries():
    """Get all itineraries (summary view)"""
    try:
        itineraries = load_itineraries_data()
        
        # Return summary data without full day details for list view
        summary_itineraries = []
        for itinerary in itineraries:
            summary = {
                "id": itinerary["id"],
                "title": itinerary["title"],
                "location": itinerary["location"],
                "duration": itinerary["duration"],
                "dateRange": itinerary["dateRange"],
                "heroImage": itinerary["heroImage"],
                "rating": itinerary["rating"],
                "price": itinerary["price"],
                "currency": itinerary["currency"],
                "days": []  # Empty for summary view
            }
            summary_itineraries.append(summary)
        
        return summary_itineraries
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch itineraries: {str(e)}")

@router.get("/api/itineraries/{itinerary_id}")
async def get_itinerary_by_id(itinerary_id: str):
    """Get detailed itinerary by ID"""
    try:
        itineraries = load_itineraries_data()
        
        # Find the specific itinerary
        for itinerary in itineraries:
            if itinerary["id"] == itinerary_id:
                return itinerary
        
        raise HTTPException(status_code=404, detail="Itinerary not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch itinerary: {str(e)}")
