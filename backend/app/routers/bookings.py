from fastapi import APIRouter, HTTPException, Depends
from typing import List
import uuid
import random
from datetime import datetime, timedelta

from app.models.schemas import BookingSearch, BookingResult, BookingConfirmation, APIResponse
from app.services.json_store import json_store
from app.routers.auth import get_current_user, User

router = APIRouter()

# Mock flight data
MOCK_FLIGHTS = [
    {
        "airline": "Turkish Airlines",
        "flight_number": "TK1234",
        "aircraft": "Boeing 777",
        "duration": "4h 15m"
    },
    {
        "airline": "Emirates",
        "flight_number": "EK567", 
        "aircraft": "Airbus A380",
        "duration": "3h 45m"
    },
    {
        "airline": "Qatar Airways",
        "flight_number": "QR890",
        "aircraft": "Boeing 787",
        "duration": "4h 30m"
    }
]

# Mock hotel data
MOCK_HOTELS = [
    {
        "name": "Sultanahmet Palace Hotel",
        "rating": 4.8,
        "amenities": ["WiFi", "Breakfast", "Spa", "Pool"],
        "location": "Historic District"
    },
    {
        "name": "Four Seasons Bosphorus",
        "rating": 4.9,
        "amenities": ["WiFi", "Breakfast", "Spa", "Pool", "Concierge"],
        "location": "Bosphorus View"
    },
    {
        "name": "Pera Palace Hotel",
        "rating": 4.7,
        "amenities": ["WiFi", "Breakfast", "Historic", "Restaurant"],
        "location": "Beyoğlu"
    }
]

@router.post("/search", response_model=APIResponse)
async def search_bookings(
    search_data: BookingSearch,
    current_user: User = Depends(get_current_user)
):
    """Search for flights, hotels, or activities"""
    
    results = []
    
    if search_data.type == "flight":
        # Generate mock flight results
        for i, flight_template in enumerate(MOCK_FLIGHTS):
            price = random.randint(200, 800)
            result = BookingResult(
                id=f"flight_{i+1}",
                type="flight",
                title=f"{flight_template['airline']} {flight_template['flight_number']}",
                description=f"{search_data.from_location} → {search_data.to_location} • {flight_template['duration']} • {flight_template['aircraft']}",
                price=price,
                currency="USD",
                provider=flight_template['airline'],
                details={
                    "from": search_data.from_location,
                    "to": search_data.to_location,
                    "departure": search_data.checkin_date.isoformat() if search_data.checkin_date else None,
                    "airline": flight_template['airline'],
                    "flight_number": flight_template['flight_number'],
                    "aircraft": flight_template['aircraft'],
                    "duration": flight_template['duration'],
                    "passengers": search_data.passengers
                }
            )
            results.append(result)
    
    elif search_data.type == "hotel":
        # Generate mock hotel results
        for i, hotel_template in enumerate(MOCK_HOTELS):
            nights = 3
            if search_data.checkin_date and search_data.checkout_date:
                nights = (search_data.checkout_date - search_data.checkin_date).days
            
            price_per_night = random.randint(80, 300)
            total_price = price_per_night * nights
            
            result = BookingResult(
                id=f"hotel_{i+1}",
                type="hotel",
                title=hotel_template['name'],
                description=f"⭐ {hotel_template['rating']} • {hotel_template['location']} • {', '.join(hotel_template['amenities'][:3])}",
                price=total_price,
                currency="USD",
                provider="Traviax Hotels",
                details={
                    "name": hotel_template['name'],
                    "location": search_data.to_location or "Istanbul",
                    "checkin": search_data.checkin_date.isoformat() if search_data.checkin_date else None,
                    "checkout": search_data.checkout_date.isoformat() if search_data.checkout_date else None,
                    "nights": nights,
                    "rooms": search_data.rooms,
                    "rating": hotel_template['rating'],
                    "amenities": hotel_template['amenities'],
                    "price_per_night": price_per_night
                }
            )
            results.append(result)
    
    # Sort by price
    results.sort(key=lambda x: x.price)
    
    return APIResponse(data=results)

@router.post("/confirm", response_model=APIResponse)
async def confirm_booking(
    booking_data: dict,
    current_user: User = Depends(get_current_user)
):
    """Confirm a booking"""
    
    # Generate booking reference
    reference = f"TRV-{booking_data.get('type', 'BK').upper()[:2]}-{random.randint(100000, 999999)}"
    
    # Create booking record
    booking = {
        "id": str(uuid.uuid4()),
        "user_id": current_user.id,
        "type": booking_data.get("type"),
        "reference": reference,
        "status": "confirmed",
        "details": booking_data.get("details", {}),
        "created_at": datetime.utcnow().isoformat()
    }
    
    await json_store.add_item("bookings", booking)
    
    confirmation = BookingConfirmation(
        reference=reference,
        status="confirmed",
        details={
            **booking_data.get("details", {}),
            "booking_id": booking["id"],
            "confirmation_email": current_user.email,
            "booking_date": booking["created_at"]
        }
    )
    
    return APIResponse(data=confirmation)

@router.get("/my-bookings", response_model=APIResponse)
async def get_user_bookings():
    """Get user's bookings (demo mode - no auth required)"""
    
    # For demo purposes, return sample bookings
    bookings = await json_store.get_all_items("bookings")
    bookings.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    
    return APIResponse(data=bookings[:5])  # Return first 5 bookings

@router.get("/{booking_id}", response_model=APIResponse)
async def get_booking_details(
    booking_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get booking details"""
    
    booking = await json_store.get_item("bookings", booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking["user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return APIResponse(data=booking)

@router.post("/gift", response_model=APIResponse)
async def send_gift_booking(
    gift_data: dict,
    current_user: User = Depends(get_current_user)
):
    """Send a trip as a gift"""
    
    gift_reference = f"GIFT-{random.randint(100000, 999999)}"
    
    gift = {
        "id": str(uuid.uuid4()),
        "sender_id": current_user.id,
        "recipient_name": gift_data.get("recipient_name"),
        "recipient_email": gift_data.get("recipient_email"),
        "message": gift_data.get("message"),
        "trip_details": gift_data.get("trip_details"),
        "reference": gift_reference,
        "status": "sent",
        "created_at": datetime.utcnow().isoformat()
    }
    
    # In a real app, this would send an email to the recipient
    
    return APIResponse(data={
        "reference": gift_reference,
        "status": "sent",
        "message": f"🎁 Gift sent successfully to {gift_data.get('recipient_name')}!",
        "preview_url": f"/gifts/{gift['id']}"
    })
