"""
Reset specific room back to waiting status
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.quizzify_db

async def reset_room(room_code):
    """Reset a specific room to waiting status"""
    
    print(f"🔄 Resetting room {room_code} to waiting status...\n")
    
    room = await db.rooms.find_one({"room_code": room_code})
    
    if not room:
        print(f"❌ Room with code {room_code} not found!")
        return
    
    print(f"📌 Found room: {room.get('title')}")
    print(f"   Current status: {room.get('status')}")
    print(f"   Host: {room.get('host_email')}")
    
    result = await db.rooms.update_one(
        {"room_code": room_code},
        {"$set": {"status": "waiting", "started_at": None}}
    )
    
    if result.modified_count > 0:
        print(f"\n✅ Room reset to 'waiting' status successfully!")
    else:
        print(f"\n⚠️  Room was already in waiting status")

async def main():
    try:
        await reset_room("THPLGH")  # The room code from the database
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Reset Specific Room Script")
    print("=" * 60)
    print()
    
    asyncio.run(main())
