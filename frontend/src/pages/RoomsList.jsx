import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { roomAPI } from '../utils/api'
import {
  Users,
  Plus,
  LogIn,
  ArrowLeft,
  Loader2,
  Clock,
  User,
  KeyRound,
  Home,
  BarChart3,
  PlusCircle,
} from 'lucide-react'
import AnimatedTabs from '../components/AnimatedTabs'

export default function RoomsList() {
  const [rooms, setRooms] = useState([])
  const [myRooms, setMyRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [joinCode, setJoinCode] = useState('')
  const [joining, setJoining] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const [roomsData, myRoomsData] = await Promise.all([
        roomAPI.getRooms(),
        roomAPI.getMyRooms(),
      ])
      setRooms(roomsData.rooms || [])
      setMyRooms(myRoomsData.rooms || [])
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinWithCode = async (e) => {
    e.preventDefault()
    if (!joinCode.trim()) return

    setJoining(true)
    try {
      const result = await roomAPI.joinRoom(joinCode.toUpperCase())
      navigate(`/room/${result.room_id}`)
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to join room')
    } finally {
      setJoining(false)
    }
  }

  const handleJoinRoom = async (roomCode) => {
    try {
      const result = await roomAPI.joinRoom(roomCode)
      navigate(`/room/${result.room_id}`)
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to join room')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-white hover:text-gray-300 text-base"
            >
              <ArrowLeft className="h-6 w-6" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-6">
              <AnimatedTabs
                tabs={[
                  { label: 'Dashboard', value: 'dashboard' },
                  { label: 'Analytics', value: 'analytics' },
                  { label: 'Create Quiz', value: 'generate' },
                  { label: 'Room', value: 'create-room' },
                  { label: 'Rooms', value: 'rooms' }
                ]}
                variant="underline"
                activeTab="rooms"
                isDark={true}
                onTabChange={(value) => navigate(`/${value}`)}
              />

              <Link to="/create-room" className="px-5 py-2.5 bg-white text-black rounded-lg font-medium hover:bg-gray-100 flex items-center gap-2 text-base ml-4">
                <Plus className="h-5 w-5" />
                Create Room
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Join with Code */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-7 max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-black mb-5 flex items-center gap-3">
            <KeyRound className="h-6 w-6" />
            Got a room code?
          </h2>
          <form onSubmit={handleJoinWithCode} className="flex gap-4">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ABCD12"
              maxLength={6}
              className="flex-1 px-5 py-4 border-2 border-gray-300 rounded-xl uppercase tracking-widest text-xl font-bold focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <button
              type="submit"
              disabled={joining || joinCode.length !== 6}
              className="px-7 py-4 bg-black text-white rounded-xl font-semibold text-base hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {joining ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Join
                </>
              )}
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-10 w-10 text-black animate-spin" />
          </div>
        ) : (
          <>
            {/* My Rooms */}
            {myRooms.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-black mb-7">Your Rooms</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {myRooms.map((room) => (
                    <div
                      key={room.id}
                      className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors cursor-pointer hover:shadow-lg"
                      onClick={() => navigate(`/room/${room.id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-bold text-black">
                          {room.title}
                        </h3>
                        <span
                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                            room.status === 'waiting'
                              ? 'bg-gray-100 text-gray-700'
                              : room.status === 'active'
                              ? 'bg-black text-white'
                              : 'bg-gray-50 text-gray-500'
                          }`}
                        >
                          {room.status}
                        </span>
                      </div>

                      {room.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {room.description}
                        </p>
                      )}

                      <div className="space-y-2.5 text-sm text-gray-600">
                        <div className="flex items-center gap-2.5">
                          <Users className="h-4 w-4" />
                          <span>{room.participants?.length || 0} people</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(room.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 pt-5 border-t-2 border-gray-200">
                        <p className="text-xs text-gray-500 mb-1.5">Room Code</p>
                        <p className="text-xl font-bold text-black tracking-widest">
                          {room.room_code}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Rooms */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-7">
                All Rooms
              </h2>

              {rooms.length === 0 ? (
                <div className="bg-white border-2 border-gray-200 rounded-xl text-center py-14">
                  <Users className="h-14 w-14 text-gray-300 mx-auto mb-5" />
                  <h3 className="text-xl font-bold text-black mb-2">
                    No rooms yet
                  </h3>
                  <p className="text-gray-500 mb-5">
                    Be the first to create one
                  </p>
                  <Link to="/create-room" className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 inline-block">
                    Create Room
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {rooms.map((room) => (
                    <div key={room.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors hover:shadow-lg">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-bold text-black">
                          {room.title}
                        </h3>
                        <span className="px-3 py-1.5 bg-black text-white rounded-lg text-sm font-semibold">
                          Open
                        </span>
                      </div>

                      {room.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {room.description}
                        </p>
                      )}

                      <div className="space-y-2.5 text-sm text-gray-600 mb-5">
                        <div className="flex items-center gap-2.5">
                          <User className="h-4 w-4" />
                          <span>{room.host_username || 'Someone'}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Users className="h-4 w-4" />
                          <span>
                            {room.participants?.length || 0}/{room.max_participants} people
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleJoinRoom(room.room_code)}
                        className="w-full px-5 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 flex items-center justify-center gap-2 text-base"
                      >
                        <LogIn className="h-5 w-5" />
                        Join Room
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
