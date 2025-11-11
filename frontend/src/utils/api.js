import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/register', userData)
    return response.data
  },
  verifyOtp: async (data) => {
    const response = await api.post('/verify-otp', data)
    return response.data
  },
  resendOtp: async (data) => {
    const response = await api.post('/resend-otp', data)
    return response.data
  },
  login: async (credentials) => {
    const response = await api.post('/login', credentials)
    return response.data
  },
  getMe: async () => {
    const response = await api.get('/me')
    return response.data
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/me', profileData)
    return response.data
  },
  updatePassword: async (passwordData) => {
    const response = await api.put('/me/password', passwordData)
    return response.data
  },
}

export const quizAPI = {
  uploadAndGenerate: async (file, numQuestions, difficulty, quizName = '') => {
    const formData = new FormData()
    formData.append('file', file)
    
    const params = new URLSearchParams({
      num_questions: numQuestions,
      difficulty: difficulty,
    })
    
    if (quizName.trim()) {
      params.append('quiz_name', quizName.trim())
    }
    
    const response = await api.post(
      `/upload-and-generate?${params.toString()}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },
  createManualQuiz: async (quizData) => {
    const response = await api.post('/quizzes/create-manual', quizData)
    return response.data
  },
  getQuizzes: async () => {
    const response = await api.get('/quizzes')
    return response.data
  },
  getAllPublicQuizzes: async () => {
    const response = await api.get('/quizzes/all/public')
    return response.data
  },
  getQuiz: async (id) => {
    const response = await api.get(`/quizzes/${id}`)
    return response.data
  },
  updateQuiz: async (id, quizData) => {
    const response = await api.put(`/quizzes/${id}`, quizData)
    return response.data
  },
  deleteQuiz: async (id) => {
    const response = await api.delete(`/quizzes/${id}`)
    return response.data
  },
  getPublicQuiz: async (id) => {
    const response = await api.get(`/public/quiz/${id}`)
    return response.data
  },
  submitQuizPublic: async (submission) => {
    const response = await api.post('/public/quiz/submit', submission)
    return response.data
  },
  getAttemptDetails: async (attemptId) => {
    const response = await api.get(`/public/attempt/${attemptId}`)
    return response.data
  },
  getMyAttempts: async () => {
    const response = await api.get('/my-attempts')
    return response.data
  },
  // Export/Share endpoints
  getQuizAttempts: async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}/attempts`)
    return response.data
  },
  exportCSV: async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}/export/csv`, {
      responseType: 'blob'
    })
    return response.data
  },
  exportPDF: async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}/export/pdf`, {
      responseType: 'blob'
    })
    return response.data
  },
  updateShareSettings: async (quizId, settings) => {
    const response = await api.put(`/quizzes/${quizId}/share-settings`, settings)
    return response.data
  },
  updateTimerSettings: async (quizId, settings) => {
    const response = await api.put(`/quizzes/${quizId}/timer-settings`, settings)
    return response.data
  },
  verifyQuizAccess: async (quizId, password) => {
    const response = await api.post(`/public/quiz/${quizId}/verify-access`, 
      password ? { password } : {}
    )
    return response.data
  },
}

export const roomAPI = {
  createRoom: async (roomData) => {
    const response = await api.post('/rooms/create', {
      quiz_id: roomData.quiz_id,
      title: roomData.title,
      description: roomData.description,
      settings: roomData.settings,
    })
    return response.data
  },
  getRooms: async () => {
    const response = await api.get('/rooms')
    return response.data
  },
  getMyRooms: async () => {
    const response = await api.get('/rooms/my-rooms')
    return response.data
  },
  getRoom: async (id) => {
    const response = await api.get(`/rooms/${id}`)
    return response.data
  },
  joinRoom: async (roomCode) => {
    const response = await api.post('/rooms/join', { room_code: roomCode })
    return response.data
  },
  startRoom: async (id) => {
    const response = await api.post(`/rooms/${id}/start`)
    return response.data
  },
  completeRoom: async (id) => {
    const response = await api.post(`/rooms/${id}/complete`)
    return response.data
  },
  deleteRoom: async (id) => {
    const response = await api.delete(`/rooms/${id}`)
    return response.data
  },
  getLeaderboard: async (id) => {
    const response = await api.get(`/rooms/${id}/leaderboard`)
    return response.data
  },
}

export default api
