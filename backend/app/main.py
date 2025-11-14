from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn

from app.core.config import settings
from app.routers import reels, users, places, checkins, bookings, concierge, events, auth, explore
from app.routes import itineraries

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Traviax API starting up...")
    yield
    # Shutdown
    print("👋 Traviax API shutting down...")

app = FastAPI(
    title="Traviax API",
    description="Premium social travel platform API with black & gold cinematic theme",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
app.mount("/assets", StaticFiles(directory="assets"), name="assets")

# API routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(reels.router, prefix="/api/v1/reels", tags=["Reels"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(places.router, prefix="/api/v1/places", tags=["Places"])
app.include_router(checkins.router, prefix="/api/v1/checkins", tags=["Check-ins"])
app.include_router(bookings.router, prefix="/api/v1/bookings", tags=["Bookings"])
app.include_router(concierge.router, prefix="/api/v1/concierge", tags=["AI Concierge"])
app.include_router(events.router, prefix="/api/v1/events", tags=["Events"])
app.include_router(explore.router, prefix="/api/v1", tags=["Explore"])
app.include_router(itineraries.router, tags=["Itineraries"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to Traviax API ✨",
    "version": "1.0.0",
        "theme": "Black & Gold Cinematic",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "traviax-api"}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )
