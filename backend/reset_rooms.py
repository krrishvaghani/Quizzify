"""
Reset all active rooms back to waiting status
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.quizzify_db

async def reset_rooms():
    """Reset all active rooms to waiting"""
    
    print("🔄 Resetting active rooms to waiting status...\n")
    
    result = await db.rooms.update_many(
        {"status": "active"},
        {"$set": {"status": "waiting", "started_at": None}}
    )
    
    print(f"✅ Reset {result.modified_count} rooms from 'active' to 'waiting'")
    
    # Show current status
    print("\n📊 Current room statuses:")
    rooms = await db.rooms.find({}).to_list(length=100)
    
    for room in rooms:
        status = room.get("status", "unknown")
        title = room.get("title", "Untitled")
        code = room.get("room_code", "N/A")
        print(f"   - {title} ({code}): {status}")

async def main():
    try:
        await reset_rooms()
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Reset Room Status Script")
    print("=" * 60)
    print()
    
    asyncio.run(main())
