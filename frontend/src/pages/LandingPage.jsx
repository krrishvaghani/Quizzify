import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Shuffle, 
  BarChart3, 
  Users, 
  FileText, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Play
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Upload className="w-8 h-8 text-blue-600" />,
      title: "Upload Files",
      description: "Auto-generate quiz questions from PDFs, PPTs, and documents"
    },
    {
      icon: <Shuffle className="w-8 h-8 text-blue-600" />,
      title: "Randomized Questions",
      description: "Prevent cheating with shuffled questions and options"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: "Detailed Reports",
      description: "See performance metrics and identify weak areas"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Role-based Dashboard",
      description: "Separate views for teachers and students"
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Upload a File",
      description: "Upload your notes, PDFs, or documents"
    },
    {
      number: "2",
      title: "Generate Questions",
      description: "AI automatically creates quiz questions"
    },
    {
      number: "3",
      title: "Share with Students",
      description: "Send quiz links to your students"
    },
    {
      number: "4",
      title: "View Analytics",
      description: "Track performance and get detailed insights"
    }
  ];

  const screenshots = [
    {
      label: "Create Quiz",
      description: "Upload files and generate questions instantly"
    },
    {
      label: "Take Quiz",
      description: "Interactive quiz-taking experience"
    },
    {
      label: "View Analytics",
      description: "Comprehensive performance reports"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header / Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Quizify</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </a>
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                How It Works
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Contact
              </a>
              <button
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Create Smart Quizzes Instantly
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Upload your notes or PDFs and generate interactive quizzes in seconds. 
                Simplify assessment and track student performance effortlessly.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg flex items-center gap-2 transition-colors"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  className="px-8 py-4 bg-white text-gray-700 rounded-lg border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 font-semibold text-lg flex items-center gap-2 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Upload className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700 font-medium">Upload Document</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Zap className="w-6 h-6 text-purple-600" />
                  <span className="text-gray-700 font-medium">AI Generates Questions</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-gray-700 font-medium">Quiz Ready to Share</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to create and manage quizzes</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in 4 simple steps</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">See Quizify in Action</h2>
            <p className="text-xl text-gray-600">Intuitive interface designed for everyone</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {screenshots.map((screenshot, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <div className="bg-white rounded-lg h-48 mb-4 flex items-center justify-center border border-gray-200">
                  <div className="text-center">
                    {index === 0 && <Upload className="w-16 h-16 text-blue-600 mx-auto mb-2" />}
                    {index === 1 && <FileText className="w-16 h-16 text-purple-600 mx-auto mb-2" />}
                    {index === 2 && <BarChart3 className="w-16 h-16 text-green-600 mx-auto mb-2" />}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{screenshot.label}</h3>
                <p className="text-gray-600">{screenshot.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Teachers Say</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <p className="text-gray-700 text-lg mb-4 italic">
                "Quizify saves me hours every week! I can create quizzes from my lecture notes in minutes."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  MP
                </div>
                <div>
                  <p className="font-bold text-gray-900">Mrs. Patel</p>
                  <p className="text-gray-600 text-sm">High School Teacher</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <p className="text-gray-700 text-lg mb-4 italic">
                "The analytics feature helps me identify exactly where my students need more help."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  JS
                </div>
                <div>
                  <p className="font-bold text-gray-900">John Smith</p>
                  <p className="text-gray-600 text-sm">College Professor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Creating Quizzes Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teachers already using Quizify
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-10 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-bold text-lg transition-colors"
          >
            Sign Up Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Quizify</span>
            </div>

            {/* Links */}
            <div className="flex justify-center gap-6">
              <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              <a href="#privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#terms" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            </div>

            {/* Social Icons */}
            <div className="flex justify-end gap-4">
              <a href="#linkedin" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <span className="text-sm font-bold">in</span>
              </a>
              <a href="#twitter" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <span className="text-sm font-bold">X</span>
              </a>
              <a href="#instagram" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <span className="text-sm font-bold">IG</span>
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Quizify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
