import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateCareerPathway } from '../../services/careerService'
import { enrolledClasses, recentGrades } from './mockData'

function CareerView({ careerRecommendations = [] }) {
  const navigate = useNavigate()
  const [interests, setInterests] = useState('')
  const [strengths, setStrengths] = useState('')
  const [goals, setGoals] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [careerData, setCareerData] = useState(null)

  const prompt = useMemo(() => {
    const subjects = enrolledClasses.map(c => c.name).join(', ')
    const grades = recentGrades.map(g => `${g.class}: ${g.score}/${g.maxScore}`).join('; ')
    return (
      `Student interests: ${interests}\n` +
      `Strengths: ${strengths}\n` +
      `Goals: ${goals}\n` +
      `Current subjects: ${subjects}\n` +
      `Recent performance: ${grades}`
    )
  }, [interests, strengths, goals])

  const mappedCards = useMemo(() => {
    if (careerData?.career_pathways?.length) {
      return careerData.career_pathways.map((p, i) => ({
        id: i + 1,
        career: p.title,
        match: 100, // neutral full ring for now
        reason: interests ? `Aligned with your interests: ${interests}` : 'Recommended by AI analysis',
        averageSalary: p.salary_range?.[0] || '—',
        growthRate: p['job growth'] || '—'
      }))
    }
    // Handle both old array format and new object format for backward compatibility
    if (Array.isArray(careerRecommendations)) {
      return careerRecommendations
    }
    if (careerRecommendations?.career_pathways?.length) {
      return careerRecommendations.career_pathways.map((p, i) => ({
        id: i + 1,
        career: p.title,
        match: 100,
        reason: 'Based on your academic profile and interests',
        averageSalary: p.salary_range?.[0] || '—',
        growthRate: p['job growth'] || '—'
      }))
    }
    return []
  }, [careerData, interests, careerRecommendations])

  const onGenerate = async () => {
    setError('')
    setLoading(true)
    try {
      const data = await generateCareerPathway({ prompt })
      setCareerData(data)
    } catch (e) {
      setError(e.message || 'Failed to generate career pathway')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="ai-header">
        <div className="ai-icon-large">🎯</div>
        <div>
          <h2>AI Career Recommendations</h2>
          <p>Discover career paths that match your strengths and interests</p>
        </div>
      </div>

      <div className="ai-input-row">
        <input
          type="text"
          className="ai-input"
          placeholder="Interests (e.g., design, coding, health)"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
        />
        <input
          type="text"
          className="ai-input"
          placeholder="Strengths (e.g., problem-solving, creativity)"
          value={strengths}
          onChange={(e) => setStrengths(e.target.value)}
        />
        <input
          type="text"
          className="ai-input"
          placeholder="Goals (e.g., enter design degree, start apprenticeship)"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
        />
        <button className="btn-primary" onClick={onGenerate} disabled={loading}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="spinner"></span>
              Generating…
            </span>
          ) : (
            '✨ Generate Career Path'
          )}
        </button>
      </div>

      {error && <div className="error-text">{error}</div>}

      <div className="career-recommendations">
        {mappedCards.map((career, idx) => (
          <div key={career.id || idx} className="career-card">
            <div className="career-match">
              <div className="match-circle">
                <svg className="match-progress" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#667eea"
                    strokeWidth="10"
                    strokeDasharray={`${(career.match || 100) * 2.827} 282.7`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="match-percentage">{career.match || 100}%</div>
              </div>
            </div>
            <div className="career-info">
              <h3>{career.career}</h3>
              {career.reason && <p className="career-reason">✨ {career.reason}</p>}
              <div className="career-details">
                <div className="career-detail-item">
                  <span className="detail-label">Salary Range</span>
                  <span className="detail-value">{career.averageSalary}</span>
                </div>
                <div className="career-detail-item">
                  <span className="detail-label">Job Growth</span>
                  <span className="detail-value growth">{career.growthRate}</span>
                </div>
              </div>
              <button
                className="btn-career-action"
                onClick={() => {
                  if (careerData) {
                    navigate('/student/career-details', {
                      state: { careerData, selectedPathwayIndex: idx }
                    })
                  }
                }}
                disabled={!careerData}
                title={!careerData ? 'Generate to see full details' : 'View details'}
              >
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="dashboard-section">
        <h3>Career Resources</h3>
        <div className="resources-grid">
          <div className="resource-card">
            <span className="resource-icon">📚</span>
            <h4>Career Guides</h4>
            <p>Explore detailed guides for different career paths</p>
          </div>
          <div className="resource-card">
            <span className="resource-icon">🎓</span>
            <h4>University Pathways</h4>
            <p>Find the right courses for your career goals</p>
          </div>
          <div className="resource-card">
            <span className="resource-icon">💼</span>
            <h4>Industry Insights</h4>
            <p>Stay updated with industry trends and opportunities</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default CareerView

