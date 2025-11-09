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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-black via-gray-900 to-black text-white border-b-4 border-gray-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-white hover:text-gray-300 text-base font-bold hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft className="h-6 w-6" />
              <span>Back to Dashboard</span>
            </button>

            <Link to="/create-room" className="px-6 py-3 bg-white text-black rounded-2xl font-black hover:scale-105 transition-all duration-200 flex items-center gap-2 text-base shadow-xl">
              <Plus className="h-6 w-6" />
              Create Room
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Join with Code */}
        <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl border-2 border-gray-200 p-10 max-w-3xl mx-auto mb-12 shadow-2xl">
          <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
              <KeyRound className="h-8 w-8 text-gray-900" />
            </div>
            Got a room code?
          </h2>
          <form onSubmit={handleJoinWithCode} className="flex gap-4">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ABCD12"
              maxLength={6}
              className="flex-1 px-6 py-5 border-3 border-gray-300 rounded-2xl uppercase tracking-widest text-2xl font-black focus:outline-none focus:ring-4 focus:ring-gray-200 focus:border-gray-900 transition-all duration-200 shadow-lg"
            />
            <button
              type="submit"
              disabled={joining || joinCode.length !== 6}
              className="px-8 py-5 bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-2xl font-black text-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3 shadow-2xl border-2 border-gray-800"
            >
              {joining ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <LogIn className="h-6 w-6" />
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
              <div className="mb-16">
                <h2 className="text-4xl font-black text-gray-900 mb-8">Your Rooms</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myRooms.map((room) => (
                    <div
                      key={room.id}
                      className="bg-gradient-to-br from-white via-gray-50 to-white border-2 border-gray-200 rounded-3xl p-8 hover:border-gray-900 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:scale-[1.02]"
                      onClick={() => navigate(`/room/${room.id}`)}
                    >
                      <div className="flex items-start justify-between mb-5">
                        <h3 className="text-2xl font-black text-gray-900">
                          {room.title}
                        </h3>
                        <span
                          className={`px-4 py-2 rounded-xl text-sm font-black shadow-lg ${
                            room.status === 'waiting'
                              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-gray-900'
                              : room.status === 'active'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                              : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600'
                          }`}
                        >
                          {room.status}
                        </span>
                      </div>

                      {room.description && (
                        <p className="text-base text-gray-600 mb-5 line-clamp-2 font-semibold">
                          {room.description}
                        </p>
                      )}

                      <div className="space-y-3 text-base text-gray-700 font-semibold">
                        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-xl">
                          <Users className="h-5 w-5 text-gray-900" />
                          <span>{room.participants?.length || 0} people</span>
                        </div>
                        <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-xl">
                          <Clock className="h-5 w-5 text-gray-900" />
                          <span>
                            {new Date(room.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-2xl">
                        <p className="text-sm text-gray-600 mb-2 font-bold">Room Code</p>
                        <p className="text-3xl font-black text-gray-900 tracking-widest">
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
              <h2 className="text-4xl font-black text-gray-900 mb-8">
                All Rooms
              </h2>

              {rooms.length === 0 ? (
                <div className="bg-gradient-to-br from-white via-gray-50 to-white border-2 border-gray-200 rounded-3xl text-center py-20 shadow-xl">
                  <Users className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-3xl font-black text-gray-900 mb-3">
                    No rooms yet
                  </h3>
                  <p className="text-gray-600 mb-8 font-semibold text-lg">
                    Be the first to create one
                  </p>
                  <Link to="/create-room" className="px-8 py-4 bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-2xl font-black hover:scale-105 transition-all duration-200 inline-flex items-center gap-3 shadow-2xl border-2 border-gray-800">
                    <Plus className="h-6 w-6" />
                    Create Room
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rooms.map((room) => (
                    <div key={room.id} className="bg-gradient-to-br from-white via-gray-50 to-white border-2 border-gray-200 rounded-3xl p-8 hover:border-gray-900 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                      <div className="flex items-start justify-between mb-5">
                        <h3 className="text-2xl font-black text-gray-900">
                          {room.title}
                        </h3>
                        <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-black shadow-lg">
                          Open
                        </span>
                      </div>

                      {room.description && (
                        <p className="text-base text-gray-600 mb-5 line-clamp-2 font-semibold">
                          {room.description}
                        </p>
                      )}

                      <div className="space-y-3 text-base text-gray-700 mb-6 font-semibold">
                        <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl">
                          <User className="h-5 w-5 text-gray-900" />
                          <span>{room.host_username || 'Someone'}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-xl">
                          <Users className="h-5 w-5 text-gray-900" />
                          <span>
                            {room.participants?.length || 0}/{room.max_participants} people
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleJoinRoom(room.room_code)}
                        className="w-full px-6 py-4 bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-2xl font-black hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 shadow-xl border-2 border-gray-800 text-lg"
                      >
                        <LogIn className="h-6 w-6" />
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
