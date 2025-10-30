import { useState } from 'react'
import { generateCourseRecommendation } from '../../services/courseService'

function HSCSubjectRecommendation() {
  const [interestInput, setInterestInput] = useState('')
  const [generated, setGenerated] = useState(false)
  const [notification, setNotification] = useState(null)
  const [apiResults, setApiResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setError('')
    setLoading(true)
    try {
      const prompt = `Student interests: ${interestInput || 'general interests'}\nPlease recommend HSC subjects with brief reasoning in the specified JSON format.`
      const response = await generateCourseRecommendation({ prompt})
      setApiResults(Array.isArray(response) ? response : [])
      setGenerated(true)
      setNotification({ type: 'success', message: 'Recommendations generated based on your interests.' })
      setTimeout(() => setNotification(null), 3000)
    } catch (e) {
      setError(e?.message || 'Failed to generate recommendations')
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Low': return '#48bb78'
      case 'Medium': return '#ed8936'
      case 'High': return '#f56565'
      case 'Very High': return '#c53030'
      case 'Extreme': return '#742a2a'
      default: return '#718096'
    }
  }

  return (
    <div className="hsc-subjects-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="notification-icon">
            {notification.type === 'success' ? '✅' : 'ℹ️'}
          </span>
          <span className="notification-message">{notification.message}</span>
          <button className="notification-close" onClick={() => setNotification(null)}>
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="subjects-header">
        <div className="header-content">
          <h2>HSC Subject Recommendation</h2>
          <p>Tell us your interests and we’ll suggest subjects that fit you.</p>
        </div>
      </div>

      {/* Input row */}
      <div className="search-filters-section">
        <div className="filters-row">
          <div className="filter-group" style={{ flex: 2 }}>
            <label>Interests</label>
            <input
              type="text"
              className="search-input"
              placeholder="e.g., software, health, design, business, environment"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
            />
          </div>
          <div className="filter-group" style={{ width: '240px' }}>
            <label style={{ visibility: 'hidden' }}>Generate</label>
            <button className="btn-primary" style={{ width: '100%' }} onClick={handleGenerate} disabled={loading}>
              {loading ? 'Generating…' : '✨ Generate Recommendation'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-text" style={{ marginTop: '0.5rem' }}>{error}</div>
      )}

      {/* Results Summary */}
      {generated && (
        <div className="results-summary">
          <p>Showing {apiResults.length} recommended subjects</p>
        </div>
      )}

      {/* Subjects Grid */}
      <div className="subjects-grid">
        {(generated ? apiResults : []).map(item => {
          const name = item.recommend_subject || item['Recommend course'] || item.name || 'Recommended Subject';
          const code = item.code || (name ? name.slice(0, 6).toUpperCase() : 'SUBJ');
          const category = item.category || '—';
          const units = item.units || 2;
          const difficulty = item.difficulty || 'Medium';
          const description = item.description || item.reasoning || item.Reasoning || 'Recommended by AI based on your interests.';
          const atarContribution = item.atarContribution || '—';
          const examType = item.examType || '—';
          const practicalWork = item.practicalWork || '—';
          const popularity = item.popularity;
          const recommendedFor = item.recommendedFor || [];
          const careerPaths = item.careerPaths || [];
          return (
            <div key={code + name} className="subject-card">
              <div className="subject-header">
                <div className="subject-title">
                  <h3>{name}</h3>
                </div>
                <div className="subject-badges">
                <span className="category-tag">{category}</span>
                  <span className="units-badge">{units} units</span>
                </div>
              </div>

              {/* Clearly separated, highlighted Reason label and content as two distinct areas */}
              {(item.reasoning || item.Reasoning) && (
                <div style={{ margin: '0.8rem 0 2.2rem 0' }}>
                  <div className="reason-label" style={{
                    display: 'inline-flex', alignItems: 'center', fontWeight: 800, fontSize: '0.9rem',
                    color: '#205389', background: '#c7e8f3', borderRadius: '0.9em', padding: '0.31em 1.1em', boxShadow: '0 1px 5px #bad2ff40', marginBottom: '0.95em',
                  }}>
                    <span className="reason-icon" style={{ fontSize: '0.8em', marginRight: '0.48em' }}>💡</span>
                    Reason
                  </div>
                  <div className="reason-area" style={{
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(90deg, #e0ecfe 70%, #ffe7cf 100%)',
                    borderRadius: '1.4rem',
                    boxShadow: '0 4px 18px #b4cafa40',
                    border: '2px solid #7ab2f7',
                    fontSize: '1.25rem', fontWeight: 700, color: '#12528f',
                  }}>{item.reasoning || item.Reasoning}</div>
                </div>
              )}

              {/* All other details below, not grouped with Reason section */}
              <p className="subject-description">{description}</p>

              {/* Detail grid */}
              <div className="subject-details">
                <div className="detail-row">
                  <span className="detail-label">ATAR Contribution:</span>
                  <span className="detail-value atar-contribution">{atarContribution}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Exam Type:</span>
                  <span className="detail-value">{examType}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Practical Work:</span>
                  <span className="detail-value">{practicalWork}</span>
                </div>
              </div>

              {/* Popularity Bar */}
              {typeof popularity === 'number' && (
                <div className="subject-footer">
                  <div className="popularity-indicator">
                    <span className="popularity-label">Popularity:</span>
                    <div className="popularity-bar">
                      <div
                        className="popularity-fill"
                        style={{ width: `${popularity}%` }}
                      ></div>
                    </div>
                    <span className="popularity-value">{popularity}%</span>
                  </div>
                </div>
              )}

              {/* Career Paths */}
              {careerPaths.length > 0 && (
                <div className="career-paths">
                  <span className="career-label">Career Paths:</span>
                  <div className="career-tags">
                    {careerPaths.map((path, index) => (
                      <span key={index} className="career-tag">{path}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended for */}
              {recommendedFor.length > 0 && (
                <div className="recommended-for">
                  <span className="recommended-label">Recommended for:</span>
                  <ul className="recommended-list">
                    {recommendedFor.slice(0, 3).map((item, index) => (
                      <li key={index}><span className="check-icon">✓</span>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {generated && apiResults.length === 0 && (
        <div className="no-results">
          <h3>No recommended subjects returned</h3>
          <p>Try different interest keywords or broaden your input.</p>
        </div>
      )}
    </div>
  )
}

export default HSCSubjectRecommendation
