"""
Delete all rooms from the database
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.quizzify_db

async def delete_all_rooms():
    """Delete all rooms from the database"""
    
    print("🗑️  Deleting all rooms...\n")
    
    # Count rooms before deletion
    count_before = await db.rooms.count_documents({})
    print(f"📊 Found {count_before} rooms in database")
    
    if count_before == 0:
        print("✅ No rooms to delete!")
        return
    
    # Delete all rooms
    result = await db.rooms.delete_many({})
    
    print(f"✅ Deleted {result.deleted_count} rooms successfully!")
    
    # Verify deletion
    count_after = await db.rooms.count_documents({})
    print(f"📊 Remaining rooms: {count_after}")

async def main():
    try:
        await delete_all_rooms()
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Delete All Rooms Script")
    print("=" * 60)
    print()
    
    asyncio.run(main())
