const API_BASE_URL = 'http://192.168.100.206:8000/api/v1';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name: string;
  avatar?: string;
  bio?: string;
  city?: string;
  visited_places: number;
  checkins: number;
  cities: number;
  followers: number;
  following: number;
  likes: number;
  rated_places: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  badges?: string[];
  posts?: WallPost[];
  wall_posts?: WallPost[];
  posts_count?: number;
  recent_checkins?: any[];
  total_checkins?: number;
  visited_places_list?: any[];
  created_at: string;
  bookings?: any[];
  bookings_count?: number;
  events?: any[];
  events_count?: number;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: {
    [key: string]: string;
  };
}

export interface WallPost {
  id: string;
  location?: string;
  timestamp?: string;
  title?: string;
  description?: string;
  image?: string;
  content?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  created_at?: string;
  user?: {
    username: string;
    avatar: string;
    full_name: string;
  };
  media?: string[];
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse<T> = await response.json();

      if (!result.success) {
        throw new Error(
          result.error
            ? Object.values(result.error).join(', ')
            : 'API request failed',
        );
      }

      return result.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    return this.makeRequest<UserProfile>(`/users/${userId}`);
  }

  async getHotels(): Promise<any[]> {
    const response = await this.makeRequest<any[]>('/hotels');
    return response;
  }

  async getPlaces(): Promise<any[]> {
    const response = await this.makeRequest<any[]>('/places');
    console.log(response);
    return response;
  }

  async getActivities(): Promise<any[]> {
    const response = await this.makeRequest<any[]>('/activities');
    return response;
  }

  async getHotelById(hotelId: string): Promise<any> {
    return this.makeRequest<any>(`/hotels/${hotelId}`);
  }

  async getPlaceById(placeId: string): Promise<any> {
    return this.makeRequest<any>(`/places/${placeId}`);
  }

  async getActivityById(activityId: string): Promise<any> {
    return this.makeRequest<any>(`/activities/${activityId}`);
  }

  async searchExplore(query: string): Promise<any[]> {
    const searchParams = new URLSearchParams({q: query});
    return this.makeRequest<any[]>(`/search?${searchParams.toString()}`);
  }
}

export const apiService = new ApiService();
