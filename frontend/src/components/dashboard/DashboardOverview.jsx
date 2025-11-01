// Helper function to calculate days until due
function getDaysUntilDue(dueDate) {
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = due - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'Overdue'
  if (diffDays === 0) return 'Due today'
  if (diffDays === 1) return 'Due tomorrow'
  return `Due in ${diffDays} days`
}

function DashboardOverview({ dashboardData, userProfile, enrolledClasses = [], upcomingAssignments = [], recentGrades = [], onTabChange }) {
  const displayName = userProfile?.first_name && userProfile?.last_name 
    ? `${userProfile.first_name} ${userProfile.last_name}` 
    : userProfile?.name || ''

  // Calculate average grade letter
  const getAverageGradeLetter = (avg) => {
    if (!avg) return 'N/A'
    if (avg >= 90) return 'A+'
    if (avg >= 85) return 'A'
    if (avg >= 80) return 'A-'
    if (avg >= 75) return 'B+'
    if (avg >= 70) return 'B'
    if (avg >= 65) return 'B-'
    if (avg >= 60) return 'C+'
    if (avg >= 55) return 'C'
    return 'D'
  }

  return (
    <>
      <div className="welcome-section">
        <h2>Welcome back, {displayName}! 👋</h2>
        <p>Here's what's happening with your studies today.</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#667eea20', color: '#667eea' }}>📚</div>
          <div className="stat-info">
            <p className="stat-value">{enrolledClasses.length || 0}</p>
            <p className="stat-label">Enrolled Classes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f5656520', color: '#f56565' }}>📝</div>
          <div className="stat-info">
            <p className="stat-value">{upcomingAssignments.length || 0}</p>
            <p className="stat-label">Pending Assignments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#48bb7820', color: '#48bb78' }}>📈</div>
          <div className="stat-info">
            <p className="stat-value">{getAverageGradeLetter(dashboardData?.averageGrade)}</p>
            <p className="stat-label">Overall Average</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ed893620', color: '#ed8936' }}>🎯</div>
          <div className="stat-info">
            <p className="stat-value">{dashboardData?.completionRate || 0}%</p>
            <p className="stat-label">Completion Rate</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Enrolled Classes */}
        <section className="dashboard-section">
          <div className="section-header">
            <h3>My Classes</h3>
            <button className="btn-link" onClick={() => onTabChange('classes')}>View All</button>
          </div>
          <div className="classes-list">
            {enrolledClasses.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>
                <p>No classes enrolled yet</p>
              </div>
            ) : (
              enrolledClasses.slice(0, 2).map(course => (
                <div key={course.id} className="class-card" style={{ borderLeft: `4px solid ${course.color}` }}>
                  <div className="class-header">
                    <div>
                      <h4>{course.name}</h4>
                      <p className="class-code">{course.code} • {course.teacher}</p>
                    </div>
                    <span className="class-grade" style={{ background: `${course.color}20`, color: course.color }}>
                      {course.grade}
                    </span>
                  </div>
                  <div className="class-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${course.progress}%`, background: course.color }}
                      ></div>
                    </div>
                    <span className="progress-text">{course.progress}% Complete</span>
                  </div>
                  <div className="class-footer">
                    <span className="class-next">Next: {course.nextClass}</span>
                    {course.assignments > 0 && (
                      <span className="class-assignments">{course.assignments} pending</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Upcoming Assignments */}
        <section className="dashboard-section">
          <div className="section-header">
            <h3>Upcoming Assignments</h3>
            <button className="btn-link" onClick={() => onTabChange('assignments')}>View All</button>
          </div>
          <div className="assignments-list">
            {upcomingAssignments.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>
                <p>No upcoming assignments</p>
              </div>
            ) : (
              upcomingAssignments.slice(0, 5).map(assignment => (
                <div key={assignment.id} className="assignment-item">
                  <div className="assignment-info">
                    <h4>{assignment.title}</h4>
                    <p className="assignment-class">{assignment.class}</p>
                  </div>
                  <div className="assignment-due">
                    <span className={`due-badge ${assignment.priority}`}>
                      {getDaysUntilDue(assignment.dueDate)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Recent Grades */}
      <section className="dashboard-section">
        <div className="section-header">
          <h3>Recent Grades</h3>
          <button className="btn-link" onClick={() => onTabChange('grades')}>View All</button>
        </div>
        <div className="grades-table">
          {recentGrades.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>
              <p>No grades available yet</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Class</th>
                  <th>Score</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {recentGrades.map((grade, index) => (
                  <tr key={index}>
                    <td>{grade.assignment}</td>
                    <td>{grade.class}</td>
                    <td>{grade.score}/{grade.maxScore}</td>
                    <td><span className="grade-badge">{grade.grade}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  )
}

export default DashboardOverview

