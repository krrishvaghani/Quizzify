import React, { useState, useEffect } from 'react';
import { Brain, Target, BookOpen, TrendingUp, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

const PersonalizedRecommendations = ({ quizResults, onGeneratePractice, onClose }) => {
  const [weakAreas, setWeakAreas] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (quizResults) {
      analyzeWeakAreas();
    }
  }, [quizResults]);

  const analyzeWeakAreas = () => {
    if (!quizResults.results) return;

    // Analyze incorrect answers to identify weak topics
    const topicPerformance = {};
    const incorrectQuestions = quizResults.results.filter(result => !result.isCorrect);

    incorrectQuestions.forEach(result => {
      // Extract topic from question content (simple keyword matching)
      const topics = extractTopicsFromQuestion(result.question);
      
      topics.forEach(topic => {
        if (!topicPerformance[topic]) {
          topicPerformance[topic] = { incorrect: 0, total: 0, questions: [] };
        }
        topicPerformance[topic].incorrect += 1;
        topicPerformance[topic].questions.push(result.question);
      });
    });

    // Also count total questions per topic
    quizResults.results.forEach(result => {
      const topics = extractTopicsFromQuestion(result.question);
      topics.forEach(topic => {
        if (!topicPerformance[topic]) {
          topicPerformance[topic] = { incorrect: 0, total: 0, questions: [] };
        }
        topicPerformance[topic].total += 1;
      });
    });

    // Identify weak areas (>50% incorrect or multiple incorrect answers)
    const weakTopics = Object.entries(topicPerformance)
      .filter(([topic, performance]) => {
        const errorRate = performance.incorrect / performance.total;
        return errorRate > 0.4 || performance.incorrect >= 2;
      })
      .map(([topic, performance]) => ({
        topic,
        errorRate: Math.round((performance.incorrect / performance.total) * 100),
        incorrectCount: performance.incorrect,
        totalCount: performance.total,
        sampleQuestions: performance.questions.slice(0, 2)
      }))
      .sort((a, b) => b.errorRate - a.errorRate);

    setWeakAreas(weakTopics);
    generateRecommendations(weakTopics);
  };

  const extractTopicsFromQuestion = (question) => {
    const topicKeywords = {
      'Networking': ['network', 'tcp', 'ip', 'http', 'dns', 'router', 'switch', 'protocol', 'ethernet', 'wifi'],
      'Programming': ['code', 'function', 'variable', 'loop', 'array', 'object', 'class', 'method', 'algorithm'],
      'Database': ['sql', 'database', 'table', 'query', 'join', 'index', 'primary key', 'foreign key'],
      'Security': ['security', 'encryption', 'password', 'authentication', 'firewall', 'vulnerability', 'malware'],
      'Mathematics': ['equation', 'formula', 'calculate', 'solve', 'theorem', 'proof', 'derivative', 'integral'],
      'Science': ['experiment', 'hypothesis', 'theory', 'molecule', 'atom', 'reaction', 'energy', 'force'],
      'History': ['war', 'empire', 'revolution', 'century', 'ancient', 'medieval', 'modern', 'civilization'],
      'Literature': ['author', 'novel', 'poem', 'character', 'plot', 'theme', 'metaphor', 'symbolism'],
      'Geography': ['country', 'continent', 'ocean', 'mountain', 'river', 'climate', 'population', 'capital']
    };

    const questionLower = question.toLowerCase();
    const matchedTopics = [];

    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      const matches = keywords.filter(keyword => questionLower.includes(keyword));
      if (matches.length > 0) {
        matchedTopics.push(topic);
      }
    });

    return matchedTopics.length > 0 ? matchedTopics : ['General'];
  };

  const generateRecommendations = (weakTopics) => {
    const recommendations = weakTopics.map(area => ({
      topic: area.topic,
      priority: area.errorRate > 70 ? 'high' : area.errorRate > 50 ? 'medium' : 'low',
      suggestions: generateTopicSuggestions(area.topic),
      practiceQuestions: generatePracticeQuestions(area.topic),
      studyResources: generateStudyResources(area.topic)
    }));

    setRecommendations(recommendations);
  };

  const generateTopicSuggestions = (topic) => {
    const suggestions = {
      'Networking': [
        'Review OSI model layers and their functions',
        'Practice subnetting and IP addressing',
        'Study common network protocols (TCP, UDP, HTTP)',
        'Understand routing and switching concepts'
      ],
      'Programming': [
        'Practice basic syntax and data structures',
        'Work on algorithm problem-solving',
        'Review object-oriented programming concepts',
        'Study debugging techniques'
      ],
      'Database': [
        'Practice SQL query writing',
        'Review database normalization',
        'Study join operations and relationships',
        'Understand indexing and performance'
      ],
      'Security': [
        'Learn about common vulnerabilities',
        'Study encryption methods',
        'Practice security best practices',
        'Review authentication mechanisms'
      ],
      'Mathematics': [
        'Review fundamental formulas',
        'Practice problem-solving techniques',
        'Study proof methods',
        'Work on calculation accuracy'
      ],
      'General': [
        'Review core concepts from the quiz',
        'Practice similar question types',
        'Focus on understanding rather than memorization',
        'Take additional practice quizzes'
      ]
    };

    return suggestions[topic] || suggestions['General'];
  };

  const generatePracticeQuestions = (topic) => {
    const questions = {
      'Networking': [
        'What is the difference between TCP and UDP?',
        'How does DNS resolution work?',
        'Explain the purpose of subnetting'
      ],
      'Programming': [
        'What is the time complexity of binary search?',
        'Explain the difference between stack and heap memory',
        'How do you implement a linked list?'
      ],
      'Database': [
        'Write a SQL query to find duplicate records',
        'Explain the difference between INNER and LEFT JOIN',
        'What is database normalization?'
      ],
      'General': [
        'Review the questions you got wrong',
        'Practice similar concepts',
        'Take a focused quiz on this topic'
      ]
    };

    return questions[topic] || questions['General'];
  };

  const generateStudyResources = (topic) => {
    return [
      `${topic} fundamentals course`,
      `Interactive ${topic} tutorials`,
      `${topic} practice exercises`,
      `${topic} reference documentation`
    ];
  };

  const handleGeneratePracticeQuiz = async (topic) => {
    setLoading(true);
    try {
      // Simulate API call to generate practice questions
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onGeneratePractice) {
        onGeneratePractice(topic);
      }
    } catch (error) {
      console.error('Failed to generate practice quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle size={20} />;
      case 'medium': return <Target size={20} />;
      case 'low': return <CheckCircle size={20} />;
      default: return <BookOpen size={20} />;
    }
  };

  if (!quizResults || weakAreas.length === 0) {
    return (
      <div className="recommendations-container">
        <div className="recommendations-header">
          <Brain size={24} />
          <div>
            <h2>Great Job! 🎉</h2>
            <p>No significant weak areas detected. Keep up the excellent work!</p>
          </div>
        </div>
        
        <div className="success-message">
          <CheckCircle size={48} />
          <h3>Strong Performance Across All Areas</h3>
          <p>You demonstrated solid understanding in all topics covered. Consider taking more advanced quizzes to continue challenging yourself.</p>
          
          <button className="btn-primary-rec" onClick={onClose}>
            <TrendingUp size={20} />
            Continue Learning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <Brain size={24} />
        <div>
          <h2>Personalized Learning Recommendations</h2>
          <p>Based on your quiz performance, here are areas to focus on for improvement.</p>
        </div>
      </div>

      <div className="weak-areas-summary">
        <h3>Areas for Improvement</h3>
        <div className="weak-areas-grid">
          {weakAreas.map((area, index) => (
            <div key={index} className="weak-area-card">
              <div className="area-header">
                <div className="area-info">
                  <h4>{area.topic}</h4>
                  <span className="error-rate" style={{ color: getPriorityColor(area.errorRate > 70 ? 'high' : area.errorRate > 50 ? 'medium' : 'low') }}>
                    {area.errorRate}% error rate
                  </span>
                </div>
                <div className="area-stats">
                  {area.incorrectCount}/{area.totalCount} incorrect
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recommendations-list">
        {recommendations.map((rec, index) => (
          <div key={index} className="recommendation-card">
            <div className="rec-header">
              <div className="rec-title">
                <div className="priority-indicator" style={{ color: getPriorityColor(rec.priority) }}>
                  {getPriorityIcon(rec.priority)}
                </div>
                <div>
                  <h3>{rec.topic}</h3>
                  <span className={`priority-badge ${rec.priority}`}>
                    {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                  </span>
                </div>
              </div>
            </div>

            <div className="rec-content">
              <div className="suggestions-section">
                <h4>📚 Study Suggestions</h4>
                <ul className="suggestions-list">
                  {rec.suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>

              <div className="practice-section">
                <h4>🎯 Practice Questions</h4>
                <ul className="practice-list">
                  {rec.practiceQuestions.map((question, idx) => (
                    <li key={idx}>{question}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rec-actions">
              <button 
                className="btn-practice"
                onClick={() => handleGeneratePracticeQuiz(rec.topic)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Target size={16} />
                    Generate Practice Quiz
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="recommendations-footer">
        <button className="btn-secondary-rec" onClick={onClose}>
          Continue to Dashboard
        </button>
        <button 
          className="btn-primary-rec"
          onClick={() => handleGeneratePracticeQuiz('Mixed')}
          disabled={loading}
        >
          <ArrowRight size={20} />
          Create Mixed Practice Quiz
        </button>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
