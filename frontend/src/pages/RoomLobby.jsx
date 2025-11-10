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
  Medal,
  Timer,
  Target,
  TrendingUp,
} from 'lucide-react'

export default function RoomLobby() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [starting, setStarting] = useState(false)
  const [activeTab, setActiveTab] = useState('participants')
  const [leaderboard, setLeaderboard] = useState(null)
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false)

  useEffect(() => {
    fetchRoom()
    fetchLeaderboard()
    const interval = setInterval(() => {
      fetchRoom()
      if (activeTab === 'leaderboard') {
        fetchLeaderboard()
      }
    }, 3000) // Poll every 3 seconds
    return () => clearInterval(interval)
  }, [id, activeTab])

  const fetchRoom = async () => {
    try {
      const data = await roomAPI.getRoom(id)
      setRoom(data)
      
      // If room started, redirect to quiz (but NOT if user is the host)
      const isHost = data.host_email === user?.email
      if (data.status === 'active' && data.quiz && !isHost) {
        navigate(`/quiz/${data.quiz_id}/start`)
      }
    } catch (error) {
      console.error('Error fetching room:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLeaderboard = async () => {
    if (loadingLeaderboard) return
    setLoadingLeaderboard(true)
    try {
      const data = await roomAPI.getLeaderboard(id)
      setLeaderboard(data)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoadingLeaderboard(false)
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
      // Host stays on lobby page to view leaderboard
      // Don't navigate away - just refresh room data
      await fetchRoom()
      setActiveTab('leaderboard') // Switch to leaderboard tab
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to start room')
    } finally {
      setStarting(false)
    }
  }

  const handleComplete = async () => {
    if (!window.confirm('Are you sure you want to end this quiz? Participants will no longer be able to submit.')) {
      return
    }
    
    setStarting(true)
    try {
      await roomAPI.completeRoom(id)
      await fetchRoom()
      alert('Quiz ended successfully!')
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to end quiz')
    } finally {
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1419]">
        <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1419]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Room not found</h2>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const isHost = room.host_email === user?.email

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header */}
      <header className="bg-[#1a1f2e] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-white transition-colors"
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
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {room.title}
                  </h1>
                  {room.description && (
                    <p className="text-gray-600">{room.description}</p>
                  )}
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  room.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                  room.status === 'active' ? 'bg-green-100 text-green-800' :
                  'bg-[#1a1f2e] text-gray-800'
                }`}>
                  {room.status === 'waiting' ? 'Waiting' : room.status === 'active' ? 'Active' : 'Completed'}
                </span>
              </div>

              {/* Room Code */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Room Code
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-white tracking-wider">
                    {room.room_code}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-3 bg-[#1a1f2e] rounded-lg hover:bg-[#0f1419] transition-colors shadow-sm"
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
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Quiz Information
                  </h3>
                  <div className="bg-[#0f1419] rounded-lg p-4">
                    <p className="font-medium text-white">{room.quiz.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {room.quiz.num_questions} questions
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Participants & Leaderboard Card */}
            <div className="card">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab('participants')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'participants'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  Participants ({room.participants_details?.filter(p => p.email !== room.host_email).length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'leaderboard'
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Trophy className="h-5 w-5" />
                  Leaderboard
                </button>
              </div>

              {/* Participants Tab */}
              {activeTab === 'participants' && (
                <div className="space-y-2">
                  {room.participants_details?.filter(p => p.email !== room.host_email).map((participant) => (
                    <div
                      key={participant.email}
                      className="flex items-center gap-3 p-3 bg-[#0f1419] rounded-lg hover:bg-[#1a1f2e] transition-colors"
                    >
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {participant.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">
                          {participant.username}
                        </p>
                        {participant.full_name && (
                          <p className="text-sm text-gray-500">{participant.full_name}</p>
                        )}
                      </div>
                      <UserCheck className="h-5 w-5 text-green-600" />
                    </div>
                  ))}

                  {room.participants_details?.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      Waiting for participants to join...
                    </p>
                  )}
                </div>
              )}

              {/* Leaderboard Tab */}
              {activeTab === 'leaderboard' && (
                <div>
                  {loadingLeaderboard && !leaderboard ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                    </div>
                  ) : leaderboard && leaderboard.leaderboard.length > 0 ? (
                    <div className="space-y-3">
                      {leaderboard.leaderboard.map((entry, idx) => {
                        const getRankIcon = (rank) => {
                          if (rank === 1) return <Medal className="h-6 w-6 text-yellow-500" />
                          if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
                          if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />
                          return <span className="text-gray-500 font-bold text-lg">{rank}</span>
                        }

                        return (
                          <div
                            key={entry.email}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              entry.has_submitted
                                ? idx === 0
                                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
                                  : 'bg-[#1a1f2e] border-gray-200 hover:border-purple-300'
                                : 'bg-[#0f1419] border-gray-200 opacity-75'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              {/* Rank */}
                              <div className="w-10 flex justify-center">
                                {getRankIcon(entry.rank)}
                              </div>

                              {/* User Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-white truncate">
                                    {entry.username}
                                  </p>
                                  {entry.email === user?.email && (
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                      You
                                    </span>
                                  )}
                                </div>
                                {entry.has_submitted ? (
                                  <div className="flex items-center gap-3 mt-1 text-sm">
                                    <span className="flex items-center gap-1 text-gray-600">
                                      <Target className="h-3.5 w-3.5" />
                                      {entry.correct_answers}/{entry.total_questions}
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-600">
                                      <Timer className="h-3.5 w-3.5" />
                                      {entry.time_taken}s
                                    </span>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 mt-1">Not submitted yet</p>
                                )}
                              </div>

                              {/* Score */}
                              {entry.has_submitted && (
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-white">
                                    {entry.score}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {entry.percentage}%
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}

                      {/* Stats Summary */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Completed</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {leaderboard.leaderboard.filter(e => e.has_submitted).length}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-[#1a1f2e] rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">In Progress</p>
                            <p className="text-2xl font-bold text-gray-700">
                              {leaderboard.leaderboard.filter(e => !e.has_submitted).length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No quiz attempts yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Scores will appear here once participants start the quiz
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Settings & Actions */}
          <div className="space-y-6">
            {/* Room Settings Card */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
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

            {/* Control Buttons (Host Only) */}
            {isHost && (
              <>
                {room.status === 'waiting' ? (
                  <button
                    onClick={handleStart}
                    disabled={starting || room.participants_details?.filter(p => p.email !== room.host_email).length === 0}
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
                ) : room.status === 'active' ? (
                  <button
                    onClick={handleComplete}
                    disabled={starting}
                    className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {starting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Ending...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        End Quiz
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full bg-[#1a1f2e] text-gray-600 py-3 px-6 rounded-lg font-semibold text-center">
                    Quiz Completed
                  </div>
                )}
              </>
            )}

            {/* Status Message (Participants) */}
            {!isHost && (
              <div className={`card border-2 ${
                room.status === 'waiting' ? 'bg-yellow-50 border-yellow-200' :
                room.status === 'active' ? 'bg-green-50 border-green-200' :
                'bg-[#1a1f2e] border-gray-200'
              }`}>
                <p className={`text-center font-medium ${
                  room.status === 'waiting' ? 'text-yellow-900' :
                  room.status === 'active' ? 'text-green-900' :
                  'text-white'
                }`}>
                  {room.status === 'waiting' ? 'Waiting for host to start the quiz...' :
                   room.status === 'active' ? 'Quiz is active! Take the quiz now.' :
                   'Quiz has ended. Check the leaderboard for results.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}


