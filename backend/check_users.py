"""
Check room ownership and user details
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.quizzify_db

async def check_users_and_rooms():
    """Check all users and rooms"""
    
    print("👥 All users in database:")
    users = await db.users.find({}).to_list(length=100)
    
    for user in users:
        print(f"   - {user.get('username', 'Unknown')} | Email: {user.get('email', 'N/A')}")
    
    print("\n🏠 All rooms in database:")
    rooms = await db.rooms.find({}).to_list(length=100)
    
    if len(rooms) == 0:
        print("   No rooms found!")
        return
    
    for room in rooms:
        host_email = room.get("host_email", "Unknown")
        room_code = room.get("room_code", "N/A")
        title = room.get("title", "Untitled")
        status = room.get("status", "unknown")
        participants = room.get("participants", [])
        
        print(f"\n📌 Room: {title}")
        print(f"   Code: {room_code}")
        print(f"   Status: {status}")
        print(f"   Host Email: {host_email}")
        print(f"   Participants: {participants}")

async def main():
    try:
        await check_users_and_rooms()
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    print("=" * 60)
    print("User and Room Check")
    print("=" * 60)
    print()
    
    asyncio.run(main())
