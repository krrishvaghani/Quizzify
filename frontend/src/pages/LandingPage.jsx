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

export default function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
    { icon: <CheckCircle2 className="w-5 h-5" />, text: "Auto-grading" }
  ];

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
            <div className="hidden lg:flex items-center gap-10">
              <a href="#home" className={`font-semibold hover:opacity-70 transition-opacity ${
                isScrolled ? 'text-black' : 'text-white'
              }`}>
                Home
              </a>
              <a href="#features" className={`font-semibold hover:opacity-70 transition-opacity ${
                isScrolled ? 'text-black' : 'text-white'
              }`}>
                Features
              </a>
              <a href="#how-it-works" className={`font-semibold hover:opacity-70 transition-opacity ${
                isScrolled ? 'text-black' : 'text-white'
              }`}>
                How It Works
              </a>
              <a href="#pricing" className={`font-semibold hover:opacity-70 transition-opacity ${
                isScrolled ? 'text-black' : 'text-white'
              }`}>
                Pricing
              </a>
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
      <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-black via-gray-900 to-gray-800 pt-20">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-white space-y-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Used by 10,000+ teachers</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Make quizzes in 2 minutes.<br />
                <span className="text-gray-400">Not 2 hours.</span>
              </h1>

              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                Upload your lecture notes or PDFs. Our AI reads them and generates quiz questions. 
                You tweak what needs tweaking. Students take the quiz. Everyone's happy.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-7 py-4 bg-white text-black rounded-lg hover:bg-gray-100 font-semibold text-base flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  Try it free
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  className="px-7 py-4 bg-transparent text-white rounded-lg border border-white/20 hover:border-white/40 font-semibold text-base transition-all"
                >
                  Watch 2-min demo
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-6 border-t border-white/10">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-500">
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-black transition-all group">
                    <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-black">Upload Document</div>
                      <div className="text-sm text-gray-600">PDF, DOCX, PPTX, TXT</div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-black transition-all group">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Brain className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-black">AI Processing</div>
                      <div className="text-sm text-gray-600">Intelligent question generation</div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-black transition-all group">
                    <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-black">Quiz Ready!</div>
                      <div className="text-sm text-gray-600">Share & track results</div>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-black" />
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-black text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span>2 Min Setup</span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 top-20 -right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute -z-10 bottom-20 -left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="bg-white py-6 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 justify-center text-center">
                <div className="text-black">{benefit.icon}</div>
                <span className="text-sm font-semibold text-black whitespace-nowrap">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4">
              What makes it good
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              The stuff that actually matters when you're trying to make a quiz quickly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
              >
                <div className="mb-4 text-black">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4">
              How it actually works
            </h2>
            <p className="text-lg text-gray-600">
              Four steps. Two minutes. That's the whole thing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                    <div className="text-black">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold mb-2 text-black">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold transition-all inline-flex items-center gap-2"
            >
              Start creating
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4">
              Simple pricing
            </h2>
            <p className="text-lg text-gray-600">
              Start free. Upgrade if you need more. That's it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`rounded-xl p-7 ${
                  plan.popular 
                    ? 'bg-black text-white ring-2 ring-black' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="inline-block bg-white text-black px-3 py-1 rounded text-xs font-semibold mb-4">
                    Most popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-3 ${plan.popular ? 'text-white' : 'text-black'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-base mb-1">/mo</span>}
                  </div>
                  <p className={`text-sm ${plan.popular ? 'text-gray-300' : 'text-gray-600'}`}>
                    {plan.period}
                  </p>
                </div>

                <button
                  onClick={() => navigate('/signup')}
                  className={`w-full py-3 rounded-lg font-semibold mb-6 transition-all ${
                    plan.popular
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Contact us' : 'Get started'}
                </button>

                <div className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'text-white' : 'text-black'
                      }`} />
                      <span className={`text-sm ${plan.popular ? 'text-gray-200' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-3">
              What teachers are saying
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
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
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
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
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
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
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
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
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-5 leading-tight">
            Ready to save a few hours?
          </h2>

          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Join 10,000+ teachers who stopped spending their evenings making quizzes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-white text-black rounded-lg hover:bg-gray-100 font-semibold transition-all"
            >
              Start for free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-transparent text-white rounded-lg border border-white/20 hover:border-white/40 font-semibold transition-all"
            >
              Sign in
            </button>
          </div>

          <p className="text-sm text-gray-400">
            No credit card • Free to start • Takes 2 minutes
          </p>
        </div>
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
