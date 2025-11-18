from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import httpx

from app.core.config import settings
from app.models.schemas import APIResponse

router = APIRouter()


class ChatHistoryItem(BaseModel):
    role: str  # 'user' | 'assistant'
    content: str


class ChatRequest(BaseModel):
    userMessage: str
    history: Optional[List[ChatHistoryItem]] = None


def _sanitize_history(history: Optional[List[ChatHistoryItem]]) -> List[Dict[str, str]]:
    if not history:
        return []
    valid_roles = {"user", "assistant", "system"}
    out: List[Dict[str, str]] = []
    for item in history:
        role = item.role if item.role in valid_roles else "user"
        content = (item.content or "").strip()
        if content:
            out.append({"role": role, "content": content})
    return out


@router.post("/chat")
async def chat(request: ChatRequest) -> APIResponse:
    api_key = settings.OPENAI_API_KEY
    model = settings.OPENAI_MODEL or "gpt-4o-mini"

    if not api_key:
        return APIResponse(
            success=False,
            data={"reply": ""},
            error={"message": "OpenAI API key is not configured on the server."},
        )

    # Build messages payload with optional system primer
    messages: List[Dict[str, str]] = [
        {
            "role": "system",
            "content": "You are TraviAI, a helpful, concise travel assistant. Answer clearly and help plan trips.",
        }
    ]
    messages.extend(_sanitize_history(request.history))
    messages.append({"role": "user", "content": request.userMessage.strip()})

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload: Dict[str, Any] = {
        "model": model,
        "messages": messages,
        "temperature": 0.7,
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload,
            )
        data = resp.json()
        if resp.status_code != 200:
            # Return a graceful error response
            detail = data.get("error", {}).get("message", "Failed to generate a response.")
            return APIResponse(
                success=False,
                data={"reply": ""},
                error={"message": detail},
            )

        choices = data.get("choices", [])
        reply = (
            choices[0]
            .get("message", {})
            .get("content", "I'm sorry, I couldn't generate a response just now.")
        )
        return APIResponse(data={"reply": reply})
    except httpx.TimeoutException:
        return APIResponse(
            success=False,
            data={"reply": ""},
            error={"message": "The request to the AI service timed out. Please try again."},
        )
    except httpx.RequestError as exc:
        return APIResponse(
            success=False,
            data={"reply": ""},
            error={"message": f"Network error calling AI service: {exc}"},
        )
    except Exception as exc:
        return APIResponse(
            success=False,
            data={"reply": ""},
            error={"message": f"Unexpected server error: {exc}"},
        )
