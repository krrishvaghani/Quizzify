import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Upload, 
  Shuffle, 
  BarChart3, 
  Users, 
  FileText, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Play,
  Brain,
  Clock,
  Shield,
  TrendingUp,
  Award,
  Sparkles,
  Target,
  Rocket,
  Globe,
  Lock,
  LightbulbIcon,
  BookOpen,
  ChevronRight,
  Star,
  CheckCircle2,
  Menu,
  X,
  Check
} from 'lucide-react';
import AnimatedTabs from '../components/AnimatedTabs';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active tab based on scroll position
      const sections = ['home', 'features', 'how-it-works', 'pricing'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveTab(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Brain className="w-10 h-10" />,
      title: "AI Does the Heavy Lifting",
      description: "Upload your notes, get quiz questions. It's honestly that simple."
    },
    {
      icon: <Clock className="w-10 h-10" />,
      title: "Save Hours Every Week",
      description: "What used to take you all evening now takes 2 minutes. Seriously."
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Built-in Anti-Cheat",
      description: "Randomized questions and options. No two students see the same quiz."
    },
    {
      icon: <BarChart3 className="w-10 h-10" />,
      title: "See What's Working",
      description: "Know exactly which topics your students are struggling with."
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Group Quiz Rooms",
      description: "Perfect for study groups or in-class competitions."
    },
    {
      icon: <Globe className="w-10 h-10" />,
      title: "Students Don't Need Accounts",
      description: "Just share a link. They click, they start. That's it."
    }
  ];

  const stats = [
    { value: "10,247", label: "quizzes created" },
    { value: "47K", label: "students tested" },
    { value: "2 min", label: "avg setup time" }
  ];

  const steps = [
    {
      number: "1",
      title: "Drop Your Files",
      description: "PDFs, Word docs, PowerPoints—whatever you've got",
      icon: <Upload className="w-7 h-7" />
    },
    {
      number: "2",
      title: "AI Reads & Generates",
      description: "Takes about 30 seconds for a 20-question quiz",
      icon: <Zap className="w-7 h-7" />
    },
    {
      number: "3",
      title: "You Review & Tweak",
      description: "Change anything you want. Or don't. It's usually pretty good.",
      icon: <CheckCircle className="w-7 h-7" />
    },
    {
      number: "4",
      title: "Share & Monitor",
      description: "One link. Real-time results. Done.",
      icon: <BarChart3 className="w-7 h-7" />
    }
  ];

  const benefits = [
    { icon: <Rocket className="w-5 h-5" />, text: "Setup in 2 min" },
    { icon: <Target className="w-5 h-5" />, text: "Spot weak areas fast" },
    { icon: <BookOpen className="w-5 h-5" />, text: "Unlimited quizzes" },
    { icon: <CheckCircle2 className="w-5 h-5" />, text: "Auto-grading" },
    { icon: <Shield className="w-5 h-5" />, text: "Secure & Private" },
    { icon: <Users className="w-5 h-5" />, text: "Real-time Collab" }
  ];

  const useCases = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "For Teachers",
      description: "Create assessments in minutes, not hours. Track progress effortlessly.",
      highlights: ["Save 5+ hours/week", "Instant feedback", "Auto-grading"]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "For Students",
      description: "Practice with AI-generated questions. No account needed to start.",
      highlights: ["Self-paced learning", "Immediate results", "Mobile friendly"]
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "For Businesses",
      description: "Train teams efficiently. Test knowledge retention at scale.",
      highlights: ["Employee training", "Compliance testing", "Analytics dashboard"]
    }
  ];

  const comparisonFeatures = [
    { feature: "AI Quiz Generation", traditional: false, quizify: true },
    { feature: "Setup Time", traditional: "2-3 hours", quizify: "2 minutes" },
    { feature: "Student Accounts", traditional: "Required", quizify: "Optional" },
    { feature: "Anti-Cheat", traditional: "Manual", quizify: "Built-in" },
    { feature: "Real-time Analytics", traditional: false, quizify: true },
    { feature: "Cost", traditional: "$50+/mo", quizify: "Free start" }
  ];

  const faqs = [
    {
      question: "How accurate is the AI at generating questions?",
      answer: "Pretty accurate. It reads your content and generates relevant questions about 95% of the time. You can always edit or regenerate questions you don't like."
    },
    {
      question: "Do students need to create accounts?",
      answer: "Nope. They can take quizzes without signing up. Just share the link and they're in. If they want to track their own progress, they can create an account—but it's optional."
    },
    {
      question: "What file types can I upload?",
      answer: "PDF, Word docs, PowerPoint, plain text files. Basically anything you'd use to teach from."
    },
    {
      question: "Can I edit the AI-generated questions?",
      answer: "Absolutely. You have full control. Edit questions, change options, add new ones, delete what you don't like. It's your quiz."
    },
    {
      question: "Is there a limit on quiz length?",
      answer: "On the free plan, you can create up to 50 questions per quiz. Pro plan has no limits."
    },
    {
      question: "How does the anti-cheat feature work?",
      answer: "We randomize the order of questions and answer options for each student. So everyone gets the same questions, but in different orders."
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "5 quizzes per month",
        "Basic analytics",
        "50 questions per quiz",
        "Email support"
      ]
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      popular: true,
      features: [
        "Unlimited quizzes",
        "Advanced analytics",
        "Unlimited questions",
        "Priority support",
        "Custom branding",
        "Export reports"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
        "Training sessions",
        "API access"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header / Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isScrolled ? 'bg-black' : 'bg-white'
                }`}>
                  <Sparkles className={`w-7 h-7 ${isScrolled ? 'text-white' : 'text-black'}`} />
                </div>
                <span className={`text-3xl font-black tracking-tight ${
                  isScrolled ? 'text-black' : 'text-white'
                }`}>
                  Quizzify
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <AnimatedTabs
                tabs={[
                  { label: 'Home', value: 'home' },
                  { label: 'Features', value: 'features' },
                  { label: 'How It Works', value: 'how-it-works' },
                  { label: 'Pricing', value: 'pricing' }
                ]}
                variant="underline"
                activeTab={activeTab}
                isDark={!isScrolled}
                onTabChange={(value) => {
                  setActiveTab(value);
                  document.getElementById(value)?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
              <button
                onClick={() => navigate('/login')}
                className={`font-semibold hover:opacity-70 transition-opacity ${
                  isScrolled ? 'text-black' : 'text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 font-bold transition-all hover:scale-105 shadow-lg"
              >
                Get Started →
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden ${isScrolled ? 'text-black' : 'text-white'}`}
            >
              {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-xl">
            <div className="px-4 py-6 space-y-4">
              <a href="#home" className="block text-black font-semibold hover:bg-gray-100 px-4 py-3 rounded-lg">
                Home
              </a>
              <a href="#features" className="block text-black font-semibold hover:bg-gray-100 px-4 py-3 rounded-lg">
                Features
              </a>
              <a href="#how-it-works" className="block text-black font-semibold hover:bg-gray-100 px-4 py-3 rounded-lg">
                How It Works
              </a>
              <a href="#pricing" className="block text-black font-semibold hover:bg-gray-100 px-4 py-3 rounded-lg">
                Pricing
              </a>
              <button
                onClick={() => navigate('/login')}
                className="block w-full text-left text-black font-semibold hover:bg-gray-100 px-4 py-3 rounded-lg"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="block w-full px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 font-bold text-center"
              >
                Get Started →
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-gray-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gray-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-white flex items-center justify-center text-xs font-bold">A</div>
                  <div className="w-7 h-7 rounded-full bg-gray-600 border-2 border-white flex items-center justify-center text-xs font-bold">M</div>
                  <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-white flex items-center justify-center text-xs font-bold">K</div>
                </div>
                <span className="text-sm font-semibold">Trusted by 10,000+ educators</span>
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              <h1 className="text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                Create quizzes<br />
                in <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">2 minutes</span><br />
                <span className="text-gray-500">Not 2 hours</span>
              </h1>

              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl font-light">
                AI-powered quiz generation that actually works. Upload your content, 
                get smart questions instantly, and watch your students engage like never before.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="group px-10 py-5 bg-white text-black rounded-2xl hover:bg-gray-100 font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-2xl hover:scale-105 hover:shadow-white/20"
                >
                  Start for free
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="group px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-2xl border-2 border-white/30 hover:border-white hover:bg-white/20 font-bold text-lg transition-all flex items-center justify-center gap-3"
                >
                  <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  See how it works
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-10 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="relative">
                    <div className="absolute inset-0 bg-white/5 rounded-lg blur"></div>
                    <div className="relative px-6 py-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                      <div className="text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{stat.value}</div>
                      <div className="text-sm text-gray-400 font-medium mt-1">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative hidden lg:block">
              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 z-20 bg-white text-black px-6 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 animate-bounce">
                <Zap className="w-6 h-6" />
                <div>
                  <div className="text-2xl">2 min</div>
                  <div className="text-xs font-normal text-gray-600">Setup time</div>
                </div>
              </div>

              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-10 border-4 border-gray-200">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-transparent rounded-3xl opacity-50"></div>
                
                <div className="space-y-5 relative z-10">
                  {/* Step 1 */}
                  <div className="flex items-center gap-5 p-7 bg-white rounded-2xl border-2 border-gray-300 hover:border-black transition-all group shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-xl text-black">Upload</div>
                      <div className="text-sm text-gray-600 font-medium">Any document format</div>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <ChevronRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center gap-5 p-7 bg-white rounded-2xl border-2 border-gray-300 hover:border-black transition-all group shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-black rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-xl text-black">AI Magic</div>
                      <div className="text-sm text-gray-600 font-medium">Smart question generation</div>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <ChevronRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center gap-5 p-7 bg-gradient-to-br from-black to-gray-900 text-white rounded-2xl border-2 border-black transition-all group shadow-xl transform hover:-translate-y-1">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform group-hover:rotate-12 shadow-xl">
                      <Sparkles className="w-8 h-8 text-black" />
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-xl">Done!</div>
                      <div className="text-sm text-gray-300 font-medium">Share & track results</div>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-black" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 top-10 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -z-10 bottom-10 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="bg-gradient-to-r from-black via-gray-900 to-black py-6 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 justify-center text-center group">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all">
                  <div className="text-white">{benefit.icon}</div>
                </div>
                <span className="text-sm font-bold text-white whitespace-nowrap">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-bold mb-6">
              <Sparkles className="w-4 h-4" />
              POWERFUL FEATURES
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-black mb-6 tracking-tight">
              Everything you need.<br />
              <span className="text-gray-400">Nothing you don't.</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The tools that actually matter when you're creating assessments that engage students.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 bg-white rounded-3xl border-2 border-gray-200 hover:border-black transition-all hover:shadow-2xl hover:-translate-y-2 duration-300"
              >
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-black mb-3 group-hover:text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-bold mb-6 border border-white/20">
              <Rocket className="w-4 h-4" />
              SIMPLE PROCESS
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              From upload to quiz<br />
              <span className="text-gray-500">in 4 simple steps</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We've stripped away all the complexity. Just the essentials.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-white/30 to-transparent"></div>
                )}
                
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/20 hover:border-white/60 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/10 duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl">
                      {step.number}
                    </div>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed font-medium">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => navigate('/signup')}
              className="group px-12 py-6 bg-white text-black rounded-2xl hover:bg-gray-100 font-black text-xl transition-all inline-flex items-center gap-3 hover:scale-105 shadow-2xl hover:shadow-white/20"
            >
              Start creating now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <p className="mt-6 text-gray-400 text-sm">No credit card required • Free forever plan available</p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4">
              Built for everyone
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're teaching a class, training a team, or learning solo—we've got you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 hover:border-black transition-all group hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <div className="text-white">
                    {useCase.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-black mb-3">{useCase.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{useCase.description}</p>
                <ul className="space-y-3">
                  {useCase.highlights.map((highlight, hIndex) => (
                    <li key={hIndex} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4">
              The old way vs. the smart way
            </h2>
            <p className="text-lg text-gray-600">
              See why teachers are switching to Quizify
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-6 font-bold text-black text-lg">Feature</th>
                  <th className="text-center p-6 font-bold text-gray-500 text-lg">Traditional Tools</th>
                  <th className="text-center p-6 font-bold text-black text-lg bg-gray-50">
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Quizify
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-6 font-semibold text-black">{item.feature}</td>
                    <td className="p-6 text-center">
                      {typeof item.traditional === 'boolean' ? (
                        item.traditional ? (
                          <CheckCircle2 className="w-6 h-6 text-gray-400 mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-500 font-medium">{item.traditional}</span>
                      )}
                    </td>
                    <td className="p-6 text-center bg-gray-50">
                      {typeof item.quizify === 'boolean' ? (
                        item.quizify ? (
                          <CheckCircle2 className="w-6 h-6 text-black mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-black font-bold">{item.quizify}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 font-bold text-lg transition-all hover:scale-105 shadow-lg inline-flex items-center gap-2"
            >
              Start for free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof / Trust Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-3">
              Trusted by educators worldwide
            </h2>
            <p className="text-gray-600">Join thousands of teachers who've already made the switch</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-2">10,000+</div>
              <div className="text-gray-600 font-medium">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-2">500K+</div>
              <div className="text-gray-600 font-medium">Questions Generated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-2">98%</div>
              <div className="text-gray-600 font-medium">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-2">4.9/5</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 py-8 border-t border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-black" />
              <span className="font-semibold text-black">256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-black" />
              <span className="font-semibold text-black">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-black" />
              <span className="font-semibold text-black">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-black" />
              <span className="font-semibold text-black">Award Winning</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-14">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Simple pricing
            </h2>
            <p className="text-lg text-gray-300">
              Start free. Upgrade if you need more. That's it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`rounded-xl p-7 transition-all hover:scale-105 ${
                  plan.popular 
                    ? 'bg-white text-black ring-4 ring-white shadow-2xl' 
                    : 'bg-white/10 border-2 border-white/20 text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/40'
                }`}
              >
                {plan.popular && (
                  <div className="inline-block bg-black text-white px-3 py-1 rounded text-xs font-semibold mb-4">
                    Most popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-3 ${plan.popular ? 'text-black' : 'text-white'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-base mb-1">/mo</span>}
                  </div>
                  <p className={`text-sm ${plan.popular ? 'text-gray-600' : 'text-gray-300'}`}>
                    {plan.period}
                  </p>
                </div>

                <button
                  onClick={() => navigate('/signup')}
                  className={`w-full py-3 rounded-lg font-semibold mb-6 transition-all hover:scale-105 ${
                    plan.popular
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Contact us' : 'Get started'}
                </button>

                <div className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'text-black' : 'text-white'
                      }`} />
                      <span className={`text-sm ${plan.popular ? 'text-gray-700' : 'text-gray-200'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4">
              Questions? We've got answers
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about Quizify
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-black transition-all overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                >
                  <span className="font-bold text-black text-lg pr-4">{faq.question}</span>
                  <ChevronRight className={`w-6 h-6 text-black flex-shrink-0 transition-transform ${
                    openFaq === index ? 'rotate-90' : ''
                  }`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 pt-0">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 font-semibold transition-all inline-flex items-center gap-2"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-3">
              What teachers are saying
            </h2>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-black text-black" />
                ))}
              </div>
              <span className="text-gray-600 font-medium">4.9 out of 5 stars from 2,341 reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-black transition-all shadow-sm hover:shadow-lg">
              <div className="flex mb-3">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-black text-black" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "I was spending 3-4 hours making quizzes every week. Now it's maybe 20 minutes total. 
                The AI actually understands my lecture notes."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  MP
                </div>
                <div>
                  <p className="font-semibold text-black">Maria Patel</p>
                  <p className="text-gray-600 text-sm">Physics teacher, Chicago</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-black transition-all shadow-sm hover:shadow-lg">
              <div className="flex mb-3">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-black text-black" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "My students don't need to create accounts—they just click and start. Makes everything so much easier, 
                especially for quick pop quizzes."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  DK
                </div>
                <div>
                  <p className="font-semibold text-black">David Kim</p>
                  <p className="text-gray-600 text-sm">History teacher, Portland</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-black transition-all shadow-sm hover:shadow-lg">
              <div className="flex mb-3">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-black text-black" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "The analytics show me exactly which questions students struggled with. I can adjust my 
                teaching based on actual data now."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  SL
                </div>
                <div>
                  <p className="font-semibold text-black">Sarah Lin</p>
                  <p className="text-gray-600 text-sm">Math teacher, Austin</p>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-black transition-all shadow-sm hover:shadow-lg">
              <div className="flex mb-3">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-black text-black" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "I uploaded a 40-page PDF and got 30 solid questions in under a minute. 
                I tweaked maybe 5 of them. That's it."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  JR
                </div>
                <div>
                  <p className="font-semibold text-black">James Rodriguez</p>
                  <p className="text-gray-600 text-sm">Biology teacher, Miami</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 mb-8">
            <Rocket className="w-4 h-4" />
            <span className="text-sm font-semibold">Get started in under 2 minutes</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Ready to save a few hours<br />
            <span className="text-gray-400">every single week?</span>
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join 10,000+ teachers who stopped spending their evenings making quizzes 
            and started spending them doing literally anything else.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
              onClick={() => navigate('/signup')}
              className="px-10 py-5 bg-white text-black rounded-xl hover:bg-gray-100 font-bold text-lg transition-all hover:scale-105 shadow-2xl inline-flex items-center justify-center gap-2"
            >
              Start for free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-5 bg-transparent text-white rounded-xl border-2 border-white/30 hover:border-white/60 hover:bg-white/10 font-bold text-lg transition-all inline-flex items-center justify-center gap-2"
            >
              Sign in
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>No credit card needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5" />
                <span className="text-xl font-bold">Quizzify</span>
              </div>
              <p className="text-gray-400 text-sm">
                Make quizzes faster with AI.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-6 border-t border-gray-800 text-sm text-gray-400">
            <p>&copy; 2025 Quizzify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
