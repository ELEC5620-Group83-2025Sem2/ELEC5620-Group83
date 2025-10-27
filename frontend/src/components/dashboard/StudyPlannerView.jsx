import { useState } from 'react'

function StudyPlannerView({ studyPlanSuggestions }) {
  const [expandedSuggestion, setExpandedSuggestion] = useState(null)

  const toggleExplanation = (id) => {
    setExpandedSuggestion(expandedSuggestion === id ? null : id)
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
        {studyPlanSuggestions.map(suggestion => (
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

            <button className="btn-suggestion-action">Add to Schedule</button>
          </div>
        ))}
      </div>

      <section className="dashboard-section">
        <h3>Study Schedule</h3>
        <div className="schedule-placeholder">
          <div className="placeholder-icon">📅</div>
          <p>Your personalized study schedule will appear here</p>
          <button className="btn-primary-action">Generate Study Plan</button>
        </div>
      </section>
    </>
  )
}

export default StudyPlannerView

