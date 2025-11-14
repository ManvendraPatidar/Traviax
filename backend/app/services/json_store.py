import json
import asyncio
from typing import Dict, List, Any, Optional
from pathlib import Path
import aiofiles
from app.core.config import settings

class JSONStore:
    def __init__(self):
        self.data_path = Path(settings.MOCK_DATA_PATH)
        self._lock = asyncio.Lock()
        self._data: Optional[Dict[str, Any]] = None
    
    async def load_data(self) -> Dict[str, Any]:
        """Load data from JSON file with caching"""
        if self._data is None:
            async with self._lock:
                if self._data is None:  # Double-check pattern
                    try:
                        async with aiofiles.open(self.data_path, 'r', encoding='utf-8') as f:
                            content = await f.read()
                            self._data = json.loads(content)
                    except FileNotFoundError:
                        self._data = {
                            "users": [], "reels": [], "places": [], "checkins": [],
                            "posts": [], "comments": [], "events": [], "bookings": [], "trips": []
                        }
                        await self.save_data()
        return self._data
    
    async def save_data(self) -> None:
        """Save data to JSON file"""
        async with self._lock:
            if self._data is not None:
                # Ensure directory exists
                self.data_path.parent.mkdir(parents=True, exist_ok=True)
                
                async with aiofiles.open(self.data_path, 'w', encoding='utf-8') as f:
                    await f.write(json.dumps(self._data, indent=2, ensure_ascii=False))
    
    async def get_collection(self, collection_name: str) -> List[Dict[str, Any]]:
        """Get all items from a collection"""
        data = await self.load_data()
        return data.get(collection_name, [])
    
    async def get_item(self, collection_name: str, item_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific item by ID"""
        items = await self.get_collection(collection_name)
        return next((item for item in items if item.get("id") == item_id), None)
    
    async def add_item(self, collection_name: str, item: Dict[str, Any]) -> Dict[str, Any]:
        """Add new item to collection"""
        data = await self.load_data()
        if collection_name not in data:
            data[collection_name] = []
        
        data[collection_name].append(item)
        await self.save_data()
        return item
    
    async def update_item(self, collection_name: str, item_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing item"""
        data = await self.load_data()
        items = data.get(collection_name, [])
        
        for i, item in enumerate(items):
            if item.get("id") == item_id:
                items[i].update(updates)
                await self.save_data()
                return items[i]
        return None
    
    async def delete_item(self, collection_name: str, item_id: str) -> bool:
        """Delete an item from collection"""
        data = await self.load_data()
        items = data.get(collection_name, [])
        
        for i, item in enumerate(items):
            if item.get("id") == item_id:
                del items[i]
                await self.save_data()
                return True
        return False
    
    async def filter_items(self, collection_name: str, **filters) -> List[Dict[str, Any]]:
        """Filter items by criteria"""
        items = await self.get_collection(collection_name)
        
        filtered = []
        for item in items:
            match = True
            for key, value in filters.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            if match:
                filtered.append(item)
        
        return filtered

# Global instance
json_store = JSONStore()
