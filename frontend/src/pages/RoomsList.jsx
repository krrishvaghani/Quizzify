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
} from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>

            <Link to="/create-room" className="btn-primary flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Room
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Join with Code */}
        <div className="card max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <KeyRound className="h-6 w-6 text-purple-600" />
            Join with Room Code
          </h2>
          <form onSubmit={handleJoinWithCode} className="flex gap-3">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit room code"
              maxLength={6}
              className="input-field flex-1 uppercase tracking-wider text-xl"
            />
            <button
              type="submit"
              disabled={joining || joinCode.length !== 6}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* My Rooms */}
            {myRooms.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Rooms</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myRooms.map((room) => (
                    <div
                      key={room.id}
                      className="card hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => navigate(`/room/${room.id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {room.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            room.status === 'waiting'
                              ? 'bg-yellow-100 text-yellow-800'
                              : room.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
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

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{room.participants?.length || 0} participants</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(room.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-gray-500">Room Code</p>
                        <p className="text-lg font-bold text-purple-600 tracking-wider">
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Available Rooms
              </h2>

              {rooms.length === 0 ? (
                <div className="card text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No rooms available
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Create a room to get started
                  </p>
                  <Link to="/create-room" className="btn-primary inline-block">
                    Create Room
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room) => (
                    <div key={room.id} className="card hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {room.title}
                        </h3>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          Open
                        </span>
                      </div>

                      {room.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {room.description}
                        </p>
                      )}

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Host: {room.host_username || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>
                            {room.participants?.length || 0}/{room.max_participants} joined
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleJoinRoom(room.room_code)}
                        className="w-full btn-primary flex items-center justify-center gap-2"
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
