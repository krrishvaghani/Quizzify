"""
Check which users created which rooms
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.quizzify_db

async def check_rooms():
    """Check all rooms and their hosts"""
    
    print("🏠 Checking all rooms in database...\n")
    
    rooms = await db.rooms.find({}).to_list(length=100)
    
    if len(rooms) == 0:
        print("No rooms found!")
        return
    
    print(f"Found {len(rooms)} rooms:\n")
    
    for room in rooms:
        host_email = room.get("host_email", "Unknown")
        room_code = room.get("room_code", "N/A")
        title = room.get("title", "Untitled")
        status = room.get("status", "unknown")
        participants = room.get("participants", [])
        
        print(f"📌 Room: {title}")
        print(f"   Code: {room_code}")
        print(f"   Status: {status}")
        print(f"   Host: {host_email}")
        print(f"   Participants: {len(participants)} - {participants}")
        print()

async def check_users():
    """Check all users"""
    
    print("\n👥 All users in database:")
    users = await db.users.find({}).to_list(length=100)
    
    for user in users:
        print(f"   - {user.get('username', 'Unknown')} ({user.get('email', 'N/A')})")

async def main():
    try:
        await check_rooms()
        await check_users()
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Room Ownership Check")
    print("=" * 60)
    print()
    
    asyncio.run(main())
