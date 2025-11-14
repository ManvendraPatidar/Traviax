from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
import uuid
from datetime import datetime

from app.models.schemas import Reel, ReelResponse, APIResponse, CommentCreate, Comment
from app.services.json_store import json_store
from app.routers.auth import get_current_user, User

router = APIRouter()

@router.get("", response_model=APIResponse)
async def get_reels(
    cursor: Optional[str] = Query(None, description="Pagination cursor"),
    limit: int = Query(10, ge=1, le=50, description="Number of reels to fetch")
):
    """Get infinite feed of reels"""
    reels = await json_store.get_collection("reels")
    
    # Sort by created_at descending (newest first)
    reels.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    
    # Simple pagination - in production, use proper cursor-based pagination
    start_idx = 0
    if cursor:
        try:
            start_idx = int(cursor)
        except ValueError:
            start_idx = 0
    
    end_idx = start_idx + limit
    paginated_reels = reels[start_idx:end_idx]
    
    # Add creator info to each reel
    for reel in paginated_reels:
        creator = await json_store.get_item("users", reel["creator_id"])
        if creator:
            reel["creator"] = {
                "id": creator["id"],
                "username": creator["username"],
                "avatar": creator["avatar"],
                "full_name": creator["full_name"]
            }
    
    has_more = end_idx < len(reels)
    next_cursor = str(end_idx) if has_more else None
    
    return APIResponse(
        data=ReelResponse(
            reels=[Reel(**reel) for reel in paginated_reels],
            cursor=next_cursor,
            has_more=has_more
        )
    )

@router.get("/{reel_id}", response_model=APIResponse)
async def get_reel_details(reel_id: str):
    """Get detailed reel information"""
    reel = await json_store.get_item("reels", reel_id)
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")
    
    # Add creator info
    creator = await json_store.get_item("users", reel["creator_id"])
    if creator:
        reel["creator"] = {
            "id": creator["id"],
            "username": creator["username"],
            "avatar": creator["avatar"],
            "full_name": creator["full_name"]
        }
    
    # Get comments
    comments = await json_store.filter_items("comments", reel_id=reel_id)
    for comment in comments:
        user = await json_store.get_item("users", comment["user_id"])
        if user:
            comment["user"] = {
                "username": user["username"],
                "avatar": user["avatar"]
            }
    
    reel["comments_list"] = comments
    
    return APIResponse(data=Reel(**reel))

@router.post("/{reel_id}/like", response_model=APIResponse)
async def toggle_like_reel(reel_id: str, current_user: User = Depends(get_current_user)):
    """Toggle like on a reel"""
    reel = await json_store.get_item("reels", reel_id)
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")
    
    # In a real app, track individual likes. For demo, just increment/decrement
    current_likes = reel.get("likes", 0)
    new_likes = current_likes + 1  # Always increment for demo
    
    await json_store.update_item("reels", reel_id, {"likes": new_likes})
    
    return APIResponse(data={"likes": new_likes, "liked": True})

@router.post("/{reel_id}/comment", response_model=APIResponse)
async def add_comment(
    reel_id: str, 
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user)
):
    """Add comment to a reel"""
    reel = await json_store.get_item("reels", reel_id)
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")
    
    comment = {
        "id": str(uuid.uuid4()),
        "reel_id": reel_id,
        "user_id": current_user.id,
        "content": comment_data.content,
        "likes": 0,
        "created_at": datetime.utcnow().isoformat()
    }
    
    await json_store.add_item("comments", comment)
    
    # Update reel comment count
    current_comments = reel.get("comments", 0)
    await json_store.update_item("reels", reel_id, {"comments": current_comments + 1})
    
    # Add user info to response
    comment["user"] = {
        "username": current_user.username,
        "avatar": current_user.avatar
    }
    
    return APIResponse(data=Comment(**comment))

@router.post("/{reel_id}/view", response_model=APIResponse)
async def increment_view(reel_id: str):
    """Increment view count for a reel"""
    reel = await json_store.get_item("reels", reel_id)
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")
    
    current_views = reel.get("views", 0)
    new_views = current_views + 1
    
    await json_store.update_item("reels", reel_id, {"views": new_views})
    
    return APIResponse(data={"views": new_views})
