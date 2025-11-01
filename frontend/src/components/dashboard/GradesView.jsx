import { useState } from 'react'
import ReviewIncorrectQuestions from './ReviewIncorrectQuestions'

function GradesView({ enrolledClasses, recentGrades, gradesSummary, reviewQuestions, reviewStats }) {
  const [activeTab, setActiveTab] = useState('overview') // 'overview' or 'review'

  const getAverageGradeLetter = (avg) => {
    if (avg == null) return 'N/A'
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
      {/* Tab Navigation */}
      <div className="grades-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Grades Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'review' ? 'active' : ''}`}
          onClick={() => setActiveTab('review')}
        >
          📚 Review Incorrect Questions
        </button>
      </div>

      {/* Grades Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <div className="grades-overview">
            <div className="grade-summary-card">
              <h3>Overall Performance</h3>
              <div className="grade-circle">
                <span className="grade-large">{getAverageGradeLetter(gradesSummary?.overallAverage)}</span>
              </div>
              <p>Overall Average: {gradesSummary?.overallAverage != null ? `${Number(gradesSummary.overallAverage).toFixed(1)}%` : 'N/A'}</p>
            </div>
            <div className="grades-by-subject">
              {enrolledClasses.map(course => (
                <div key={course.id} className="subject-grade">
                  <div className="subject-info">
                    <span className="subject-name">{course.name}</span>
                    <span className="subject-code">{course.code}</span>
                  </div>
                  <span className="subject-grade-badge" style={{ background: `${course.color}20`, color: course.color }}>
                    {course.grade}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <section className="dashboard-section">
            <h3>All Grades</h3>
            <div className="grades-table">
              <table>
                <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Class</th>
                    <th>Score</th>
                    <th>Grade</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentGrades.map((grade, index) => (
                    <tr key={index}>
                      <td>{grade.assignment}</td>
                      <td>{grade.class}</td>
                      <td>{grade.score}/{grade.maxScore}</td>
                      <td><span className="grade-badge">{grade.grade}</span></td>
                      <td>{grade.gradedAt || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* Review Incorrect Questions Tab */}
      {activeTab === 'review' && (
        <ReviewIncorrectQuestions questions={reviewQuestions} reviewStats={reviewStats} />
      )}
    </>
  )
}

export default GradesView

