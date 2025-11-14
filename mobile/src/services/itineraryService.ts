export interface Activity {
  time: string;
  name: string;
  description: string;
  image: string;
}

export interface Day {
  day: number;
  title: string;
  date: string;
  locationCount: number;
  activities: Activity[];
}

export interface Itinerary {
  id: string;
  title: string;
  location: string;
  duration: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  heroImage: string;
  rating: number;
  price: number;
  currency: string;
  days: Day[];
}

// Mock data service - in real app this would fetch from API
export const getItineraryById = (id: string): Itinerary | null => {
  const itineraries: Record<string, Itinerary> = {
    "it1": {
      id: "it1",
      title: "4 Days in Kyoto",
      location: "Kyoto, Japan",
      duration: "4 Days",
      dateRange: "October 26 - October 29",
      startDate: "2024-10-26",
      endDate: "2024-10-29",
      heroImage: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop",
      rating: 4.9,
      price: 1200,
      currency: "USD",
      days: [
        {
          day: 1,
          title: "Historic Temples & Gion",
          date: "Oct 26",
          locationCount: 4,
          activities: [
            {
              time: "MORNING",
              name: "Kiyomizu-dera Temple",
              description: "Iconic wooden temple with city views",
              image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=150&fit=crop"
            },
            {
              time: "LATE MORNING",
              name: "Sannenzaka & Ninenzaka",
              description: "Historic preserved streets",
              image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop"
            },
            {
              time: "AFTERNOON",
              name: "Gion District",
              description: "Explore the famous geisha district",
              image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=200&h=150&fit=crop"
            },
            {
              time: "EVENING",
              name: "Yasaka Shrine",
              description: "Beautiful shrine illuminated at night",
              image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=200&h=150&fit=crop"
            }
          ]
        },
        {
          day: 2,
          title: "Arashiyama Bamboo Grove",
          date: "Oct 27",
          locationCount: 3,
          activities: [
            {
              time: "MORNING",
              name: "Bamboo Grove",
              description: "Walk through towering bamboo forest",
              image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=200&h=150&fit=crop"
            },
            {
              time: "AFTERNOON",
              name: "Tenryu-ji Temple",
              description: "UNESCO World Heritage zen temple",
              image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=150&fit=crop"
            },
            {
              time: "EVENING",
              name: "Togetsukyo Bridge",
              description: "Scenic bridge with mountain views",
              image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop"
            }
          ]
        },
        {
          day: 3,
          title: "Fushimi Inari Shrine",
          date: "Oct 28",
          locationCount: 2,
          activities: [
            {
              time: "MORNING",
              name: "Fushimi Inari Shrine",
              description: "Thousands of vermillion torii gates",
              image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=200&h=150&fit=crop"
            },
            {
              time: "AFTERNOON",
              name: "Sake Tasting in Fushimi",
              description: "Traditional sake brewery district",
              image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=200&h=150&fit=crop"
            }
          ]
        },
        {
          day: 4,
          title: "Golden Pavilion & Departure",
          date: "Oct 29",
          locationCount: 2,
          activities: [
            {
              time: "MORNING",
              name: "Kinkaku-ji (Golden Pavilion)",
              description: "Famous golden temple reflection",
              image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=150&fit=crop"
            },
            {
              time: "LATE MORNING",
              name: "Ryoan-ji Temple",
              description: "Famous zen rock garden",
              image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=200&h=150&fit=crop"
            }
          ]
        }
      ]
    },
    "it2": {
      id: "it2",
      title: "5 Days in Paris",
      location: "Paris, France",
      duration: "5 Days",
      dateRange: "November 15 - November 19",
      startDate: "2024-11-15",
      endDate: "2024-11-19",
      heroImage: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop",
      rating: 4.8,
      price: 1450,
      currency: "USD",
      days: [
        {
          day: 1,
          title: "Classic Paris Icons",
          date: "Nov 15",
          locationCount: 3,
          activities: [
            {
              time: "MORNING",
              name: "Eiffel Tower",
              description: "Iconic iron tower and city symbol",
              image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=200&h=150&fit=crop"
            },
            {
              time: "AFTERNOON",
              name: "Seine River Cruise",
              description: "Scenic boat tour along the Seine",
              image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=200&h=150&fit=crop"
            },
            {
              time: "EVENING",
              name: "Champs-Élysées",
              description: "Famous avenue and Arc de Triomphe",
              image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=200&h=150&fit=crop"
            }
          ]
        },
        {
          day: 2,
          title: "Art & Culture",
          date: "Nov 16",
          locationCount: 2,
          activities: [
            {
              time: "MORNING",
              name: "Louvre Museum",
              description: "World's largest art museum",
              image: "https://images.unsplash.com/photo-1566139884669-4b9356b4c040?w=200&h=150&fit=crop"
            },
            {
              time: "AFTERNOON",
              name: "Notre-Dame Area",
              description: "Gothic cathedral and Île de la Cité",
              image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=200&h=150&fit=crop"
            }
          ]
        }
      ]
    }
  };

  return itineraries[id] || null;
};

export const getAllItineraries = (): Itinerary[] => {
  return [
    {
      id: "it1",
      title: "4 Days in Kyoto",
      location: "Kyoto, Japan",
      duration: "4 Days",
      dateRange: "October 26 - October 29",
      startDate: "2024-10-26",
      endDate: "2024-10-29",
      heroImage: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop",
      rating: 4.9,
      price: 1200,
      currency: "USD",
      days: []
    },
    {
      id: "it2",
      title: "5 Days in Paris",
      location: "Paris, France",
      duration: "5 Days",
      dateRange: "November 15 - November 19",
      startDate: "2024-11-15",
      endDate: "2024-11-19",
      heroImage: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop",
      rating: 4.8,
      price: 1450,
      currency: "USD",
      days: []
    },
    {
      id: "it3",
      title: "6 Days in Tokyo",
      location: "Tokyo, Japan",
      duration: "6 Days",
      dateRange: "December 1 - December 6",
      startDate: "2024-12-01",
      endDate: "2024-12-06",
      heroImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
      rating: 5.0,
      price: 1800,
      currency: "USD",
      days: []
    },
    {
      id: "it4",
      title: "7 Days in Rome",
      location: "Rome, Italy",
      duration: "7 Days",
      dateRange: "January 10 - January 16",
      startDate: "2025-01-10",
      endDate: "2025-01-16",
      heroImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop",
      rating: 4.7,
      price: 1350,
      currency: "USD",
      days: []
    },
    {
      id: "it5",
      title: "3 Days in Santorini",
      location: "Santorini, Greece",
      duration: "3 Days",
      dateRange: "March 20 - March 22",
      startDate: "2025-03-20",
      endDate: "2025-03-22",
      heroImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop",
      rating: 4.9,
      price: 950,
      currency: "USD",
      days: []
    },
    {
      id: "it6",
      title: "5 Days in Bali",
      location: "Bali, Indonesia",
      duration: "5 Days",
      dateRange: "April 5 - April 9",
      startDate: "2025-04-05",
      endDate: "2025-04-09",
      heroImage: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
      rating: 4.8,
      price: 1100,
      currency: "USD",
      days: []
    },
    {
      id: "it7",
      title: "4 Days in Dubai",
      location: "Dubai, UAE",
      duration: "4 Days",
      dateRange: "May 12 - May 15",
      startDate: "2025-05-12",
      endDate: "2025-05-15",
      heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
      rating: 4.6,
      price: 1600,
      currency: "USD",
      days: []
    }
  ];
};
