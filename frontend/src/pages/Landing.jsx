import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Zap, 
  Target, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Star,
  BookOpen,
  Award,
  Clock,
  BarChart3
} from 'lucide-react';

function Landing() {
  const features = [
    {
      icon: <Brain size={48} />,
      title: "AI-Powered Quiz Generation",
      description: "Upload any document and let our AI create personalized quizzes tailored to your learning needs."
    },
    {
      icon: <Target size={48} />,
      title: "Adaptive Learning",
      description: "Smart algorithms adjust question difficulty based on your performance to optimize learning outcomes."
    },
    {
      icon: <BarChart3 size={48} />,
      title: "Progress Tracking",
      description: "Comprehensive analytics and insights to monitor your learning journey and identify areas for improvement."
    }
  ];

  const testimonials = [
    { name: "Sarah M.", role: "Student", rating: 5 },
    { name: "John D.", role: "Teacher", rating: 5 },
    { name: "Emily R.", role: "Professional", rating: 5 },
    { name: "Mike L.", role: "Researcher", rating: 5 },
    { name: "Lisa K.", role: "Student", rating: 5 }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Quizzes Generated" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-icon">🎯</div>
            <span className="brand-text">Quizzify</span>
          </div>
          <div className="nav-menu">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How it Works</a>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-button">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="trust-indicator">
              <span className="trust-text">Trusted by</span>
              <span className="trust-number">10,000</span>
              <span className="trust-text">learners</span>
              <div className="user-avatars">
                {testimonials.map((user, index) => (
                  <div key={index} className="user-avatar">
                    <div className="avatar-circle">{user.name[0]}</div>
                  </div>
                ))}
              </div>
            </div>

            <h1 className="hero-title">
              Transform Your Learning with
              <span className="gradient-text"> AI-Powered Quizzes</span>
            </h1>
            
            <p className="hero-description">
              Quizzify uses advanced AI to convert any document into personalized quizzes. 
              Get instant feedback, track your progress, and accelerate your learning journey.
            </p>

            <div className="hero-actions">
              <Link to="/signup" className="cta-button primary">
                Start Learning Free
                <ArrowRight size={20} />
              </Link>
              <div className="hero-note">
                <CheckCircle size={16} />
                <span>No credit card required</span>
              </div>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="dashboard-preview">
              <div className="preview-header">
                <div className="preview-nav">
                  <div className="nav-dot"></div>
                  <div className="nav-dot"></div>
                  <div className="nav-dot"></div>
                </div>
                <div className="preview-title">Quizzify Dashboard</div>
              </div>
              <div className="preview-content">
                <div className="preview-sidebar">
                  <div className="sidebar-item active">
                    <BookOpen size={16} />
                    <span>Quiz Generator</span>
                  </div>
                  <div className="sidebar-item">
                    <BarChart3 size={16} />
                    <span>Analytics</span>
                  </div>
                  <div className="sidebar-item">
                    <Award size={16} />
                    <span>Achievements</span>
                  </div>
                </div>
                <div className="preview-main">
                  <div className="preview-card">
                    <div className="card-header">Recent Quiz</div>
                    <div className="card-content">
                      <div className="progress-ring">
                        <div className="ring-text">85%</div>
                      </div>
                      <div className="card-stats">
                        <div className="stat">
                          <Clock size={14} />
                          <span>5 min</span>
                        </div>
                        <div className="stat">
                          <Target size={14} />
                          <span>12/15</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Quizzify?</h2>
            <p className="section-description">
              Powerful features designed to enhance your learning experience
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">
              Get started in just three simple steps
            </p>
          </div>

          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Upload Your Document</h3>
                <p>Upload any PDF, Word document, or text file you want to study from.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>AI Generates Quiz</h3>
                <p>Our AI analyzes your content and creates personalized quiz questions.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Learn & Track Progress</h3>
                <p>Take quizzes, get instant feedback, and monitor your learning progress.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Learning?</h2>
            <p className="cta-description">
              Join thousands of learners who are already using Quizzify to accelerate their education.
            </p>
            <div className="cta-actions">
              <Link to="/signup" className="cta-button primary large">
                Get Started Free
                <ArrowRight size={24} />
              </Link>
            </div>
            <div className="cta-note">
              <CheckCircle size={16} />
              <span>Free forever • No credit card required • Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand-icon">🎯</div>
              <span className="brand-text">Quizzify</span>
            </div>
            <div className="footer-links">
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Quizzify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
