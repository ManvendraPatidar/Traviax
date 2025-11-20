import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.logging.logger import log_api_call, log_error

class APILoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        method = request.method
        url_path = str(request.url.path)
        if request.url.query:
            url_path += f"?{request.url.query}"
        
        try:
            response = await call_next(request)
            duration = time.time() - start_time
            log_api_call(method, url_path, response.status_code, duration)
            return response
        except Exception as e:
            duration = time.time() - start_time
            log_error(f"API Error - {method} {url_path}", e)
            log_api_call(method, url_path, 500, duration)
            raise e
