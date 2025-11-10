import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  BarChart3, 
  Laptop,
  Brain,
  Rocket,
  Sun,
  Moon
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Learning",
      description: "Generate custom quizzes on any topic using advanced AI technology for personalized learning experiences.",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-time Analytics",
      description: "Track your progress with detailed performance analytics and insights to optimize your learning journey.",
      color: "from-pink-500 to-purple-500"
    },
    {
      icon: <Laptop className="w-8 h-8" />,
      title: "Cross-Platform",
      description: "Access your quizzes anywhere, anytime with our responsive design that works on all devices.",
      color: "from-blue-500 to-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#1e293b] text-white overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-gray-700/50 sticky top-0 z-50 backdrop-blur-xl bg-[#1e293b]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              QUIZZIFY
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl font-bold transition-all shadow-lg"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-xl font-bold transition-all"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Background gradient blur */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-300">AI-Powered Learning Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Master Knowledge with{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Interactive Quizzes
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Engage, learn, and excel with our comprehensive quiz system designed for modern learners
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white rounded-xl font-bold text-lg transition-all shadow-2xl"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-xl font-bold text-lg transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Quizify Section */}
      <section className="py-20 px-6 bg-[#0f1419]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Quizify?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the future of learning with our cutting-edge features
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#1a1f2e] rounded-2xl p-8 border-2 border-[#2d3548] hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of learners who have already discovered the power of interactive quizzes
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 text-white rounded-2xl font-bold text-xl transition-all shadow-2xl"
          >
            <Rocket className="w-6 h-6" />
            Start Learning Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700/50 bg-[#0f1419] py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                QUIZZIFY
              </span>
            </div>
          </div>
          <div className="text-center mt-6 text-sm text-gray-500">
            Â© 2024 Quizify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
