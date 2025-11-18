from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import json
from openai import OpenAI

router = APIRouter()

# Initialize OpenAI client
client = None
try:
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key and api_key != "your-openai-key-here":
        client = OpenAI(api_key=api_key)
except Exception as e:
    print(f"Warning: OpenAI client initialization failed: {e}")

class GenerateItineraryRequest(BaseModel):
    destination: str
    startDate: str
    endDate: str
    budgetMin: Optional[int] = 500
    budgetMax: Optional[int] = 2000
    numberOfTravelers: Optional[int] = 1
    travelType: Optional[str] = "Solo"
    selectedPreferences: Optional[List[str]] = []
    flexibleDates: Optional[bool] = False

def load_example_itinerary():
    """Load example itinerary structure from mock data"""
    try:
        mock_data_path = os.path.join(os.path.dirname(__file__), "../../mock_data/db.json")
        with open(mock_data_path, 'r') as file:
            data = json.load(file)
            itineraries = data.get('itineraries', [])
            if itineraries:
                return itineraries[0]  # Return first itinerary as example
    except Exception as e:
        print(f"Error loading example itinerary: {e}")
    return None

@router.post("/api/generateItinerary")
async def generate_itinerary(request: GenerateItineraryRequest):
    """Generate a travel itinerary using OpenAI"""
    
    # Load example itinerary structure
    example_itinerary = load_example_itinerary()
    
    if not example_itinerary:
        raise HTTPException(status_code=500, detail="Failed to load itinerary template")
    
    # If OpenAI is not configured, return a mock itinerary
    if not client:
        print("OpenAI not configured, returning mock itinerary")
        return create_mock_itinerary(request, example_itinerary)
    
    try:
        # Create the system prompt with exact JSON structure
        system_prompt = f"""You are a professional travel planner AI. Generate a detailed travel itinerary in JSON format.

The JSON structure MUST match this EXACT format:
{json.dumps(example_itinerary, indent=2)}

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON, no markdown, no code blocks, no explanations
2. Use the EXACT same field names and structure as the example
3. Include all required fields: id, title, location, duration, dateRange, startDate, endDate, heroImage, rating, price, currency, days
4. Each day must have: day, title, date, locationCount, activities
5. Each activity must have: time, name, description, image
6. Use realistic image URLs from Unsplash (format: https://images.unsplash.com/photo-XXXXXXXXX?w=800&h=600&fit=crop)
7. Time values should be: MORNING, LATE MORNING, AFTERNOON, LATE AFTERNOON, EVENING
8. Generate appropriate number of days based on the date range
9. Price should be within the budget range provided
10. Make the itinerary creative, detailed, and personalized to the destination"""

        user_prompt = f"""Generate a travel itinerary with these details:

Destination: {request.destination}
Start Date: {request.startDate}
End Date: {request.endDate}
Budget Range: ${request.budgetMin} - ${request.budgetMax}
Number of Travelers: {request.numberOfTravelers}
Travel Type: {request.travelType}
Preferences: {', '.join(request.selectedPreferences) if request.selectedPreferences else 'None'}
Flexible Dates: {'Yes' if request.flexibleDates else 'No'}

Generate a complete itinerary in the exact JSON format specified. Include:
- Unique ID (format: "gen_" + random string)
- Compelling title
- Accurate location
- Duration string (e.g., "4 Days")
- Date range string
- Beautiful hero image URL
- Realistic rating (4.5-5.0)
- Price within budget
- Currency (USD)
- Detailed daily activities with times, names, descriptions, and images

Return ONLY the JSON object, nothing else."""

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=4000,
            response_format={"type": "json_object"}
        )
        
        # Parse the response
        generated_content = response.choices[0].message.content
        itinerary_data = json.loads(generated_content)
        
        # Validate the structure
        required_fields = ["id", "title", "location", "duration", "dateRange", "heroImage", "rating", "price", "currency", "days"]
        for field in required_fields:
            if field not in itinerary_data:
                raise ValueError(f"Missing required field: {field}")
        
        return itinerary_data
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        # Fallback to mock itinerary
        return create_mock_itinerary(request, example_itinerary)
    except Exception as e:
        print(f"Error generating itinerary with OpenAI: {e}")
        # Fallback to mock itinerary
        return create_mock_itinerary(request, example_itinerary)

def create_mock_itinerary(request: GenerateItineraryRequest, example: Dict[str, Any]) -> Dict[str, Any]:
    """Create a mock itinerary when OpenAI is not available"""
    import random
    from datetime import datetime, timedelta
    
    # Calculate number of days
    try:
        start = datetime.strptime(request.startDate, "%b %d, %Y")
        end = datetime.strptime(request.endDate, "%b %d, %Y")
        num_days = (end - start).days + 1
    except:
        num_days = 4
    
    # Rich activity templates with varied content
    activity_templates = {
        "cultural": [
            {
                "names": ["Historic Temple Visit", "Ancient Fort Exploration", "Museum Tour", "Heritage Walk", "Palace Discovery"],
                "descriptions": [
                    "Immerse yourself in centuries of history and architectural marvels",
                    "Discover ancient artifacts and cultural treasures",
                    "Walk through time in this beautifully preserved heritage site",
                    "Experience the grandeur of royal architecture",
                    "Explore intricate carvings and historical significance"
                ],
                "images": [
                    "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1548013146-72479768bada?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=200&h=150&fit=crop"
                ]
            },
            {
                "names": ["Local Market Experience", "Artisan Workshop", "Traditional Craft Center", "Cultural Performance", "Street Art Tour"],
                "descriptions": [
                    "Engage with local artisans and discover traditional crafts",
                    "Witness master craftsmen at work creating beautiful pieces",
                    "Browse colorful stalls filled with local handicrafts",
                    "Experience vibrant cultural performances and music",
                    "Explore stunning murals and contemporary street art"
                ],
                "images": [
                    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=200&h=150&fit=crop"
                ]
            }
        ],
        "food": [
            {
                "names": ["Street Food Tour", "Cooking Class", "Fine Dining Experience", "Food Market Visit", "Culinary Workshop"],
                "descriptions": [
                    "Savor authentic local flavors from beloved street vendors",
                    "Learn to prepare traditional dishes with expert chefs",
                    "Indulge in exquisite cuisine at a renowned restaurant",
                    "Sample fresh produce and local delicacies",
                    "Master the art of regional cooking techniques"
                ],
                "images": [
                    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=150&fit=crop"
                ]
            },
            {
                "names": ["Rooftop Dining", "Sunset Dinner Cruise", "Traditional Tea Ceremony", "Wine Tasting", "Dessert Tour"],
                "descriptions": [
                    "Enjoy panoramic city views while dining on local specialties",
                    "Savor delicious cuisine as you cruise along scenic waters",
                    "Experience the ancient ritual of tea preparation",
                    "Sample regional wines paired with local cheeses",
                    "Indulge in sweet treats from the best local bakeries"
                ],
                "images": [
                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=200&h=150&fit=crop"
                ]
            }
        ],
        "nature": [
            {
                "names": ["Sunrise Hike", "Botanical Garden Visit", "Nature Trail Walk", "Waterfall Excursion", "Wildlife Safari"],
                "descriptions": [
                    "Watch the sun rise over breathtaking mountain vistas",
                    "Stroll through lush gardens filled with exotic plants",
                    "Discover diverse flora and fauna on scenic trails",
                    "Marvel at cascading waters in a pristine natural setting",
                    "Spot native wildlife in their natural habitat"
                ],
                "images": [
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=150&fit=crop"
                ]
            },
            {
                "names": ["Beach Relaxation", "Coastal Walk", "Sunset Viewpoint", "Lake Boating", "Mountain Panorama"],
                "descriptions": [
                    "Unwind on pristine sandy beaches with crystal-clear waters",
                    "Enjoy refreshing sea breezes along the scenic coastline",
                    "Witness spectacular sunset colors painting the sky",
                    "Glide across calm waters surrounded by natural beauty",
                    "Take in sweeping views from elevated vantage points"
                ],
                "images": [
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop"
                ]
            }
        ],
        "adventure": [
            {
                "names": ["Zip Lining Adventure", "Rock Climbing", "Paragliding Experience", "White Water Rafting", "Bungee Jumping"],
                "descriptions": [
                    "Soar through the air on thrilling zip line courses",
                    "Challenge yourself on natural rock formations",
                    "Experience the freedom of flight with stunning aerial views",
                    "Navigate exciting rapids on an adrenaline-pumping ride",
                    "Take the ultimate leap for an unforgettable rush"
                ],
                "images": [
                    "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=200&h=150&fit=crop"
                ]
            },
            {
                "names": ["Cycling Tour", "Kayaking Adventure", "Horseback Riding", "ATV Safari", "Scuba Diving"],
                "descriptions": [
                    "Pedal through scenic routes and charming neighborhoods",
                    "Paddle through serene waters and hidden coves",
                    "Explore countryside trails on horseback",
                    "Conquer rugged terrain on powerful all-terrain vehicles",
                    "Dive into underwater worlds teeming with marine life"
                ],
                "images": [
                    "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop"
                ]
            }
        ],
        "relaxation": [
            {
                "names": ["Spa & Wellness", "Yoga Session", "Meditation Retreat", "Hot Springs Visit", "Massage Therapy"],
                "descriptions": [
                    "Rejuvenate with luxurious spa treatments and therapies",
                    "Find inner peace through guided yoga practice",
                    "Disconnect and recharge in a tranquil setting",
                    "Soak in natural thermal waters with healing properties",
                    "Release tension with expert therapeutic massage"
                ],
                "images": [
                    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1545389336-cf090694435e?w=200&h=150&fit=crop"
                ]
            },
            {
                "names": ["Garden Stroll", "Café Hopping", "Bookstore Visit", "Art Gallery Tour", "Scenic Picnic"],
                "descriptions": [
                    "Wander through peaceful gardens and green spaces",
                    "Discover charming cafés and their signature beverages",
                    "Browse literary treasures in cozy bookshops",
                    "Admire contemporary and classical artworks",
                    "Enjoy a leisurely outdoor meal in beautiful surroundings"
                ],
                "images": [
                    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=150&fit=crop"
                ]
            }
        ],
        "nightlife": [
            {
                "names": ["Night Market Visit", "Live Music Venue", "Rooftop Bar", "Cultural Show", "Night Photography Walk"],
                "descriptions": [
                    "Experience vibrant evening markets filled with energy",
                    "Enjoy live performances from talented local musicians",
                    "Sip cocktails while taking in illuminated city views",
                    "Watch captivating traditional dance and music performances",
                    "Capture the city's beauty under twinkling lights"
                ],
                "images": [
                    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&h=150&fit=crop",
                    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&h=150&fit=crop"
                ]
            }
        ]
    }
    
    # Day themes for variety
    day_themes = [
        {"theme": "cultural", "title_prefix": "Cultural Immersion"},
        {"theme": "food", "title_prefix": "Culinary Journey"},
        {"theme": "nature", "title_prefix": "Natural Wonders"},
        {"theme": "adventure", "title_prefix": "Adventure Day"},
        {"theme": "relaxation", "title_prefix": "Relaxation & Wellness"},
        {"theme": "cultural", "title_prefix": "Heritage Exploration"},
        {"theme": "food", "title_prefix": "Gastronomic Delights"}
    ]
    
    # Time slots
    time_slots = ["MORNING", "LATE MORNING", "AFTERNOON", "LATE AFTERNOON", "EVENING"]
    
    # Generate unique days
    mock_days = []
    used_activities = set()
    
    for i in range(num_days):
        day_num = i + 1
        theme_info = day_themes[i % len(day_themes)]
        theme = theme_info["theme"]
        
        # Select activities for this day
        day_activities = []
        num_activities = random.randint(3, 4)
        
        # Get available categories based on preferences or use all
        if request.selectedPreferences and len(request.selectedPreferences) > 0:
            # Map preferences to themes
            pref_map = {
                "Adventure": "adventure",
                "Relax": "relaxation",
                "Local Cuisine": "food",
                "Hotel": "relaxation"
            }
            available_themes = [pref_map.get(p, "cultural") for p in request.selectedPreferences]
            available_themes.append(theme)  # Always include day theme
        else:
            available_themes = list(activity_templates.keys())
        
        for j in range(num_activities):
            # Select a random theme for this activity
            activity_theme = random.choice(available_themes)
            template_category = random.choice(activity_templates[activity_theme])
            
            # Pick a unique activity
            activity_index = random.randint(0, len(template_category["names"]) - 1)
            activity_key = f"{activity_theme}_{activity_index}_{j}"
            
            # Ensure uniqueness
            attempts = 0
            while activity_key in used_activities and attempts < 10:
                activity_theme = random.choice(available_themes)
                template_category = random.choice(activity_templates[activity_theme])
                activity_index = random.randint(0, len(template_category["names"]) - 1)
                activity_key = f"{activity_theme}_{activity_index}_{j}"
                attempts += 1
            
            used_activities.add(activity_key)
            
            day_activities.append({
                "time": time_slots[j % len(time_slots)],
                "name": template_category["names"][activity_index],
                "description": template_category["descriptions"][activity_index % len(template_category["descriptions"])],
                "image": template_category["images"][activity_index % len(template_category["images"])]
            })
        
        # Create day entry
        mock_days.append({
            "day": day_num,
            "title": f"{theme_info['title_prefix']} in {request.destination}",
            "date": f"Day {day_num}",
            "locationCount": len(day_activities),
            "activities": day_activities
        })
    
    # Select hero image based on destination or preferences
    hero_images = [
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop"
    ]
    
    # Create mock itinerary
    mock_itinerary = {
        "id": f"gen_{random.randint(1000, 9999)}",
        "title": f"{num_days} Days in {request.destination}",
        "location": request.destination,
        "duration": f"{num_days} Days",
        "dateRange": f"{request.startDate} - {request.endDate}",
        "startDate": request.startDate,
        "endDate": request.endDate,
        "heroImage": random.choice(hero_images),
        "rating": round(random.uniform(4.5, 5.0), 1),
        "price": random.randint(request.budgetMin, request.budgetMax),
        "currency": "USD",
        "days": mock_days
    }
    
    return mock_itinerary
