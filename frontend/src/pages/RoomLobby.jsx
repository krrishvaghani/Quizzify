import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { roomAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import {
  Users,
  Play,
  Copy,
  CheckCircle,
  Clock,
  Shuffle,
  RotateCw,
  Trophy,
  Eye,
  Loader2,
  ArrowLeft,
  UserCheck,
  Settings,
} from 'lucide-react'

export default function RoomLobby() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    fetchRoom()
    const interval = setInterval(fetchRoom, 3000) // Poll every 3 seconds
    return () => clearInterval(interval)
  }, [id])

  const fetchRoom = async () => {
    try {
      const data = await roomAPI.getRoom(id)
      setRoom(data)
      
      // If room started, redirect to quiz
      if (data.status === 'active' && data.quiz) {
        navigate(`/quiz/${data.quiz_id}`)
      }
    } catch (error) {
      console.error('Error fetching room:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.room_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleStart = async () => {
    setStarting(true)
    try {
      await roomAPI.startRoom(id)
      navigate(`/quiz/${room.quiz_id}`)
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to start room')
    } finally {
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Room not found</h2>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const isHost = room.host_email === user?.email

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Room Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Details Card */}
            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {room.title}
                  </h1>
                  {room.description && (
                    <p className="text-gray-600">{room.description}</p>
                  )}
                </div>
                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                  Waiting
                </span>
              </div>

              {/* Room Code */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Room Code
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-gray-900 tracking-wider">
                    {room.room_code}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    {copied ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <Copy className="h-6 w-6 text-gray-600" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Share this code with participants
                </p>
              </div>

              {/* Quiz Info */}
              {room.quiz && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Quiz Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">{room.quiz.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {room.quiz.num_questions} questions
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Participants Card */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="h-6 w-6 text-purple-600" />
                  Participants ({room.participants_details?.length || 0}/{room.max_participants})
                </h2>
              </div>

              <div className="space-y-2">
                {room.participants_details?.map((participant) => (
                  <div
                    key={participant.email}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {participant.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {participant.username}
                        {participant.email === room.host_email && (
                          <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            Host
                          </span>
                        )}
                      </p>
                      {participant.full_name && (
                        <p className="text-sm text-gray-500">{participant.full_name}</p>
                      )}
                    </div>
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                ))}
              </div>

              {room.participants_details?.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Waiting for participants to join...
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Settings & Actions */}
          <div className="space-y-6">
            {/* Room Settings Card */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                Room Settings
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
                    <Clock className="h-4 w-4" />
                    Timer
                  </span>
                  <span className={room.settings.enable_timer ? 'text-green-600 font-medium' : 'text-gray-400'}>
                    {room.settings.enable_timer ? `${room.settings.timer_duration}s` : 'Off'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
                    <Shuffle className="h-4 w-4" />
                    Shuffle Questions
                  </span>
                  <span className={room.settings.shuffle_questions ? 'text-green-600 font-medium' : 'text-gray-400'}>
                    {room.settings.shuffle_questions ? 'On' : 'Off'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
                    <RotateCw className="h-4 w-4" />
                    Shuffle Options
                  </span>
                  <span className={room.settings.shuffle_options ? 'text-green-600 font-medium' : 'text-gray-400'}>
                    {room.settings.shuffle_options ? 'On' : 'Off'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
                    <Trophy className="h-4 w-4" />
                    Attempts
                  </span>
                  <span className="text-purple-600 font-medium">
                    {room.settings.attempts_allowed}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-700">
                    <Eye className="h-4 w-4" />
                    Show Results
                  </span>
                  <span className={room.settings.show_results_immediately ? 'text-green-600 font-medium' : 'text-gray-400'}>
                    {room.settings.show_results_immediately ? 'Immediate' : 'Later'}
                  </span>
                </div>
              </div>
            </div>

            {/* Start Button (Host Only) */}
            {isHost && (
              <button
                onClick={handleStart}
                disabled={starting || room.participants_details?.length === 0}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {starting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Start Quiz
                  </>
                )}
              </button>
            )}

            {/* Waiting Message (Participants) */}
            {!isHost && (
              <div className="card bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
                <p className="text-center text-purple-900 font-medium">
                  Waiting for host to start the quiz...
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
