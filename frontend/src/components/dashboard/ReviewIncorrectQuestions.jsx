import { useState, useEffect, useMemo } from 'react'
import { 
  incorrectQuestions, 
  getQuestionsByTopic, 
  getQuestionsBySubject, 
  getQuestionsByMasteryLevel,
  getQuestionsForReview,
  updateQuestionReview,
  getReviewStats
} from './mockData'

function ReviewIncorrectQuestions() {
  const [questions, setQuestions] = useState(incorrectQuestions)
  const [selectedTopic, setSelectedTopic] = useState('All')
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [selectedMasteryLevel, setSelectedMasteryLevel] = useState('All')
  const [showReviewMode, setShowReviewMode] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [reviewStats, setReviewStats] = useState(getReviewStats())

  // Get unique topics, subjects, and mastery levels for filters
  const topics = useMemo(() => {
    const uniqueTopics = [...new Set(incorrectQuestions.map(q => q.topic))]
    return ['All', ...uniqueTopics]
  }, [])

  const subjects = useMemo(() => {
    const uniqueSubjects = [...new Set(incorrectQuestions.map(q => q.subject))]
    return ['All', ...uniqueSubjects]
  }, [])

  const masteryLevels = useMemo(() => {
    const uniqueLevels = [...new Set(incorrectQuestions.map(q => q.masteryLevel))]
    return ['All', ...uniqueLevels]
  }, [])

  // Filter questions based on selected filters
  const filteredQuestions = useMemo(() => {
    let filtered = questions

    if (selectedTopic !== 'All') {
      filtered = filtered.filter(q => q.topic === selectedTopic)
    }

    if (selectedSubject !== 'All') {
      filtered = filtered.filter(q => q.subject === selectedSubject)
    }

    if (selectedMasteryLevel !== 'All') {
      filtered = filtered.filter(q => q.masteryLevel === selectedMasteryLevel)
    }

    return filtered
  }, [questions, selectedTopic, selectedSubject, selectedMasteryLevel])

  // Get questions due for review
  const questionsForReview = getQuestionsForReview()

  const handleStartReview = () => {
    setShowReviewMode(true)
    setCurrentQuestionIndex(0)
    setShowAnswer(false)
  }

  const handleAnswerQuestion = (isCorrect) => {
    const currentQuestion = filteredQuestions[currentQuestionIndex]
    if (currentQuestion) {
      updateQuestionReview(currentQuestion.id, isCorrect)
      setReviewStats(getReviewStats())
    }

    // Move to next question or finish review
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowAnswer(false)
    } else {
      setShowReviewMode(false)
      setCurrentQuestionIndex(0)
      setShowAnswer(false)
      alert('Review session completed! Great job!')
    }
  }

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowAnswer(false)
    } else {
      setShowReviewMode(false)
      setCurrentQuestionIndex(0)
      setShowAnswer(false)
    }
  }

  const getMasteryColor = (level) => {
    switch (level) {
      case 'Needs Review': return '#f56565'
      case 'Learning': return '#ed8936'
      case 'Practicing': return '#3182ce'
      case 'Mastered': return '#48bb78'
      default: return '#718096'
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#48bb78'
      case 'Medium': return '#ed8936'
      case 'Hard': return '#f56565'
      default: return '#718096'
    }
  }

  if (showReviewMode && filteredQuestions.length > 0) {
    const currentQuestion = filteredQuestions[currentQuestionIndex]
    
    return (
      <div className="review-mode-container">
        <div className="review-header">
          <div className="review-progress">
            <span>Question {currentQuestionIndex + 1} of {filteredQuestions.length}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <button 
            className="btn-exit-review"
            onClick={() => setShowReviewMode(false)}
          >
            Exit Review
          </button>
        </div>

        <div className="question-card">
          <div className="question-header">
            <div className="question-meta">
              <span className="subject-tag">{currentQuestion.subject}</span>
              <span className="topic-tag">{currentQuestion.topic}</span>
              <span 
                className="difficulty-tag"
                style={{ backgroundColor: getDifficultyColor(currentQuestion.difficulty) }}
              >
                {currentQuestion.difficulty}
              </span>
            </div>
            <div className="question-assignment">
              From: {currentQuestion.assignment}
            </div>
          </div>

          <div className="question-content">
            <h3>{currentQuestion.question}</h3>
            
            {!showAnswer ? (
              <div className="question-actions">
                <button 
                  className="btn-show-answer"
                  onClick={() => setShowAnswer(true)}
                >
                  Show Answer
                </button>
                <button 
                  className="btn-skip"
                  onClick={handleSkipQuestion}
                >
                  Skip Question
                </button>
              </div>
            ) : (
              <div className="answer-section">
                <div className="answer-comparison">
                  <div className="answer-item">
                    <span className="answer-label">Your Answer:</span>
                    <span className="student-answer">{currentQuestion.studentAnswer}</span>
                  </div>
                  <div className="answer-item">
                    <span className="answer-label">Correct Answer:</span>
                    <span className="correct-answer">{currentQuestion.correctAnswer}</span>
                  </div>
                </div>
                
                <div className="explanation">
                  <h4>Explanation:</h4>
                  <p>{currentQuestion.explanation}</p>
                </div>

                <div className="review-actions">
                  <button 
                    className="btn-incorrect"
                    onClick={() => handleAnswerQuestion(false)}
                  >
                    ❌ Still Don't Understand
                  </button>
                  <button 
                    className="btn-correct"
                    onClick={() => handleAnswerQuestion(true)}
                  >
                    ✅ Now I Understand
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="review-incorrect-container">
      {/* Header */}
      <div className="review-header">
        <div className="header-content">
          <h2>📚 Review Incorrect Questions</h2>
          <p>Practice your mistakes to improve your understanding</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-start-review"
            onClick={handleStartReview}
            disabled={filteredQuestions.length === 0}
          >
            🎯 Start Review Session
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-value">{reviewStats.total}</span>
            <span className="stat-label">Total Questions</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <span className="stat-value">{reviewStats.dueForReview}</span>
            <span className="stat-label">Due for Review</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <span className="stat-value">{reviewStats.masteryRate}%</span>
            <span className="stat-label">Mastery Rate</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <span className="stat-value">{reviewStats.mastered}</span>
            <span className="stat-label">Mastered</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <h3>Filter Questions</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Topic:</label>
            <select 
              value={selectedTopic} 
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Subject:</label>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Mastery Level:</label>
            <select 
              value={selectedMasteryLevel} 
              onChange={(e) => setSelectedMasteryLevel(e.target.value)}
            >
              {masteryLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="questions-section">
        <h3>Questions ({filteredQuestions.length})</h3>
        {filteredQuestions.length === 0 ? (
          <div className="no-questions">
            <p>No questions match your current filters.</p>
            <button 
              className="btn-clear-filters"
              onClick={() => {
                setSelectedTopic('All')
                setSelectedSubject('All')
                setSelectedMasteryLevel('All')
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="questions-list">
            {filteredQuestions.map((question, index) => (
              <div key={question.id} className="question-item">
                <div className="question-info">
                  <div className="question-meta">
                    <span className="subject-tag">{question.subject}</span>
                    <span className="topic-tag">{question.topic}</span>
                    <span 
                      className="difficulty-tag"
                      style={{ backgroundColor: getDifficultyColor(question.difficulty) }}
                    >
                      {question.difficulty}
                    </span>
                  </div>
                  <h4>{question.question}</h4>
                  <div className="question-details">
                    <span>Assignment: {question.assignment}</span>
                    <span>Date: {new Date(question.dateAnswered).toLocaleDateString()}</span>
                    <span>Reviews: {question.reviewCount}</span>
                  </div>
                </div>
                <div className="question-status">
                  <span 
                    className="mastery-badge"
                    style={{ backgroundColor: getMasteryColor(question.masteryLevel) }}
                  >
                    {question.masteryLevel}
                  </span>
                  {question.nextReviewDate && (
                    <span className="next-review">
                      Next: {new Date(question.nextReviewDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewIncorrectQuestions
