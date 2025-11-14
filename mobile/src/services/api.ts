import axios, { AxiosInstance, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API Configuration
// Use 10.0.2.2 for Android emulator to access host machine's localhost
const API_BASE_URL = "http://192.168.100.206:8000/api/v1";

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        if (!this.token) {
          this.token = await AsyncStorage.getItem("auth_token");
        }
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.api.post("/auth/login", { email, password });
    const { access_token, user } = response.data.data;

    this.token = access_token;
    await AsyncStorage.setItem("auth_token", access_token);
    await AsyncStorage.setItem("user", JSON.stringify(user));

    return { token: access_token, user };
  }

  async logout() {
    this.token = null;
    await AsyncStorage.multiRemove(["auth_token", "user"]);
  }

  async getCurrentUser() {
    const response = await this.api.get("/auth/me");
    return response.data.data;
  }

  // Reels methods
  async getReels(cursor?: string, limit = 10) {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    params.append("limit", limit.toString());

    const response = await this.api.get(`/reels?${params}`);
    return response.data;
  }

  async getReelDetails(reelId: string) {
    const response = await this.api.get(`/reels/${reelId}`);
    return response.data.data;
  }

  async likeReel(reelId: string) {
    const response = await this.api.post(`/reels/${reelId}/like`);
    return response.data.data;
  }

  async commentOnReel(reelId: string, content: string) {
    const response = await this.api.post(`/reels/${reelId}/comment`, {
      content,
    });
    return response.data.data;
  }

  async incrementReelView(reelId: string) {
    const response = await this.api.post(`/reels/${reelId}/view`);
    return response.data.data;
  }

  // Places methods
  async searchPlaces(
    query?: string,
    city?: string,
    category?: string,
    limit = 20
  ) {
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (city) params.append("city", city);
    if (category) params.append("category", category);
    params.append("limit", limit.toString());

    const response = await this.api.get(`/places?${params}`);
    return response.data.data;
  }

  async getPlaceDetails(placeId: string) {
    const response = await this.api.get(`/places/${placeId}`);
    return response.data.data;
  }

  async getPlaceCheckins(placeId: string, limit = 20) {
    const response = await this.api.get(
      `/places/${placeId}/checkins?limit=${limit}`
    );
    return response.data.data;
  }

  async savePlace(placeId: string) {
    const response = await this.api.post(`/places/${placeId}/save`);
    return response.data.data;
  }

  async getPlaceCategories() {
    const response = await this.api.get("/places/categories/list");
    return response.data.data;
  }

  async getPopularCities() {
    const response = await this.api.get("/places/cities/popular");
    return response.data.data;
  }

  // Check-ins methods
  async createCheckin(
    placeId: string,
    rating: number,
    note?: string,
    photos: string[] = []
  ) {
    const response = await this.api.post("/checkins", {
      place_id: placeId,
      rating,
      note,
      photos,
    });
    return response.data.data;
  }

  async getCheckinDetails(checkinId: string) {
    const response = await this.api.get(`/checkins/${checkinId}`);
    return response.data.data;
  }

  async likeCheckin(checkinId: string) {
    const response = await this.api.post(`/checkins/${checkinId}/like`);
    return response.data.data;
  }

  async getRecentCheckins(limit = 20) {
    const response = await this.api.get(`/checkins?limit=${limit}`);
    return response.data.data;
  }

  // Users methods
  async getUserProfile(userId: string) {
    const response = await this.api.get(`/users/${userId}`);
    return response.data.data;
  }

  async getUserWall(userId: string) {
    const response = await this.api.get(`/users/${userId}/wall`);
    return response.data.data;
  }

  async createWallPost(userId: string, content: string, media: string[] = []) {
    const response = await this.api.post(`/users/${userId}/post`, {
      content,
      media,
    });
    return response.data.data;
  }

  async getUserCheckins(userId: string) {
    const response = await this.api.get(`/users/${userId}/checkins`);
    return response.data.data;
  }

  async getUserPlaces(userId: string) {
    const response = await this.api.get(`/users/${userId}/places`);
    return response.data.data;
  }

  // Concierge methods
  async chatWithConcierge(message: string, userId?: string) {
    const response = await this.api.post("/concierge/chat", {
      message,
      user_id: userId,
    });
    return response.data.data;
  }

  async getTravelSuggestions() {
    const response = await this.api.get("/concierge/suggestions");
    return response.data.data;
  }

  async submitConciergeFeedback(feedback: any) {
    const response = await this.api.post("/concierge/feedback", feedback);
    return response.data.data;
  }

  // Bookings methods
  async searchBookings(searchData: any) {
    const response = await this.api.post("/bookings/search", searchData);
    return response.data.data;
  }

  async confirmBooking(bookingData: any) {
    const response = await this.api.post("/bookings/confirm", bookingData);
    return response.data.data;
  }

  async getUserBookings() {
    const response = await this.api.get("/bookings/my-bookings");
    return response.data.data;
  }

  async getBookingDetails(bookingId: string) {
    const response = await this.api.get(`/bookings/${bookingId}`);
    return response.data.data;
  }

  async sendGiftBooking(giftData: any) {
    const response = await this.api.post("/bookings/gift", giftData);
    return response.data.data;
  }

  // Events methods
  async getEvents(city?: string, category?: string, limit = 20) {
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (category) params.append("category", category);
    params.append("limit", limit.toString());

    const response = await this.api.get(`/events?${params}`);
    return response.data.data;
  }

  async getEventDetails(eventId: string) {
    const response = await this.api.get(`/events/${eventId}`);
    return response.data.data;
  }

  async joinEvent(eventId: string) {
    const response = await this.api.post(`/events/${eventId}/join`);
    return response.data.data;
  }

  async getEventCategories() {
    const response = await this.api.get("/events/categories/list");
    return response.data.data;
  }
}

export const apiService = new ApiService();
