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
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1a1f2e] to-[#252b3b] text-white border-b border-gray-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-white hover:text-cyan-400 text-base font-bold hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft className="h-6 w-6" />
              <span>Back to Dashboard</span>
            </button>

            <Link to="/create-room" className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-2xl font-black hover:scale-105 transition-all duration-200 flex items-center gap-2 text-base shadow-lg hover:shadow-cyan-500/30">
              <Plus className="h-6 w-6" />
              Create Room
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Join with Code */}
        <div className="bg-[#1a1f2e] rounded-2xl border border-gray-800 p-10 max-w-3xl mx-auto mb-12 shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
              <KeyRound className="h-8 w-8 text-white" />
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
              className="flex-1 px-6 py-5 bg-[#252b3b] border-2 border-gray-700 rounded-2xl uppercase tracking-widest text-2xl font-black text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 shadow-lg placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={joining || joinCode.length !== 6}
              className="px-8 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-2xl font-black text-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3 shadow-lg hover:shadow-cyan-500/30 border-2 border-cyan-500"
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
            <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* My Rooms */}
            {myRooms.length > 0 && (
              <div className="mb-16">
                <h2 className="text-4xl font-black text-white mb-8">Your Rooms</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myRooms.map((room) => (
                    <div
                      key={room.id}
                      className="bg-[#1a1f2e] border-2 border-gray-800 rounded-2xl p-8 hover:border-cyan-500 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-[1.02]"
                      onClick={() => navigate(`/room/${room.id}`)}
                    >
                      <div className="flex items-start justify-between mb-5">
                        <h3 className="text-2xl font-black text-white">
                          {room.title}
                        </h3>
                        <span
                          className={`px-4 py-2 rounded-xl text-sm font-black shadow-lg ${
                            room.status === 'waiting'
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                              : room.status === 'active'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                              : 'bg-gray-700 text-gray-400'
                          }`}
                        >
                          {room.status}
                        </span>
                      </div>

                      {room.description && (
                        <p className="text-base text-gray-400 mb-5 line-clamp-2 font-semibold">
                          {room.description}
                        </p>
                      )}

                      <div className="space-y-3 text-base text-gray-300 font-semibold">
                        <div className="flex items-center gap-3 bg-[#252b3b] p-3 rounded-xl border border-gray-700">
                          <Users className="h-5 w-5 text-cyan-400" />
                          <span>{room.participants?.length || 0} people</span>
                        </div>
                        <div className="flex items-center gap-3 bg-[#252b3b] p-3 rounded-xl border border-gray-700">
                          <Clock className="h-5 w-5 text-blue-400" />
                          <span>
                            {new Date(room.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t-2 border-gray-800 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 rounded-2xl border border-cyan-500/30">
                        <p className="text-sm text-gray-400 mb-2 font-bold">Room Code</p>
                        <p className="text-3xl font-black text-white tracking-widest">
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
              <h2 className="text-4xl font-black text-white mb-8">
                All Rooms
              </h2>

              {rooms.length === 0 ? (
                <div className="bg-[#1a1f2e] border-2 border-gray-800 rounded-2xl text-center py-20 shadow-xl">
                  <Users className="h-20 w-20 text-gray-600 mx-auto mb-6" />
                  <h3 className="text-3xl font-black text-white mb-3">
                    No rooms yet
                  </h3>
                  <p className="text-gray-400 mb-8 font-semibold text-lg">
                    Be the first to create one
                  </p>
                  <Link to="/create-room" className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-2xl font-black hover:scale-105 transition-all duration-200 inline-flex items-center gap-3 shadow-lg hover:shadow-cyan-500/30 border-2 border-cyan-500">
                    <Plus className="h-6 w-6" />
                    Create Room
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rooms.map((room) => (
                    <div key={room.id} className="bg-[#1a1f2e] border-2 border-gray-800 rounded-2xl p-8 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02]">
                      <div className="flex items-start justify-between mb-5">
                        <h3 className="text-2xl font-black text-white">
                          {room.title}
                        </h3>
                        <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-black shadow-lg">
                          Open
                        </span>
                      </div>

                      {room.description && (
                        <p className="text-base text-gray-400 mb-5 line-clamp-2 font-semibold">
                          {room.description}
                        </p>
                      )}

                      <div className="space-y-3 text-base text-gray-300 mb-6 font-semibold">
                        <div className="flex items-center gap-3 bg-[#252b3b] p-3 rounded-xl border border-gray-700">
                          <User className="h-5 w-5 text-purple-400" />
                          <span>{room.host_username || 'Someone'}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-[#252b3b] p-3 rounded-xl border border-gray-700">
                          <Users className="h-5 w-5 text-cyan-400" />
                          <span>
                            {room.participants?.length || 0}/{room.max_participants} people
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleJoinRoom(room.room_code)}
                        className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-2xl font-black hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-cyan-500/30 border-2 border-cyan-500 text-lg"
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


