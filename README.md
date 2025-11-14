# Traviax - Black & Gold Cinematic Travel Platform

A premium social travel platform prototype with black & gold cinematic theme, featuring mobile app (React Native + Expo), web demo (Next.js), and mock backend (FastAPI).

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.9+
- Expo CLI (`npm install -g @expo/cli`)

### Setup & Run

1. **Backend (FastAPI)**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. **Mobile App (Expo)**
```bash
cd mobile
npm install
npx expo start
```

3. **Web Demo (Next.js)**
```bash
cd web
npm install
npm run dev
```

## 🎨 Theme
- **Primary**: Pure Black (#000000)
- **Accent**: Gold (#D4AF37)
- **Secondary**: Dark Charcoal (#0F0F10)
- **Text**: White (#FFFFFF)

## 🌍 Features
- Infinite Reels Feed (TikTok-style)
- AI Travel Concierge (GPT-4 powered)
- Trip Planner & Bookings
- Social Check-ins & Reviews
- Multi-language (EN/AR) with RTL support
- Premium animations & transitions

## 📱 Demo Credentials
- Username: `traveler@traviax.com`
- Password: `demo123`

## 🔧 API Documentation
Backend API docs available at: http://localhost:8000/docs

## 📁 Project Structure
```
/traviax/
├── mobile/          # React Native + Expo
├── web/            # Next.js web demo
├── backend/        # FastAPI mock backend
└── design/         # Assets & screenshots
```
