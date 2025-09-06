import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

const QuizTimer = ({ 
  timeLimit, 
  onTimeUp, 
  isActive = true, 
  showWarning = true,
  warningThreshold = 10 
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    setTimeLeft(timeLimit)
    setIsWarning(false)
  }, [timeLimit])

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1
        
        if (newTime <= warningThreshold && showWarning) {
          setIsWarning(true)
        }
        
        if (newTime <= 0) {
          onTimeUp?.()
          return 0
        }
        
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, timeLeft, onTimeUp, warningThreshold, showWarning])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerClass = () => {
    if (timeLeft <= 0) return 'timer-expired'
    if (isWarning) return 'timer-warning'
    return 'timer-normal'
  }

  const getProgressPercentage = () => {
    return ((timeLimit - timeLeft) / timeLimit) * 100
  }

  return (
    <div className={`quiz-timer ${getTimerClass()}`}>
      <div className="timer-icon">
        <Clock size={20} />
      </div>
      <div className="timer-content">
        <div className="timer-display">
          {formatTime(timeLeft)}
        </div>
        <div className="timer-progress">
          <div 
            className="timer-progress-bar"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default QuizTimer
