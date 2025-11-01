import { useState, useEffect } from 'react'

function WeeklyReportView() {
  const [report, setReport] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [enrolledClasses, setEnrolledClasses] = useState([])
  const [recentGrades, setRecentGrades] = useState([])
  const [upcomingAssignments, setUpcomingAssignments] = useState([])

  useEffect(() => {
    generateReport()
  }, [])

  const generateReport = () => {
    setIsGenerating(true)
    // TODO: Replace with actual API call to fetch weekly study data from Supabase
    setTimeout(() => {
      const generatedReport = {
        week: 'Week of ' + new Date().toLocaleDateString(),
        generatedAt: new Date().toISOString(),
        topFocusAreas: [],
        studySummary: {
          totalHours: 0,
          targetHours: 20,
          completionRate: 0,
          averageSession: 0,
          recommendation: 'Start studying to build your report'
        },
        insights: [],
        subjects: [],
        assignments: [],
        upcomingDeadlines: []
      }
      setReport(generatedReport)
      setIsGenerating(false)
    }, 1000)
  }

  const handlePrint = () => {
    setShowPrintModal(true)
    // In a real app, this would trigger the browser's print dialog
    setTimeout(() => {
      window.print()
      setShowPrintModal(false)
    }, 100)
  }

  const handleEmail = () => {
    setShowEmailModal(true)
    // In a real app, this would open an email client or send via API
    setTimeout(() => {
      setShowEmailModal(false)
      alert('Weekly report has been sent to your email!')
    }, 1000)
  }

  const handleSubjectClick = (subjectName) => {
    // Find the subject data from enrolled classes
    const subjectData = enrolledClasses.find(cls => cls.name === subjectName)
    if (subjectData) {
      setSelectedSubject(subjectData)
      setShowSubjectModal(true)
    }
  }

  const getSubjectGrades = (subjectName) => {
    return recentGrades.filter(grade => grade.class === subjectName)
  }

  const getSubjectAssignments = (subjectName) => {
    return upcomingAssignments.filter(assignment => assignment.class === subjectName)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#f56565'
      case 'Medium': return '#ed8936'
      case 'Low': return '#48bb78'
      default: return '#718096'
    }
  }

  const getInsightIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️'
      case 'urgent': return '🚨'
      case 'info': return 'ℹ️'
      default: return '📊'
    }
  }

  if (isGenerating) {
    return (
      <div className="weekly-report-container">
        <div className="generating-report">
          <div className="loading-spinner"></div>
          <h3>Generating Your Weekly Report...</h3>
          <p>Analyzing your study patterns and performance</p>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="weekly-report-container">
        <div className="error-state">
          <h3>Unable to generate report</h3>
          <p>Please try again later</p>
          <button onClick={generateReport} className="btn-retry">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="weekly-report-container">
      {/* Header */}
      <div className="report-header">
        <div className="header-content">
          <h2>📊 Weekly Study Report</h2>
          <p className="report-week">{report.week}</p>
          <p className="report-generated">Generated on {new Date(report.generatedAt).toLocaleDateString()}</p>
        </div>
        <div className="header-actions">
          <button className="btn-email" onClick={handleEmail}>
            📧 Email Report
          </button>
          <button className="btn-print" onClick={handlePrint}>
            🖨️ Print Report
          </button>
          <button className="btn-refresh" onClick={generateReport}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Top 3 Focus Areas */}
      <div className="report-section">
        <h3>🎯 Top 3 Focus Areas for Next Week</h3>
        <div className="focus-areas">
          {report.topFocusAreas.map((area, index) => (
            <div key={index} className="focus-area-card">
              <div className="focus-header">
                <span className="focus-number">{index + 1}</span>
                <h4 
                  className="clickable-subject"
                  onClick={() => handleSubjectClick(area.subject)}
                >
                  {area.subject}
                </h4>
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(area.priority) }}
                >
                  {area.priority} Priority
                </span>
              </div>
              <p className="focus-reason">{area.reason}</p>
              <p className="focus-recommendation">{area.recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Study Time Summary */}
      <div className="report-section">
        <h3>⏰ Study Time Summary</h3>
        <div className="study-summary">
          <div className="summary-stats">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <span className="stat-value">{report.studySummary.totalHours}h</span>
                <span className="stat-label">Total Study Time</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <span className="stat-value">{report.studySummary.completionRate}%</span>
                <span className="stat-label">Target Completion</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <span className="stat-value">{report.studySummary.averageSession}h</span>
                <span className="stat-label">Avg Session Length</span>
              </div>
            </div>
          </div>
          
          <div className="progress-section">
            <div className="progress-header">
              <span>Weekly Study Progress</span>
              <span>{report.studySummary.totalHours}/{report.studySummary.targetHours} hours</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${Math.min(report.studySummary.completionRate, 100)}%` }}
              ></div>
            </div>
            <p className="progress-recommendation">{report.studySummary.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Weekly Insights */}
      {report.insights.length > 0 && (
        <div className="report-section">
          <h3>💡 Weekly Insights</h3>
          <div className="insights-list">
            {report.insights.map((insight, index) => (
              <div key={index} className={`insight-card ${insight.type}`}>
                <div className="insight-icon">{getInsightIcon(insight.type)}</div>
                <div className="insight-content">
                  <h4>{insight.title}</h4>
                  <p>{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject Breakdown */}
      <div className="report-section">
        <h3>📖 Subject Breakdown</h3>
        <div className="subjects-breakdown">
          {report.subjects.map((subject, index) => (
            <div key={index} className="subject-card">
              <div className="subject-header">
                <h4 
                  className="clickable-subject"
                  onClick={() => handleSubjectClick(subject.name)}
                >
                  {subject.name}
                </h4>
                <span className="study-time">{subject.studyTime}h</span>
              </div>
              <div className="subject-details">
                <div className="detail-item">
                  <span className="detail-label">Sessions:</span>
                  <span className="detail-value">{subject.sessions}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Studied:</span>
                  <span className="detail-value">{new Date(subject.lastStudied).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Progress:</span>
                  <span className="detail-value">{subject.progress}%</span>
                </div>
              </div>
              <div className="topics-list">
                <span className="topics-label">Topics covered:</span>
                <div className="topics-tags">
                  {subject.topics.map((topic, topicIndex) => (
                    <span key={topicIndex} className="topic-tag">{topic}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assignments Completed */}
      <div className="report-section">
        <h3>✅ Assignments Completed</h3>
        <div className="assignments-list">
          {report.assignments.map((assignment, index) => (
            <div key={index} className="assignment-item">
              <div className="assignment-info">
                <h4>{assignment.title}</h4>
                <span className="assignment-subject">{assignment.subject}</span>
              </div>
              <div className="assignment-details">
                <span className="assignment-grade">{assignment.grade || 'Pending'}</span>
                <span className="assignment-time">{assignment.timeSpent}h spent</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="report-section">
        <h3>📅 Upcoming Deadlines</h3>
        <div className="deadlines-list">
          {report.upcomingDeadlines.map((deadline, index) => (
            <div key={index} className="deadline-item">
              <div className="deadline-info">
                <h4>{deadline.title}</h4>
                <span className="deadline-subject">{deadline.subject}</span>
              </div>
              <div className="deadline-details">
                <span className={`priority-badge ${deadline.priority}`}>
                  {deadline.priority} Priority
                </span>
                <span className="deadline-date">
                  Due: {new Date(deadline.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>📧 Email Weekly Report</h3>
            <p>Your weekly report will be sent to your registered email address.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowEmailModal(false)}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={handleEmail}>
                Send Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {showPrintModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>🖨️ Print Weekly Report</h3>
            <p>Your weekly report will be formatted for printing.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowPrintModal(false)}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={handlePrint}>
                Print Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subject Detail Modal */}
      {showSubjectModal && selectedSubject && (
        <div className="modal-overlay">
          <div className="subject-detail-modal">
            <div className="modal-header">
              <h3>📚 {selectedSubject.name} - Detailed View</h3>
              <button 
                className="modal-close"
                onClick={() => setShowSubjectModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="subject-modal-content">
              {/* Subject Overview */}
              <div className="subject-overview">
                <div className="overview-stats">
                  <div className="stat-item">
                    <span className="stat-label">Current Grade:</span>
                    <span className="stat-value grade-badge">{selectedSubject.grade}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Progress:</span>
                    <span className="stat-value">{selectedSubject.progress}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Teacher:</span>
                    <span className="stat-value">{selectedSubject.teacher}</span>
                  </div>
                </div>
              </div>

              {/* Recent Grades */}
              <div className="grades-section">
                <h4>📊 Recent Grades</h4>
                {getSubjectGrades(selectedSubject.name).length > 0 ? (
                  <div className="grades-list">
                    {getSubjectGrades(selectedSubject.name).map((grade, index) => (
                      <div key={index} className="grade-item">
                        <div className="grade-info">
                          <span className="grade-assignment">{grade.assignment}</span>
                          <span className="grade-score">{grade.score}/{grade.maxScore}</span>
                        </div>
                        <span className="grade-letter">{grade.grade}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No recent grades available</p>
                )}
              </div>

              {/* Upcoming Assignments */}
              <div className="assignments-section">
                <h4>📝 Upcoming Assignments</h4>
                {getSubjectAssignments(selectedSubject.name).length > 0 ? (
                  <div className="assignments-list">
                    {getSubjectAssignments(selectedSubject.name).map((assignment, index) => (
                      <div key={index} className="assignment-item">
                        <div className="assignment-info">
                          <span className="assignment-title">{assignment.title}</span>
                          <span className="assignment-due">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        <span className={`assignment-priority ${assignment.priority}`}>
                          {assignment.priority} Priority
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No upcoming assignments</p>
                )}
              </div>

              {/* Study Progress */}
              <div className="progress-section">
                <h4>📈 Study Progress</h4>
                <div className="progress-info">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${selectedSubject.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{selectedSubject.progress}% Complete</span>
                </div>
              </div>

              {/* Class Schedule */}
              <div className="schedule-section">
                <h4>📅 Class Schedule</h4>
                <div className="schedule-list">
                  {selectedSubject.schedule.map((session, index) => (
                    <div key={index} className="schedule-item">
                      <span className="schedule-day">{session.day}</span>
                      <span className="schedule-time">{session.time}</span>
                      <span className="schedule-location">{session.location}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-close"
                onClick={() => setShowSubjectModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WeeklyReportView
