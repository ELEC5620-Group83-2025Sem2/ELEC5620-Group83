import { useNavigate, useLocation } from 'react-router-dom'
import './CareerDetailPage.css'

function CareerDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { careerData, selectedPathwayIndex = 0 } = location.state || {}

  if (!careerData) {
    return (
      <div className="career-detail-page">
        <div className="career-detail-header">
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← Back to Career View
          </button>
        </div>
        <div className="error-state">
          <p>No career data available. Please generate career recommendations first.</p>
        </div>
      </div>
    )
  }

  const pathway = careerData.career_pathways?.[selectedPathwayIndex] || null
  const subjects = careerData.recommended_subjects || []
  const action = careerData.action_plan || {}
  const resources = careerData.resources || []

  return (
    <div className="career-detail-page">
      <div className="career-detail-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Back to Career View
        </button>
      </div>

      <div className="career-detail-container">
        {pathway && (
          <section className="career-main-section">
            <div className="career-title-card">
              <h1>{pathway.title}</h1>
              <div className="career-meta">
                <div className="meta-item">
                  <span className="meta-label">💼 Salary Range</span>
                  <span className="meta-value">{pathway.salary_range?.[0] || 'Not specified'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">📈 Job Growth</span>
                  <span className={`meta-value growth-${pathway['job growth']?.toLowerCase().replace(' ', '-') || 'unknown'}`}>
                    {pathway['job growth'] || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>

            {Array.isArray(pathway.example_roles) && pathway.example_roles.length > 0 && (
              <div className="career-section">
                <h2 className="section-title">
                  <span className="title-icon">🎯</span>
                  Example Roles
                </h2>
                <div className="roles-grid">
                  {pathway.example_roles.map((role, idx) => (
                    <div key={idx} className="role-badge">{role}</div>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(pathway.entry_routes) && pathway.entry_routes.length > 0 && (
              <div className="career-section">
                <h2 className="section-title">
                  <span className="title-icon">🎓</span>
                  Entry Routes
                </h2>
                <div className="routes-grid">
                  {pathway.entry_routes.map((route, idx) => (
                    <div key={idx} className="route-card">
                      <h3 className="route-type">{route.route}</h3>
                      {Array.isArray(route.example_degrees) && (
                        <div className="route-detail">
                          <strong>Degrees:</strong>
                          <ul className="detail-list">
                            {route.example_degrees.map((deg, i) => <li key={i}>{deg}</li>)}
                          </ul>
                        </div>
                      )}
                      {Array.isArray(route.example_certificates) && (
                        <div className="route-detail">
                          <strong>Certificates:</strong>
                          <ul className="detail-list">
                            {route.example_certificates.map((cert, i) => <li key={i}>{cert}</li>)}
                          </ul>
                        </div>
                      )}
                      {Array.isArray(route.prerequisites_or_assumed) && (
                        <div className="route-detail">
                          <strong>Prerequisites:</strong>
                          <ul className="detail-list">
                            {route.prerequisites_or_assumed.map((prereq, i) => <li key={i}>{prereq}</li>)}
                          </ul>
                        </div>
                      )}
                      {route.notes && (
                        <div className="route-note">
                          <strong>📝 Note:</strong> {route.notes}
                        </div>
                      )}
                      {route.pathway_to_uni && (
                        <div className="route-pathway">
                          <strong>🔄 Pathway to University:</strong> {route.pathway_to_uni}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(pathway.skills_to_build) && pathway.skills_to_build.length > 0 && (
              <div className="career-section">
                <h2 className="section-title">
                  <span className="title-icon">🛠️</span>
                  Skills to Build
                </h2>
                <div className="skills-list">
                  {pathway.skills_to_build.map((skill, idx) => (
                    <div key={idx} className="skill-item">
                      <span className="skill-icon">✓</span>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(pathway.suggested_experiences) && pathway.suggested_experiences.length > 0 && (
              <div className="career-section">
                <h2 className="section-title">
                  <span className="title-icon">🌟</span>
                  Suggested Experiences
                </h2>
                <div className="experiences-list">
                  {pathway.suggested_experiences.map((exp, idx) => (
                    <div key={idx} className="experience-item">
                      <span className="experience-icon">✨</span>
                      {exp}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <section className="career-sidebar">
          {subjects.length > 0 && (
            <div className="sidebar-section">
              <h3 className="sidebar-title">
                <span className="title-icon">📚</span>
                Recommended HSC Subjects
              </h3>
              <div className="subjects-list">
                {subjects.map((subject, idx) => (
                  <div key={idx} className="subject-card">
                    <h4>{subject.subject}</h4>
                    <p>{subject.why}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <span className="title-icon">📋</span>
              Action Plan
            </h3>
            <div className="action-plan">
              <div className="action-item">
                <h4 className="action-period">Near Term (1-3 months)</h4>
                <ul className="action-tasks">
                  {(action.near_term_1_3_months || []).map((task, idx) => (
                    <li key={idx} className="task-item">
                      <span className="task-bullet">⏰</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="action-item">
                <h4 className="action-period">Mid Term (This Year)</h4>
                <ul className="action-tasks">
                  {(action.mid_term_this_year || []).map((task, idx) => (
                    <li key={idx} className="task-item">
                      <span className="task-bullet">📅</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="action-item">
                <h4 className="action-period">Long Term (Post School)</h4>
                <ul className="action-tasks">
                  {(action.long_term_post_school || []).map((task, idx) => (
                    <li key={idx} className="task-item">
                      <span className="task-bullet">🎯</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {resources.length > 0 && (
            <div className="sidebar-section">
              <h3 className="sidebar-title">
                <span className="title-icon">🔗</span>
                Resources
              </h3>
              <div className="resources-list">
                {resources.map((resource, idx) => (
                  <div key={idx} className="resource-item">
                    <h4>{resource.name}</h4>
                    <p>{resource.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default CareerDetailPage

