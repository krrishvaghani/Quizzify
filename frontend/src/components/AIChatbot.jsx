import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Lightbulb } from 'lucide-react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your AI learning assistant. I can help you with study tips, explain concepts, or answer questions about your quizzes. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage) => {
    // Simulate AI response based on keywords
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('quiz') || lowerMessage.includes('test')) {
      return "Great question about quizzes! Here are some tips: 1) Read questions carefully, 2) Eliminate obviously wrong answers first, 3) Manage your time wisely, 4) Review your answers if time permits. Would you like specific help with any subject?";
    } else if (lowerMessage.includes('study') || lowerMessage.includes('learn')) {
      return "Effective studying involves: 1) Active recall - test yourself regularly, 2) Spaced repetition - review material over time, 3) Break topics into smaller chunks, 4) Use multiple learning methods (visual, auditory, kinesthetic). What subject are you studying?";
    } else if (lowerMessage.includes('math') || lowerMessage.includes('mathematics')) {
      return "Math can be challenging but rewarding! Try these strategies: 1) Practice problems daily, 2) Understand concepts before memorizing formulas, 3) Work through examples step-by-step, 4) Don't skip steps in calculations. What specific math topic do you need help with?";
    } else if (lowerMessage.includes('science')) {
      return "Science learning tips: 1) Connect concepts to real-world examples, 2) Use diagrams and visual aids, 3) Conduct experiments when possible, 4) Ask 'why' and 'how' questions. Which science subject interests you most?";
    } else if (lowerMessage.includes('time') || lowerMessage.includes('manage')) {
      return "Time management is crucial for learning success: 1) Use the Pomodoro Technique (25 min study, 5 min break), 2) Prioritize difficult topics when you're most alert, 3) Set specific, achievable goals, 4) Eliminate distractions. Need help creating a study schedule?";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
      return "I'm here to help! You can ask me about: 📚 Study techniques, 🧠 Learning strategies, 📝 Quiz preparation, 🔢 Math concepts, 🔬 Science topics, ⏰ Time management, 💡 Problem-solving tips. What would you like to explore?";
    } else {
      return "That's an interesting question! While I can help with study techniques, quiz strategies, and learning tips, I'd recommend breaking down complex problems into smaller parts. Can you tell me more about what specific area you'd like help with?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(inputMessage);
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className={`chatbot-toggle ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        <div className="chatbot-badge">
          <Lightbulb size={12} />
        </div>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <Bot className="chatbot-icon" size={20} />
              <div>
                <h3>AI Learning Assistant</h3>
                <span className="chatbot-status">Online</span>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'bot' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="message-content">
                  <p>{message.content}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">
                  <Bot size={16} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about learning..."
              rows={1}
              className="chatbot-textarea"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="chatbot-send"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
