import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../utils/api'
import { BookOpen, User, Mail, Lock, Eye, EyeOff, Sun, Moon, ArrowLeft } from 'lucide-react'

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    role: 'teacher'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [registeredEmail, setRegisteredEmail] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const checkPasswordStrength = (pass) => {
    let strength = 0
    if (pass.length >= 6) strength++
    if (pass.length >= 10) strength++
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++
    if (/\d/.test(pass)) strength++
    if (/[^a-zA-Z0-9]/.test(pass)) strength++
    return strength
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await authAPI.register(formData)
      setRegisteredEmail(formData.email)
      setShowOtpVerification(true)
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.slice(0, 6).split('')
      const newOtp = [...otp]
      digits.forEach((digit, i) => {
        if (index + i < 6) newOtp[index + i] = digit
      })
      setOtp(newOtp)
      const lastIndex = Math.min(index + digits.length - 1, 5)
      document.getElementById(`otp-${lastIndex}`)?.focus()
    } else {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus()
      }
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await authAPI.verifyOtp({
        email: registeredEmail,
        otp: otpCode
      })
      if (response.access_token) {
        login(response.access_token)
        navigate('/dashboard')
      } else {
        alert('Email verified successfully! Please login with your credentials.')
        navigate('/login')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP. Please try again.')
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500'
    if (passwordStrength <= 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak'
    if (passwordStrength <= 3) return 'Medium'
    return 'Strong'
  }

  if (showOtpVerification) {
    return (
      <div className="min-h-screen bg-[#1e293b] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="w-full max-w-md bg-[#0f1419] border border-gray-800 rounded-3xl shadow-2xl p-8 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
            <p className="text-gray-400">Enter the 6-digit code sent to {registeredEmail}</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 justify-center mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold bg-gray-100 border-0 rounded-xl text-gray-900 focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            ))}
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 mb-4"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>

          <button
            onClick={() => setShowOtpVerification(false)}
            className="w-full text-center text-gray-400 hover:text-white transition-colors"
          >
            Back to Sign Up
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1e293b] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-32 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        {isDark ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
      </button>

      <div className="w-full max-w-md bg-[#0f1419] border border-gray-800 rounded-3xl shadow-2xl p-8 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">QUIZZIFY</span>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Join thousands of learners worldwide</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="john"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-gray-100 border-0 rounded-xl text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-[#252b3b] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=""
                required
                className="w-full pl-12 pr-12 py-3.5 bg-gray-100 border-0 rounded-xl text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-cyan-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>Password strength: {getPasswordStrengthText()}</span>
                </div>
                <div className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
            />
            <label className="text-sm text-gray-400">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#0f1419] text-gray-500">or</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-semibold hover:text-cyan-400 transition-colors">
              Sign In
            </Link>
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-6 flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Home</span>
        </button>
      </div>
    </div>
  )
}
