import { useState } from 'react'
import {
  getClassById,
  getClassAssignments,
  getClassStudents,
  classAnalytics,
  announcements
} from './teacherMockData'

function ClassDetailView({ classId, onBack, onCreateAssignment }) {
  const [activeTab, setActiveTab] = useState('overview')
  const classData = getClassById(classId)
  const classAssignments = getClassAssignments(classId)
  const classStudents = getClassStudents(classId)
  const analytics = classAnalytics[classId]
  const classAnnouncements = announcements.filter(a => a.classId === classId)

  if (!classData) {
    return (
      <div className="class-detail-page">
        <button className="btn-back" onClick={onBack}>
          ← Back to Classes
        </button>
        <p>Class not found</p>
      </div>
    )
  }

  return (
    <div className="class-detail-page">
      {/* Header */}
      <div className="detail-page-header">
        <button className="btn-back" onClick={onBack}>
          ← Back to Classes
        </button>
        
        <div className="class-detail-hero" style={{ borderLeft: `6px solid ${classData.color}` }}>
          <div className="class-detail-info">
            <div className="class-icon-large" style={{ background: `${classData.color}20`, color: classData.color }}>
              📚
            </div>
            <div>
              <h1 className="class-detail-title">{classData.name}</h1>
              <p className="class-detail-code">{classData.code}</p>
              <p className="class-detail-period">{classData.period}</p>
            </div>
          </div>
          <div className="class-detail-stats-row">
            <div className="stat-box">
              <span className="stat-label">Students</span>
              <span className="stat-value-large" style={{ color: classData.color }}>
                {classData.studentsCount}
              </span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Avg Grade</span>
              <span className="stat-value-large" style={{ color: classData.color }}>
                {classData.averageGrade}
              </span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Attendance</span>
              <span className="stat-value-large" style={{ color: classData.color }}>
                {analytics.attendanceRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="detail-tabs">
        <button
          className={`detail-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`detail-tab ${activeTab === 'roster' ? 'active' : ''}`}
          onClick={() => setActiveTab('roster')}
        >
          Student Roster
        </button>
        <button
          className={`detail-tab ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </button>
        <button
          className={`detail-tab ${activeTab === 'gradebook' ? 'active' : ''}`}
          onClick={() => setActiveTab('gradebook')}
        >
          Gradebook
        </button>
        <button
          className={`detail-tab ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          Announcements
        </button>
        <button
          className={`detail-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {/* Content Sections */}
      <div className="detail-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="detail-card">
              <h2>Course Description</h2>
              <p>{classData.description}</p>
            </div>

            <div className="detail-card">
              <h2>Class Schedule</h2>
              <div className="schedule-list">
                {classData.schedule.map((session, index) => (
                  <div key={index} className="schedule-item">
                    <div className="schedule-day">{session.day}</div>
                    <div className="schedule-details">
                      <span className="schedule-time">{session.time}</span>
                      <span className="schedule-location">{session.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-card">
              <h2>Quick Stats</h2>
              <div className="stats-grid-detail">
                <div className="stat-detail-item">
                  <span className="stat-detail-label">Total Students</span>
                  <span className="stat-detail-value">{classData.studentsCount}</span>
                </div>
                <div className="stat-detail-item">
                  <span className="stat-detail-label">Average Grade</span>
                  <span className="stat-detail-value">{analytics.averageGrade}%</span>
                </div>
                <div className="stat-detail-item">
                  <span className="stat-detail-label">Attendance Rate</span>
                  <span className="stat-detail-value">{analytics.attendanceRate}%</span>
                </div>
                <div className="stat-detail-item">
                  <span className="stat-detail-label">Assignment Completion</span>
                  <span className="stat-detail-value">{analytics.assignmentCompletionRate}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roster' && (
          <div className="roster-section">
            <div className="section-header">
              <h2>Student Roster ({classStudents.length} students)</h2>
            </div>
            <div className="students-grid">
              {classStudents.map(student => (
                <div key={student.id} className="student-card">
                  <div className="student-avatar-large">{student.avatar}</div>
                  <h3>{student.name}</h3>
                  <p className="student-email">{student.email}</p>
                  <p className="student-id">ID: {student.studentId}</p>
                  <div className="student-stats">
                    <div className="student-stat">
                      <span className="stat-label">Grade</span>
                      <span className="stat-value">{student.overallGrade}</span>
                    </div>
                    <div className="student-stat">
                      <span className="stat-label">Attendance</span>
                      <span className="stat-value">{student.attendance}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="assignments-section">
            <div className="section-header">
              <h2>Class Assignments</h2>
              <button className="btn-primary-action" onClick={onCreateAssignment}>
                + Create Assignment
              </button>
            </div>
            {classAssignments.length > 0 ? (
              <div className="assignments-list-detail">
                {classAssignments.map(assignment => (
                  <div key={assignment.id} className="assignment-detail-card">
                    <div className="assignment-detail-header">
                      <div>
                        <h3>{assignment.title}</h3>
                        <p className="assignment-type">{assignment.type}</p>
                      </div>
                      <span className={`status-badge ${assignment.status.replace('_', '-')}`}>
                        {assignment.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="assignment-description">{assignment.description}</p>
                    <div className="assignment-detail-info">
                      <div className="info-row">
                        <span className="info-icon">📅</span>
                        <span>Due: {assignment.dueDate} at {assignment.dueTime}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-icon">📊</span>
                        <span>Points: {assignment.totalPoints}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-icon">✅</span>
                        <span>Submissions: {assignment.submitted}/{assignment.totalStudents}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-icon">📝</span>
                        <span>Graded: {assignment.graded}/{assignment.submitted}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No assignments yet</p>
                <button className="btn-primary-action" onClick={onCreateAssignment}>
                  Create First Assignment
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'gradebook' && (
          <div className="gradebook-section">
            <div className="section-header">
              <h2>Gradebook</h2>
            </div>
            <div className="gradebook-table-container">
              <table className="gradebook-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    {classAssignments.slice(0, 5).map(assignment => (
                      <th key={assignment.id}>{assignment.title}</th>
                    ))}
                    <th>Average</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map(student => (
                    <tr key={student.id}>
                      <td><strong>{student.name}</strong></td>
                      {classAssignments.slice(0, 5).map(assignment => (
                        <td key={assignment.id}>
                          <span className="grade-cell">-</span>
                        </td>
                      ))}
                      <td><strong>{student.overallGrade}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="gradebook-note">Note: This is a placeholder gradebook. Full implementation coming soon.</p>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="announcements-section">
            <div className="section-header">
              <h2>Class Announcements</h2>
            </div>
            {classAnnouncements.length > 0 ? (
              <div className="announcements-list">
                {classAnnouncements.map(announcement => (
                  <div key={announcement.id} className="announcement-card">
                    <h3>{announcement.title}</h3>
                    <p className="announcement-message">{announcement.message}</p>
                    <div className="announcement-meta">
                      <span>Posted: {announcement.postedDate}</span>
                      <span>Viewed by: {announcement.viewedBy}/{announcement.totalStudents}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No announcements for this class</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="detail-card">
              <h2>Grade Distribution</h2>
              <div className="grade-distribution-chart">
                {Object.entries(analytics.gradeDistribution).map(([grade, count]) => (
                  <div key={grade} className="grade-bar-container">
                    <span className="grade-label">{grade}</span>
                    <div className="grade-bar">
                      <div
                        className="grade-bar-fill"
                        style={{
                          width: `${(count / classData.studentsCount) * 100}%`,
                          background: classData.color
                        }}
                      ></div>
                    </div>
                    <span className="grade-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-card">
              <h2>Performance Trends</h2>
              <div className="trends-chart">
                {analytics.trends.map((trend, idx) => (
                  <div key={idx} className="trend-item">
                    <span className="trend-week">{trend.week}</span>
                    <div className="trend-bar-bg">
                      <div
                        className="trend-bar-fill"
                        style={{ width: `${trend.average}%`, background: classData.color }}
                      ></div>
                    </div>
                    <span className="trend-value">{trend.average}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-card">
              <h2>Class Metrics</h2>
              <div className="metrics-grid">
                <div className="metric-card">
                  <h4>Class Average</h4>
                  <p className="metric-value-large">{analytics.averageGrade}%</p>
                </div>
                <div className="metric-card">
                  <h4>Attendance Rate</h4>
                  <p className="metric-value-large">{analytics.attendanceRate}%</p>
                </div>
                <div className="metric-card">
                  <h4>Completion Rate</h4>
                  <p className="metric-value-large">{analytics.assignmentCompletionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClassDetailView

