import json
import os
import uuid
from typing import Any, Dict, Optional


DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
USERS_FILE = os.path.join(DATA_DIR, "users.json")


def _ensure_data_dir() -> None:
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump({"users": []}, f)


async def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    _ensure_data_dir()
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    for user in data.get("users", []):
        if user.get("email") == email:
            return user
    return None


async def create_user(email: str, password_hash: str, username: Optional[str] = None) -> str:
    _ensure_data_dir()
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    user_id = str(uuid.uuid4())
    user = {"id": user_id, "email": email, "password_hash": password_hash, "username": username or email.split('@')[0]}
    data.setdefault("users", []).append(user)
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return user_id


