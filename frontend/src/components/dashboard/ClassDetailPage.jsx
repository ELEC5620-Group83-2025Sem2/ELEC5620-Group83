import { useState } from 'react'

function ClassDetailPage({ classData, onBack }) {
  const [activeSection, setActiveSection] = useState('overview')

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
              <p className="class-detail-teacher">👨‍🏫 {classData.teacher}</p>
            </div>
          </div>
          <div className="class-detail-stats-row">
            <div className="stat-box">
              <span className="stat-label">Grade</span>
              <span className="stat-value-large" style={{ color: classData.color }}>{classData.studentAvgGrade}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Progress</span>
              <span className="stat-value-large" style={{ color: classData.color }}>{classData.progress}%</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Assignments</span>
              <span className="stat-value-large" style={{ color: classData.color }}>{classData.upcomingAssignments}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="detail-tabs">
        <button 
          className={`detail-tab ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          Overview
        </button>
        <button 
          className={`detail-tab ${activeSection === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveSection('assignments')}
        >
          Assignments
        </button>
        <button 
          className={`detail-tab ${activeSection === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveSection('materials')}
        >
          Materials
        </button>
        <button 
          className={`detail-tab ${activeSection === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveSection('schedule')}
        >
          Schedule
        </button>
        <button 
          className={`detail-tab ${activeSection === 'grades' ? 'active' : ''}`}
          onClick={() => setActiveSection('grades')}
        >
          Grades
        </button>
      </div>

      {/* Content Sections */}
      <div className="detail-content">
        {activeSection === 'overview' && (
          <div className="overview-section">
            <div className="detail-card">
              <h2>Course Description</h2>
              <p>{classData.description}</p>
            </div>

            <div className="detail-card">
              <h2>Next Class</h2>
              <div className="next-class-info">
                <div className="info-row">
                  <span className="info-icon">📅</span>
                  <span>{classData.nextClass}</span>
                </div>
                <div className="info-row">
                  <span className="info-icon">📍</span>
                  <span>{classData.location || 'Room 302, Building A'}</span>
                </div>
                <div className="info-row">
                  <span className="info-icon">⏱️</span>
                  <span>Duration: 50 minutes</span>
                </div>
              </div>
            </div>

            <div className="detail-card">
              <h2>Class Progress</h2>
              <div className="progress-section">
                <div className="progress-bar-large">
                  <div 
                    className="progress-fill-large" 
                    style={{ width: `${classData.progress}%`, background: classData.color }}
                  ></div>
                </div>
                <div className="progress-details">
                  <span>Completed: {classData.progress}%</span>
                  <span>Remaining: {100 - classData.progress}%</span>
                </div>
              </div>
              <div className="milestone-list">
                <div className="milestone-item completed">
                  <span className="milestone-check">✓</span>
                  <span>Introduction to {classData.name}</span>
                </div>
                <div className="milestone-item completed">
                  <span className="milestone-check">✓</span>
                  <span>Fundamental Concepts</span>
                </div>
                <div className="milestone-item in-progress">
                  <span className="milestone-check">○</span>
                  <span>Advanced Topics</span>
                </div>
                <div className="milestone-item pending">
                  <span className="milestone-check">○</span>
                  <span>Final Review & Exam</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'assignments' && (
          <div className="assignments-section">
            {classData.assignmentsList?.map(assignment => (
              <div key={assignment.id} className="assignment-detail-card">
                <div className="assignment-detail-header">
                  <h3>{assignment.title}</h3>
                  <span className={`status-badge ${assignment.status}`}>
                    {assignment.status}
                  </span>
                </div>
                <div className="assignment-detail-info">
                  <div className="info-row">
                    <span className="info-icon">📅</span>
                    <span>Due: {assignment.dueDate} at {assignment.dueTime}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-icon">📊</span>
                    <span>Weight: {assignment.weight}%</span>
                  </div>
                </div>
                <button className="btn-view-assignment" style={{ borderColor: classData.color, color: classData.color }}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'materials' && (
          <div className="materials-section">
            <div className="detail-card">
              <h2>Course Materials</h2>
              <div className="materials-list">
                {classData.materials?.map((material, index) => (
                  <div key={index} className="material-item">
                    <span className="material-icon">{material.type === 'pdf' ? '📄' : material.type === 'video' ? '🎥' : '📎'}</span>
                    <div className="material-info">
                      <span className="material-name">{material.name}</span>
                      <span className="material-meta">{material.size} • Uploaded {material.uploadDate}</span>
                    </div>
                    <button className="btn-download">Download</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'schedule' && (
          <div className="schedule-section">
            <div className="detail-card">
              <h2>Weekly Schedule</h2>
              <div className="schedule-list">
                {classData.schedule?.map((session, index) => (
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
          </div>
        )}

        {activeSection === 'grades' && (
          <div className="grades-section">
            <div className="detail-card">
              <h2>Assessment Grades</h2>
              <div className="grades-table">
                <div className="grades-header">
                  <span>Assessment</span>
                  <span>Score</span>
                  <span>Weight</span>
                  <span>Grade</span>
                </div>
                {classData.gradeHistory?.map((grade, index) => (
                  <div key={index} className="grade-row">
                    <span>{grade.assessment}</span>
                    <span>{grade.score}/{grade.maxScore}</span>
                    <span>{grade.weight}%</span>
                    <span className="grade-value" style={{ color: classData.color }}>{grade.grade}</span>
                  </div>
                ))}
              </div>
              <div className="overall-grade" style={{ background: `${classData.color}10`, borderColor: classData.color }}>
                <span>Overall Grade:</span>
                <span className="overall-grade-value" style={{ color: classData.color }}>{classData.grade}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClassDetailPage

