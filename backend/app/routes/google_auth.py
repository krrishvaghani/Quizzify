from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import jwt
import requests
from typing import Optional

from app.core.security import create_access_token
from app.repositories.user_repository import UserRepository
from app.models.user import UserDB, UserStats

router = APIRouter()


class GoogleAuthRequest(BaseModel):
    credential: str


class GoogleUserInfo(BaseModel):
    email: str
    name: str
    given_name: str
    family_name: str
    picture: Optional[str] = None


@router.post("/google")
async def google_auth(auth_request: GoogleAuthRequest):
    """Authenticate user with Google OAuth"""
    try:
        # Decode Google JWT token
        decoded_token = jwt.decode(
            auth_request.credential,
            options={"verify_signature": False}  # Google's signature verification
        )
        
        # Extract user info
        email = decoded_token.get("email")
        name = decoded_token.get("name", "")
        given_name = decoded_token.get("given_name", "")
        family_name = decoded_token.get("family_name", "")
        picture = decoded_token.get("picture")
        
        if not email:
            raise HTTPException(status_code=400, detail="Invalid Google token")
        
        user_repo = UserRepository()
        
        # Check if user exists
        existing_user = await user_repo.get_user_by_email(email)
        
        if existing_user:
            # User exists, log them in
            user = existing_user
        else:
            # Create new user
            user = await user_repo.create_user_with_google(
                email=email,
                name=name,
                given_name=given_name,
                family_name=family_name,
                picture=picture
            )
        
        # Create access token
        access_token = create_access_token(data={"sub": str(user.id)})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "name": getattr(user, 'name', email.split('@')[0]),
                "picture": getattr(user, 'picture', None)
            }
        }
        
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid Google token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")


@router.get("/google/verify")
async def verify_google_token(token: str):
    """Verify Google token (for debugging)"""
    try:
        # Verify with Google's tokeninfo endpoint
        response = requests.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=400, detail="Invalid token")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token verification failed: {str(e)}")
