import { useState, useEffect } from 'react'
import { generateStudyPlan, saveStudyPlanPreferences, getStudyPlanPreferences } from '../../services/studyPlanService.js'

function StudyPlannerView({ studyPlanSuggestions: initialSuggestions }) {
  const [expandedSuggestion, setExpandedSuggestion] = useState(null)
  const [studyPlanSuggestions, setStudyPlanSuggestions] = useState(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('studyPlanSuggestions')
    return saved ? JSON.parse(saved) : (initialSuggestions || [])
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [schedule, setSchedule] = useState(() => {
    // Load schedule from localStorage on mount
    const savedSchedule = localStorage.getItem('studySchedule')
    return savedSchedule ? JSON.parse(savedSchedule) : []
  })
  const [preferences, setPreferences] = useState({
    learning_style: 'visual',
    study_time_preference: 'evening',
    break_frequency: 'every_hour'
  })
  const [planConfig, setPlanConfig] = useState({
    subjects: [],
    available_hours_per_week: 20
  })

  // Save to localStorage whenever schedule or suggestions change
  useEffect(() => {
    localStorage.setItem('studySchedule', JSON.stringify(schedule))
  }, [schedule])

  useEffect(() => {
    localStorage.setItem('studyPlanSuggestions', JSON.stringify(studyPlanSuggestions))
  }, [studyPlanSuggestions])

  useEffect(() => {
    // Load saved preferences
    const loadPreferences = async () => {
      try {
        const savedPrefs = await getStudyPlanPreferences()
        if (savedPrefs && Object.keys(savedPrefs).length > 0) {
          setPreferences(savedPrefs)
        }
      } catch (err) {
        console.error('Failed to load preferences:', err)
        // Silently fail - use default preferences
      }
    }
    loadPreferences()
  }, [])

  const toggleExplanation = (id) => {
    setExpandedSuggestion(expandedSuggestion === id ? null : id)
  }

  const handleGenerateStudyPlan = async () => {
    if (planConfig.subjects.length === 0) {
      setError('Please select at least one subject')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await generateStudyPlan({
        subjects: planConfig.subjects,
        available_hours_per_week: planConfig.available_hours_per_week,
        preferences: preferences
      })

      console.log('📥 Received study plan response:', response)
      console.log('📊 Study plan data:', response.study_plan)
      console.log('📏 Study plan length:', response.study_plan?.length)
      console.log('🤖 AI Generated:', !response.mock)
      console.log('🎯 Used preferences:', response.used_preferences)

      if (response.study_plan && Array.isArray(response.study_plan)) {
        setStudyPlanSuggestions(response.study_plan)
        setShowConfigModal(false)
        
        // Show detailed success message
        let message = '';
        if (response.mock) {
          message = `📚 Generated ${response.study_plan.length} study suggestions\n\n⚠️ Using fallback data (OpenAI API not configured)\n\nPreferences applied:\n• Learning Style: ${preferences.learning_style}\n• Study Time: ${preferences.study_time_preference}\n• Break Frequency: ${preferences.break_frequency}`;
        } else {
          message = `🤖 AI Generated ${response.study_plan.length} Personalized Study Suggestions!\n\nBased on:\n• ${planConfig.subjects.length} selected subjects\n• Your learning style: ${preferences.learning_style}\n• Preferred time: ${preferences.study_time_preference}\n• ${response.student_data?.performance_data_points || 0} performance data points\n• ${response.student_data?.upcoming_assignments_count || 0} upcoming assignments`;
        }
        
        alert(message)
        console.log('Study plan set successfully:', response.study_plan.length, 'items')
      } else {
        console.error('Invalid response format:', response)
        throw new Error('Invalid study plan format')
      }
    } catch (err) {
      console.error('Generate study plan error:', err)
      setError(err.message || 'Failed to generate study plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSavePreferences = async () => {
    try {
      await saveStudyPlanPreferences(preferences)
      console.log('Preferences saved successfully')
    } catch (err) {
      console.error('Failed to save preferences:', err)
    }
  }

  const handleConfigChange = (field, value) => {
    setPlanConfig(prev => ({ ...prev, [field]: value }))
  }

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }))
  }

  const toggleSubject = (subject) => {
    setPlanConfig(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  const handleAddToSchedule = (suggestion) => {
    // Check if already in schedule
    if (schedule.some(item => item.id === suggestion.id)) {
      alert('⚠️ This item is already in your schedule!')
      return
    }

    // Add to schedule with a timestamp
    const scheduleItem = {
      ...suggestion,
      addedAt: new Date().toISOString(),
      completed: false
    }
    
    setSchedule(prev => [...prev, scheduleItem])
    
    // Show success message
    alert(`✅ Added to Schedule!\n\n${suggestion.subject}: ${suggestion.topic}\nDuration: ${suggestion.duration}\nPriority: ${suggestion.priority}`)
    
    console.log('Added to schedule:', scheduleItem)
  }

  const handleRemoveFromSchedule = (itemId) => {
    setSchedule(prev => prev.filter(item => item.id !== itemId))
  }

  const handleToggleComplete = (itemId) => {
    setSchedule(prev => prev.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ))
  }

  const isInSchedule = (suggestionId) => {
    return schedule.some(item => item.id === suggestionId)
  }

  return (
    <>
      <div className="ai-header">
        <div className="ai-icon-large">🤖</div>
        <div>
          <h2>AI-Powered Study Planner</h2>
          <p>Personalized study recommendations based on your performance and upcoming deadlines</p>
        </div>
      </div>

      {/* Explainability Notice */}
      <div className="explainability-notice">
        <div className="notice-icon">ℹ️</div>
        <div className="notice-content">
          <h4>Transparent AI Recommendations</h4>
          <p>Each recommendation below is based on your academic profile, recent performance, and curriculum requirements. Click "Why this?" to see the detailed reasoning.</p>
        </div>
      </div>

      <div className="study-suggestions">
        {studyPlanSuggestions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            background: '#f7fafc',
            borderRadius: '0.75rem',
            border: '2px dashed #cbd5e0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>No Study Plan Yet</h3>
            <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
              Click "✨ Generate New Plan" below to create a personalized AI study plan
            </p>
            <button
              className="btn-primary-action"
              onClick={() => setShowConfigModal(true)}
              style={{ padding: '0.75rem 1.5rem' }}
            >
              ✨ Generate New Plan
            </button>
          </div>
        ) : (
          studyPlanSuggestions.map(suggestion => (
          <div key={suggestion.id} className="suggestion-card">
            <div className="suggestion-header">
              <span className={`priority-indicator ${suggestion.priority}`}></span>
              <h3>{suggestion.subject}: {suggestion.topic}</h3>
            </div>
            
            <p className="suggestion-reason">💡 {suggestion.reason}</p>
            
            <div className="suggestion-meta">
              <span className="meta-item">⏱️ {suggestion.duration}</span>
              <span className={`meta-badge ${suggestion.priority}`}>
                {suggestion.priority} priority
              </span>
            </div>

            {/* Explainability Section */}
            <div className="explainability-section">
              <button 
                className="btn-why-this"
                onClick={() => toggleExplanation(suggestion.id)}
              >
                {expandedSuggestion === suggestion.id ? '▼ Hide explanation' : '▶ Why this recommendation?'}
              </button>

              {expandedSuggestion === suggestion.id && (
                <div className="explanation-details">
                  <div className="explanation-header">
                    <h4>📊 Recommendation Reasoning</h4>
                  </div>

                  {/* Evidence from Profile */}
                  <div className="evidence-section">
                    <h5>📈 Based on Your Profile:</h5>
                    <ul className="evidence-list">
                      {suggestion.profileEvidence && suggestion.profileEvidence.map((evidence, index) => (
                        <li key={index} className="evidence-item">
                          <span className="evidence-icon">✓</span>
                          <span className="evidence-text">{evidence}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Curriculum Rules */}
                  <div className="evidence-section">
                    <h5>📚 Curriculum Requirements:</h5>
                    <ul className="evidence-list">
                      {suggestion.curriculumRules && suggestion.curriculumRules.map((rule, index) => (
                        <li key={index} className="evidence-item">
                          <span className="evidence-icon">📋</span>
                          <span className="evidence-text">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Performance Data */}
                  {suggestion.performanceData && (
                    <div className="evidence-section">
                      <h5>📊 Recent Performance:</h5>
                      <div className="performance-metrics">
                        {suggestion.performanceData.map((metric, index) => (
                          <div key={index} className="metric-item">
                            <span className="metric-label">{metric.label}:</span>
                            <span className="metric-value" style={{ color: metric.color }}>
                              {metric.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expected Outcome */}
                  {suggestion.expectedOutcome && (
                    <div className="evidence-section outcome-section">
                      <h5>🎯 Expected Outcome:</h5>
                      <p className="outcome-text">{suggestion.expectedOutcome}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isInSchedule(suggestion.id) ? (
              <button 
                className="btn-suggestion-action"
                style={{ background: '#48bb78', color: 'white', cursor: 'default' }}
                disabled
              >
                ✅ Added to Schedule
              </button>
            ) : (
              <button 
                className="btn-suggestion-action"
                onClick={() => handleAddToSchedule(suggestion)}
              >
                📅 Add to Schedule
              </button>
            )}
          </div>
          ))
        )}
      </div>

      <section className="dashboard-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Study Schedule ({schedule.length} {schedule.length === 1 ? 'item' : 'items'})</h3>
          <button 
            className="btn-primary-action"
            onClick={() => setShowConfigModal(true)}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            ✨ Generate New Plan
          </button>
        </div>

        {schedule.length === 0 ? (
        <div className="schedule-placeholder">
          <div className="placeholder-icon">📅</div>
            <p>Your study schedule is empty</p>
            <p style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
              Add items from the study suggestions above by clicking "📅 Add to Schedule"
            </p>
          </div>
        ) : (
          <div className="schedule-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {schedule.map((item, index) => (
              <div 
                key={item.id} 
                className="schedule-item"
                style={{
                  padding: '2rem',
                  background: item.completed ? 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: item.completed ? '2px solid #cbd5e0' : '2px solid #e2e8f0',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  borderLeft: `5px solid ${item.priority === 'high' ? '#f56565' : item.priority === 'medium' ? '#ed8936' : '#48bb78'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span 
                        className={`priority-indicator ${item.priority}`}
                        style={{ width: '8px', height: '8px', borderRadius: '50%' }}
                      ></span>
                      <h4 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: '600', 
                        textDecoration: item.completed ? 'line-through' : 'none',
                        color: item.completed ? '#718096' : '#1a202c'
                      }}>
                        {item.subject}: {item.topic}
                      </h4>
                    </div>
                    
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: '#718096', 
                      marginBottom: '0.75rem' 
                    }}>
                      💡 {item.reason}
                    </p>
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      fontSize: '0.875rem',
                      color: '#4a5568'
                    }}>
                      <span>⏱️ {item.duration}</span>
                      <span className={`meta-badge ${item.priority}`}>
                        {item.priority} priority
                      </span>
                    </div>

                    {/* Study Activities */}
                    {item.study_activities && item.study_activities.length > 0 && (
                      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f7fafc', borderRadius: '0.5rem' }}>
                        <h5 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                          📋 Study Activities:
                        </h5>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem', color: '#4a5568' }}>
                          {item.study_activities.map((activity, idx) => (
                            <li key={idx} style={{ marginBottom: '0.25rem' }}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '120px' }}>
                    <button
                      onClick={() => handleToggleComplete(item.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        background: item.completed ? '#48bb78' : 'white',
                        color: item.completed ? 'white' : '#4a5568',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      {item.completed ? '✅ Completed' : '⬜ Mark Complete'}
                    </button>
                    <button
                      onClick={() => handleRemoveFromSchedule(item.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #feb2b2',
                        borderRadius: '0.5rem',
                        background: 'white',
                        color: '#c53030',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        )}
      </section>

      {/* Study Plan Configuration Modal */}
      {showConfigModal && (
        <div className="modal-overlay" onClick={() => setShowConfigModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✨ Generate AI Study Plan</h3>
              <button className="btn-close-modal" onClick={() => setShowConfigModal(false)}>
                ✕
              </button>
            </div>

            {error && (
              <div className="error-message" style={{ margin: '1rem 0', padding: '1rem', background: '#fed7d7', color: '#c53030', borderRadius: '0.5rem' }}>
                {error}
              </div>
            )}

            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Subject Selection */}
              <div className="form-section">
                <h4>Select Your Subjects</h4>
                <div className="subject-checkboxes" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {['Mathematics Advanced', 'English Advanced', 'Physics', 'Chemistry', 'Biology', 'Economics'].map(subject => (
                    <label key={subject} className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={planConfig.subjects.includes(subject)}
                        onChange={() => toggleSubject(subject)}
                      />
                      <span>{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Available Hours */}
              <div className="form-section" style={{ marginTop: '1.5rem' }}>
                <h4>Available Study Hours Per Week</h4>
                <input
                  type="number"
                  min="5"
                  max="40"
                  value={planConfig.available_hours_per_week}
                  onChange={(e) => handleConfigChange('available_hours_per_week', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', marginTop: '0.5rem' }}
                />
                <p style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>
                  Recommended: 15-25 hours per week
                </p>
              </div>

              {/* Learning Preferences */}
              <div className="form-section" style={{ marginTop: '1.5rem' }}>
                <h4>Learning Preferences</h4>
                
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Learning Style</label>
                  <select
                    value={preferences.learning_style}
                    onChange={(e) => handlePreferenceChange('learning_style', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                  >
                    <option value="visual">Visual (diagrams, charts, videos)</option>
                    <option value="auditory">Auditory (lectures, discussions)</option>
                    <option value="kinesthetic">Kinesthetic (hands-on, practice)</option>
                  </select>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Preferred Study Time</label>
                  <select
                    value={preferences.study_time_preference}
                    onChange={(e) => handlePreferenceChange('study_time_preference', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Break Frequency</label>
                  <select
                    value={preferences.break_frequency}
                    onChange={(e) => handlePreferenceChange('break_frequency', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                  >
                    <option value="every_30min">Every 30 minutes</option>
                    <option value="every_hour">Every hour</option>
                    <option value="every_90min">Every 90 minutes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                onClick={handleSavePreferences}
                style={{ padding: '0.75rem 1.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', background: 'white' }}
              >
                Save Preferences
              </button>
              <button
                className="btn-primary-action"
                onClick={handleGenerateStudyPlan}
                disabled={loading || planConfig.subjects.length === 0}
                style={{ padding: '0.75rem 1.5rem', opacity: (loading || planConfig.subjects.length === 0) ? 0.5 : 1 }}
              >
                {loading ? '⏳ Generating...' : '✨ Generate Study Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default StudyPlannerView

