function CareerView({ careerRecommendations }) {
  return (
    <>
      <div className="ai-header">
        <div className="ai-icon-large">🎯</div>
        <div>
          <h2>AI Career Recommendations</h2>
          <p>Discover career paths that match your strengths and interests</p>
        </div>
      </div>

      <div className="career-recommendations">
        {careerRecommendations.map(career => (
          <div key={career.id} className="career-card">
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
                    strokeDasharray={`${career.match * 2.827} 282.7`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="match-percentage">{career.match}%</div>
              </div>
            </div>
            <div className="career-info">
              <h3>{career.career}</h3>
              <p className="career-reason">✨ {career.reason}</p>
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
              <button className="btn-career-action">Learn More</button>
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

