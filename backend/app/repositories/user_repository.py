from typing import Optional, List
from beanie import PydanticObjectId
from app.models.user import UserDB, UserStats, UserPerformance


class UserRepository:
    """Repository for user data operations"""
    
    @staticmethod
    async def create_user(email: str, password_hash: str) -> UserDB:
        """Create a new user"""
        user = UserDB(
            email=email,
            password_hash=password_hash,
            stats=UserStats(),
            auth_provider="email"
        )
        await user.insert()
        return user
    
    @staticmethod
    async def create_user_with_google(
        email: str, 
        name: str = None, 
        given_name: str = None, 
        family_name: str = None,
        picture: str = None,
        google_id: str = None
    ) -> UserDB:
        """Create a new user with Google OAuth"""
        user = UserDB(
            email=email,
            name=name,
            given_name=given_name,
            family_name=family_name,
            picture=picture,
            google_id=google_id,
            stats=UserStats(),
            auth_provider="google"
        )
        await user.insert()
        return user
    
    @staticmethod
    async def get_user_by_email(email: str) -> Optional[UserDB]:
        """Get user by email"""
        return await UserDB.find_one(UserDB.email == email)
    
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[UserDB]:
        """Get user by ID"""
        try:
            return await UserDB.get(PydanticObjectId(user_id))
        except Exception:
            return None
    
    @staticmethod
    async def update_user_stats(user_id: str, stats: UserStats) -> bool:
        """Update user statistics"""
        try:
            user = await UserDB.get(PydanticObjectId(user_id))
            if user:
                user.stats = stats
                await user.save()
                return True
            return False
        except Exception:
            return False
    
    @staticmethod
    async def update_user_performance(user_id: str, performance: UserPerformance) -> bool:
        """Update user performance for a specific topic"""
        try:
            user = await UserDB.get(PydanticObjectId(user_id))
            if user:
                topic_key = f"{performance.topic.value}_{performance.difficulty.value}"
                user.stats.performance_by_topic[topic_key] = performance
                await user.save()
                return True
            return False
        except Exception:
            return False
    
    @staticmethod
    async def get_all_users() -> List[UserDB]:
        """Get all users (admin function)"""
        return await UserDB.find_all().to_list()
    
    @staticmethod
    async def delete_user(user_id: str) -> bool:
        """Delete a user"""
        try:
            user = await UserDB.get(PydanticObjectId(user_id))
            if user:
                await user.delete()
                return True
            return False
        except Exception:
            return False
