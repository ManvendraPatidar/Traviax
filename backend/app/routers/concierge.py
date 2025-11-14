from fastapi import APIRouter, HTTPException, Depends
from typing import List
import asyncio
import random

from app.models.schemas import ConciergeMessage, ConciergeResponse, APIResponse
from app.services.json_store import json_store
from app.routers.auth import get_current_user, User

router = APIRouter()

# Mock GPT-4 responses for different travel queries
MOCK_RESPONSES = {
    "istanbul": {
        "response": "✨ Istanbul is absolutely magical! Here's a perfect 3-day itinerary:\n\n🏛️ **Day 1 - Historic Peninsula**\n• Morning: Sultanahmet Mosque & Hagia Sophia\n• Afternoon: Topkapi Palace & Basilica Cistern\n• Evening: Sunset at Galata Bridge\n\n🌊 **Day 2 - Bosphorus & Modern Istanbul**\n• Morning: Bosphorus cruise\n• Afternoon: Galata Tower & Istiklal Street\n• Evening: Rooftop dinner in Beyoğlu\n\n🎨 **Day 3 - Local Experiences**\n• Morning: Grand Bazaar shopping\n• Afternoon: Turkish bath experience\n• Evening: Traditional Turkish dinner with live music",
        "suggestions": [
            "Book a Bosphorus sunset cruise",
            "Try Turkish breakfast at Van Kahvaltı Evi", 
            "Visit during shoulder season (April-May)",
            "Learn basic Turkish phrases"
        ]
    },
    "dubai": {
        "response": "🏜️ Dubai offers the perfect blend of luxury and culture! Here's your golden itinerary:\n\n🏙️ **Day 1 - Modern Dubai**\n• Morning: Burj Khalifa & Dubai Mall\n• Afternoon: Dubai Marina walk\n• Evening: Atlantis Palm sunset\n\n🕌 **Day 2 - Cultural Dubai**\n• Morning: Al Fahidi Historical District\n• Afternoon: Gold & Spice Souks\n• Evening: Dhow cruise dinner\n\n🏖️ **Day 3 - Desert & Beach**\n• Morning: Desert safari adventure\n• Afternoon: Jumeirah Beach relaxation\n• Evening: Rooftop dining at Burj Al Arab",
        "suggestions": [
            "Book desert safari with camel riding",
            "Try traditional Emirati cuisine",
            "Visit during winter months (Nov-Mar)",
            "Respect local customs and dress codes"
        ]
    },
    "hidden_gems": {
        "response": "🔍 I love finding hidden gems! Here are some secret spots that locals cherish:\n\n🏛️ **Istanbul Hidden Gems:**\n• Pierre Loti Café - Secret hilltop views\n• Balat District - Colorful Ottoman houses\n• Çukurcuma - Antique shops & vintage cafés\n\n🏜️ **Dubai Hidden Gems:**\n• Al Seef Heritage District - Traditional architecture\n• Hatta Rock Pools - Natural mountain oasis\n• Alserkal Avenue - Underground art scene\n\nThese spots offer authentic experiences away from tourist crowds!",
        "suggestions": [
            "Visit early morning for best photos",
            "Connect with local photographers",
            "Try street food in these areas",
            "Respect residential neighborhoods"
        ]
    },
    "food": {
        "response": "🍽️ Food is the soul of travel! Here are culinary adventures you can't miss:\n\n🇹🇷 **Istanbul Food Journey:**\n• Breakfast: Turkish breakfast at Pandeli\n• Lunch: Döner at Hamdi Restaurant\n• Snack: Turkish delight at Hacı Bekir\n• Dinner: Ottoman cuisine at Asitane\n\n🇦🇪 **Dubai Flavors:**\n• Breakfast: Shakshuka at Arabian Tea House\n• Lunch: Emirati cuisine at Al Fanar\n• Snack: Dates and Arabic coffee\n• Dinner: Fine dining at Pierchic\n\nDon't forget to try street food - it's where the real flavors hide! ✨",
        "suggestions": [
            "Join a food walking tour",
            "Learn to cook local dishes",
            "Visit local markets early morning",
            "Ask locals for their favorite spots"
        ]
    }
}

def get_mock_response(message: str) -> dict:
    """Generate mock AI response based on message content"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ["istanbul", "turkey", "turkish"]):
        return MOCK_RESPONSES["istanbul"]
    elif any(word in message_lower for word in ["dubai", "uae", "emirates"]):
        return MOCK_RESPONSES["dubai"]
    elif any(word in message_lower for word in ["hidden", "secret", "local", "gems"]):
        return MOCK_RESPONSES["hidden_gems"]
    elif any(word in message_lower for word in ["food", "restaurant", "eat", "cuisine"]):
        return MOCK_RESPONSES["food"]
    else:
        # Generic travel response
        return {
            "response": "🌍 I'd love to help you plan an amazing trip! Could you tell me more about:\n\n• Which destination interests you?\n• What type of experiences are you looking for?\n• How many days are you planning?\n• Any specific interests (food, culture, adventure)?\n\nThe more details you share, the better I can personalize your perfect itinerary! ✨",
            "suggestions": [
                "Tell me about your dream destination",
                "Share your travel style preferences", 
                "Ask about specific cities or regions",
                "Inquire about seasonal travel tips"
            ]
        }

@router.post("/chat", response_model=APIResponse)
async def chat_with_concierge(
    message_data: ConciergeMessage,
    current_user: User = Depends(get_current_user)
):
    """Chat with AI travel concierge"""
    
    # Simulate typing delay (realistic AI response time)
    typing_duration = random.randint(1500, 3500)
    await asyncio.sleep(typing_duration / 1000)  # Convert to seconds
    
    # Get mock response based on message content
    mock_data = get_mock_response(message_data.message)
    
    response = ConciergeResponse(
        response=mock_data["response"],
        suggestions=mock_data["suggestions"],
        typing_duration=typing_duration
    )
    
    return APIResponse(data=response)

@router.get("/suggestions", response_model=APIResponse)
async def get_travel_suggestions():
    """Get popular travel suggestions"""
    suggestions = [
        "Plan a 3-day trip to Istanbul",
        "Show me hidden gems in Dubai", 
        "Best food experiences in Turkey",
        "Romantic getaway ideas for couples",
        "Adventure activities in UAE",
        "Cultural experiences in the Middle East",
        "Photography spots in Istanbul",
        "Luxury travel in Dubai"
    ]
    
    return APIResponse(data=suggestions)

@router.post("/feedback", response_model=APIResponse)
async def submit_concierge_feedback(
    feedback: dict,
    current_user: User = Depends(get_current_user)
):
    """Submit feedback about concierge responses"""
    
    # In a real app, this would store feedback for AI improvement
    # For demo, just acknowledge the feedback
    
    return APIResponse(data={
        "message": "Thank you for your feedback! It helps me provide better travel recommendations.",
        "feedback_id": f"fb_{random.randint(1000, 9999)}"
    })
