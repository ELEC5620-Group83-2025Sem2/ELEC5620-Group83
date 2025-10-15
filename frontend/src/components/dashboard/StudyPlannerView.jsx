function StudyPlannerView({ studyPlanSuggestions }) {
  return (
    <>
      <div className="ai-header">
        <div className="ai-icon-large">🤖</div>
        <div>
          <h2>AI-Powered Study Planner</h2>
          <p>Personalized study recommendations based on your performance and upcoming deadlines</p>
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

