from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional

from app.models.schemas import LoginRequest, Token, User, APIResponse
from app.services.json_store import json_store
from app.core.config import settings

router = APIRouter()
security = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await json_store.get_item("users", user_id)
    if user is None:
        raise credentials_exception
    return User(**user)

@router.post("/login", response_model=APIResponse)
async def login(login_data: LoginRequest):
    """Mock login - accepts any email/password combination"""
    users = await json_store.get_collection("users")
    
    # For demo purposes, accept any login and return first user
    if users:
        user = users[0]  # Use first user as demo user
    else:
        # Create a demo user if none exists
        user = {
            "id": "demo_user",
            "username": "demo_traveler",
            "email": login_data.email,
            "full_name": "Demo Traveler",
            "avatar": "/assets/avatars/demo.jpg",
            "bio": "Exploring the world with Traviax ✨",
            "city": "Dubai, UAE",
            "visited_places": 15,
            "checkins": 32,
            "cities": 8,
            "followers": 245,
            "following": 189,
            "likes": 567,
            "rated_places": 23,
            "coordinates": {"lat": 25.2048, "lng": 55.2708},
            "badges": ["Explorer", "Newcomer"],
            "created_at": datetime.utcnow().isoformat()
        }
        await json_store.add_item("users", user)
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"]}, expires_delta=access_token_expires
    )
    
    return APIResponse(
        data=Token(
            access_token=access_token,
            user=User(**user)
        )
    )

@router.get("/me", response_model=APIResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return APIResponse(data=current_user)
