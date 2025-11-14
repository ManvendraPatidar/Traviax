# Traviax Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Expo CLI (`npm install -g @expo/cli`)

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Web Demo Setup
```bash
cd web
npm install
npm run dev
```

### 3. Mobile App Setup
```bash
cd mobile
npm install
npx expo start
```

## 🌐 Access URLs
- **Backend API**: http://localhost:8000
- **Web Demo**: http://localhost:3000
- **Mobile App**: Scan QR code in Expo Go app

## 🔑 Demo Credentials
- **Email**: Any email (e.g., demo@traviax.com)
- **Password**: Any password (mock authentication)

## 📱 Features Implemented

### Backend (FastAPI)
- ✅ RESTful API with modular routers
- ✅ Mock JSON data persistence
- ✅ JWT authentication (mock)
- ✅ CORS enabled for frontend integration
- ✅ Static asset serving
- ✅ Comprehensive API endpoints for all features

### Web Demo (Next.js)
- ✅ Black & gold cinematic theme
- ✅ Responsive design with Tailwind CSS
- ✅ Framer Motion animations
- ✅ Tab-based navigation
- ✅ Reels feed with interactions
- ✅ AI Concierge chat simulation
- ✅ Booking search interface
- ✅ Glass morphism effects

### Mobile App (React Native + Expo)
- ✅ Bottom tab navigation
- ✅ Infinite scroll reels feed
- ✅ Explore screen with search
- ✅ AI Concierge chat
- ✅ Booking search and management
- ✅ User profile with stats
- ✅ Smooth animations with Reanimated
- ✅ Internationalization (English/Arabic)
- ✅ Black & gold theme system

## 🎨 Theme System
- **Primary**: Gold (#FFD700)
- **Accent**: Rich Black (#1A1A1A)
- **Background**: Pure Black (#000000)
- **Glass Effects**: Gold-tinted transparency
- **Typography**: Inter font family
- **Animations**: Smooth transitions and micro-interactions

## 🌍 Internationalization
- **Languages**: English (default), Arabic
- **RTL Support**: Automatic layout adjustment
- **Device Detection**: Uses device locale
- **Fallback**: English for unsupported languages

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - Mock login
- `GET /auth/me` - Get current user

### Reels
- `GET /reels/feed` - Infinite scroll feed
- `POST /reels/{reel_id}/like` - Toggle like
- `POST /reels/{reel_id}/comment` - Add comment

### Places
- `GET /places/search` - Search places
- `GET /places/{place_id}` - Place details
- `GET /places/categories` - Place categories

### Bookings
- `POST /bookings/search/flights` - Flight search
- `POST /bookings/search/hotels` - Hotel search
- `POST /bookings/confirm` - Confirm booking

### Concierge
- `POST /concierge/chat` - AI chat endpoint
- `GET /concierge/suggestions` - Get suggestions

### Users & More
- Complete user profiles, check-ins, events, and social features

## 🎯 Mock Data Structure
Located in `backend/mock_data/db.json`:
- Users with profiles and stats
- Reels with metadata and interactions
- Places with categories and details
- Bookings and trips
- Check-ins and posts
- Events and social data

## 🔒 Environment Variables
Copy `.env.example` to `.env` in backend folder:
```env
SECRET_KEY=your-secret-key
OPENAI_API_KEY=optional-for-real-ai
AMADEUS_API_KEY=optional-for-real-flights
GOOGLE_MAPS_API_KEY=optional-for-real-maps
```

## 📱 Mobile Development
```bash
# Start Expo development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Build for production
npx expo build
```

## 🌐 Web Development
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🐛 Troubleshooting

### Backend Issues
- Ensure Python 3.8+ is installed
- Install dependencies: `pip install -r requirements.txt`
- Check port 8000 is available

### Web Issues
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Mobile Issues
- Clear Expo cache: `npx expo start --clear`
- Ensure Expo CLI is latest: `npm install -g @expo/cli@latest`

## 🚀 Deployment Ready
- Backend: Deploy to Heroku, Railway, or DigitalOcean
- Web: Deploy to Vercel, Netlify, or AWS
- Mobile: Build with EAS Build for app stores

## 🎬 Demo Flow
1. Start backend server
2. Open web demo at localhost:3000
3. Explore reels, chat with AI, search bookings
4. Install Expo Go and scan QR code for mobile
5. Test cross-platform consistency

The Traviax prototype is now complete with all requested features, internationalization, and a premium black & gold cinematic experience across all platforms!
