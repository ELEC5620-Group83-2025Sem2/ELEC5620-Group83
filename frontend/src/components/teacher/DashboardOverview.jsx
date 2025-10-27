import {
  teacherData,
  teacherClasses,
  getTotalStudents,
  getPendingGradingCount,
  getTodayClasses,
  getOverallPerformance,
  recentActivity
} from './teacherMockData'

function DashboardOverview({ onTabChange, onClassClick, onCreateAssignment }) {
  const totalStudents = getTotalStudents()
  const pendingGrading = getPendingGradingCount()
  const todayClasses = getTodayClasses()
  const overallPerformance = getOverallPerformance()

  return (
    <>
      {/* Welcome Section */}
      <div className="welcome-section">
        <h2>Welcome back, {teacherData.name}! 👋</h2>
        <p>Here's what's happening with your classes today.</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#667eea20', color: '#667eea' }}>👥</div>
          <div className="stat-info">
            <p className="stat-value">{totalStudents}</p>
            <p className="stat-label">Total Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f5656520', color: '#f56565' }}>📝</div>
          <div className="stat-info">
            <p className="stat-value">{pendingGrading}</p>
            <p className="stat-label">Pending Grading</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#48bb7820', color: '#48bb78' }}>📚</div>
          <div className="stat-info">
            <p className="stat-value">{todayClasses.length}</p>
            <p className="stat-label">Classes Today</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ed893620', color: '#ed8936' }}>📊</div>
          <div className="stat-info">
            <p className="stat-value">{overallPerformance}%</p>
            <p className="stat-label">Avg Performance</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Today's Classes */}
        <section className="dashboard-section">
          <div className="section-header">
            <h3>Today's Classes</h3>
            <button className="btn-link" onClick={() => onTabChange('classes')}>View All</button>
          </div>
          {todayClasses.length > 0 ? (
            <div className="classes-list">
              {todayClasses.map(classItem => (
                <div
                  key={classItem.id}
                  className="class-card"
                  style={{ borderLeft: `4px solid ${classItem.color}` }}
                  onClick={() => onClassClick(classItem.id)}
                >
                  <div className="class-header">
                    <div>
                      <h4>{classItem.name}</h4>
                      <p className="class-code">{classItem.code}</p>
                    </div>
                    <span className="class-badge" style={{ background: `${classItem.color}20`, color: classItem.color }}>
                      {classItem.studentsCount} students
                    </span>
                  </div>
                  <div className="class-schedule-info">
                    {classItem.schedule
                      .filter(s => s.day === new Date().toLocaleDateString('en-US', { weekday: 'long' }))
                      .map((session, idx) => (
                        <div key={idx} className="schedule-item-small">
                          <span className="schedule-icon">🕐</span>
                          <span>{session.time}</span>
                          <span className="schedule-location">{session.location}</span>
                        </div>
                      ))
                    }
                  </div>
                  {classItem.pendingGrading > 0 && (
                    <div className="pending-alert">
                      ⚠️ {classItem.pendingGrading} submissions pending grading
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No classes scheduled for today</p>
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section className="dashboard-section">
          <div className="section-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-info">
                  {activity.student && (
                    <p className="activity-text">
                      <strong>{activity.student}</strong> {activity.action} <em>{activity.item}</em>
                    </p>
                  )}
                  {!activity.student && (
                    <p className="activity-text">
                      You {activity.action} <em>{activity.item}</em>
                    </p>
                  )}
                  <p className="activity-meta">
                    {activity.class} • {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <section className="dashboard-section">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          <button className="action-card" onClick={onCreateAssignment}>
            <span className="action-icon">➕</span>
            <div>
              <h4>Create Assignment</h4>
              <p>Create a new assignment or quiz</p>
            </div>
          </button>
          <button className="action-card" onClick={() => onTabChange('announcements')}>
            <span className="action-icon">📢</span>
            <div>
              <h4>Post Announcement</h4>
              <p>Announce to one or all classes</p>
            </div>
          </button>
          <button className="action-card" onClick={() => onTabChange('assignments')}>
            <span className="action-icon">✅</span>
            <div>
              <h4>Grade Submissions</h4>
              <p>{pendingGrading} pending submissions</p>
            </div>
          </button>
          <button className="action-card" onClick={() => onTabChange('analytics')}>
            <span className="action-icon">📊</span>
            <div>
              <h4>View Analytics</h4>
              <p>Class performance insights</p>
            </div>
          </button>
        </div>
      </section>

      {/* My Classes Overview */}
      <section className="dashboard-section">
        <div className="section-header">
          <h3>My Classes</h3>
          <button className="btn-link" onClick={() => onTabChange('classes')}>View All</button>
        </div>
        <div className="classes-grid-compact">
          {teacherClasses.map(classItem => (
            <div
              key={classItem.id}
              className="class-card-compact"
              style={{ borderTop: `4px solid ${classItem.color}` }}
              onClick={() => onClassClick(classItem.id)}
            >
              <h4>{classItem.name}</h4>
              <p className="class-code">{classItem.code}</p>
              <div className="class-stats-compact">
                <span>👥 {classItem.studentsCount}</span>
                <span>📊 {classItem.averageGrade}</span>
                <span>📝 {classItem.upcomingAssignments} due</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default DashboardOverview

