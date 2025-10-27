import { useState } from 'react'
import { teacherClasses, classAnalytics, analyzeClassPerformance } from './teacherMockData'

function AnalyticsView() {
  const [selectedClassId, setSelectedClassId] = useState(teacherClasses[0].id)
  const [aiInsights, setAiInsights] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)

  const selectedClass = teacherClasses.find(c => c.id === selectedClassId)
  const analytics = classAnalytics[selectedClassId]

  const handleGenerateInsights = async () => {
    setAiLoading(true)
    
    // Call AI analysis skeleton
    const result = await analyzeClassPerformance(selectedClassId)
    
    if (result.success) {
      setAiInsights(result.analysis)
    }
    
    setAiLoading(false)
  }

  const getGradeColor = (grade) => {
    if (grade >= 85) return '#48bb78'
    if (grade >= 70) return '#ed8936'
    return '#f56565'
  }

  return (
    <div className="analytics-view">
      {/* Class Selector */}
      <div className="analytics-header">
        <div className="class-selector">
          <label>Select Class:</label>
          <select value={selectedClassId} onChange={(e) => {
            setSelectedClassId(e.target.value)
            setAiInsights(null)
          }}>
            {teacherClasses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <button
          className="btn-generate-insights"
          onClick={handleGenerateInsights}
          disabled={aiLoading}
        >
          {aiLoading ? (
            <>
              <span className="spinner-small">⏳</span> Analyzing...
            </>
          ) : (
            <>
              <span className="ai-icon">🤖</span> Generate AI Insights
            </>
          )}
        </button>
      </div>

      {/* Overall Statistics */}
      <div className="analytics-stats-grid">
        <div className="analytics-stat-card">
          <h3>Class Average</h3>
          <p className="stat-value-xl" style={{ color: getGradeColor(analytics.averageGrade) }}>
            {analytics.averageGrade}%
          </p>
          <p className="stat-trend">📈 Trending up</p>
        </div>
        <div className="analytics-stat-card">
          <h3>Attendance Rate</h3>
          <p className="stat-value-xl">{analytics.attendanceRate}%</p>
        </div>
        <div className="analytics-stat-card">
          <h3>Assignment Completion</h3>
          <p className="stat-value-xl">{analytics.assignmentCompletionRate}%</p>
        </div>
        <div className="analytics-stat-card">
          <h3>Total Students</h3>
          <p className="stat-value-xl">{selectedClass.studentsCount}</p>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="analytics-section">
        <h2>Grade Distribution</h2>
        <div className="grade-distribution-chart">
          {Object.entries(analytics.gradeDistribution).map(([grade, count]) => (
            <div key={grade} className="grade-bar-container">
              <span className="grade-label-large">{grade}</span>
              <div className="grade-bar-large">
                <div
                  className="grade-bar-fill"
                  style={{
                    width: `${(count / selectedClass.studentsCount) * 100}%`,
                    background: selectedClass.color
                  }}
                ></div>
              </div>
              <span className="grade-count-large">
                {count} ({Math.round((count / selectedClass.studentsCount) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Trends */}
      <div className="analytics-section">
        <h2>Performance Trends (Last 4 Weeks)</h2>
        <div className="trends-chart-large">
          {analytics.trends.map((trend, idx) => (
            <div key={idx} className="trend-item-large">
              <span className="trend-week">{trend.week}</span>
              <div className="trend-column">
                <div
                  className="trend-column-fill"
                  style={{
                    height: `${trend.average}%`,
                    background: selectedClass.color
                  }}
                ></div>
              </div>
              <span className="trend-value">{trend.average}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights Panel */}
      {aiInsights && (
        <div className="ai-insights-section">
          <div className="ai-insights-header">
            <h2>
              <span className="ai-icon-large">🤖</span> AI-Powered Insights
            </h2>
            <span className="generated-date">Generated: {new Date(aiInsights.generatedAt || Date.now()).toLocaleDateString()}</span>
          </div>

          {/* Overall Performance */}
          <div className="insight-card">
            <h3>📊 Overall Performance</h3>
            <p className="insight-summary">{aiInsights.overallPerformance.summary}</p>
            <div className="performance-indicator">
              <span>Trend: </span>
              <span className={`trend-badge ${aiInsights.overallPerformance.trend}`}>
                {aiInsights.overallPerformance.trend === 'improving' && '📈 Improving'}
                {aiInsights.overallPerformance.trend === 'declining' && '📉 Declining'}
                {aiInsights.overallPerformance.trend === 'stable' && '➡️ Stable'}
              </span>
            </div>
          </div>

          {/* At-Risk Students */}
          {aiInsights.atRiskStudents && aiInsights.atRiskStudents.length > 0 && (
            <div className="insight-card alert-card">
              <h3>⚠️ Students Needing Attention</h3>
              {aiInsights.atRiskStudents.map((student, idx) => (
                <div key={idx} className="at-risk-student">
                  <div className="student-risk-header">
                    <span className="student-name">{student.name}</span>
                    <span className={`risk-badge risk-${student.risk}`}>
                      {student.risk} risk
                    </span>
                  </div>
                  <p className="current-grade">Current Grade: {student.currentGrade}%</p>
                  <div className="concerns">
                    <strong>Concerns:</strong>
                    <ul>
                      {student.concerns.map((concern, i) => (
                        <li key={i}>{concern}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="recommendations">
                    <strong>Recommendations:</strong>
                    <ul>
                      {student.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Topic Difficulty Analysis */}
          {aiInsights.topicDifficulty && aiInsights.topicDifficulty.length > 0 && (
            <div className="insight-card">
              <h3>📚 Topic Difficulty Analysis</h3>
              {aiInsights.topicDifficulty.map((topic, idx) => (
                <div key={idx} className="topic-analysis">
                  <div className="topic-header">
                    <span className="topic-name">{topic.topic}</span>
                    <span className="topic-score">{topic.avgScore}%</span>
                    <span className={`difficulty-badge difficulty-${topic.difficulty}`}>
                      {topic.difficulty}
                    </span>
                  </div>
                  <p className="topic-suggestion">{topic.suggestion}</p>
                </div>
              ))}
            </div>
          )}

          {/* Suggested Interventions */}
          {aiInsights.interventions && aiInsights.interventions.length > 0 && (
            <div className="insight-card">
              <h3>💡 Suggested Interventions</h3>
              {aiInsights.interventions.map((intervention, idx) => (
                <div key={idx} className="intervention-item">
                  <div className="intervention-header">
                    <span className={`priority-badge priority-${intervention.priority}`}>
                      {intervention.priority} priority
                    </span>
                    <h4>{intervention.action}</h4>
                  </div>
                  <p className="intervention-reason"><strong>Reason:</strong> {intervention.reason}</p>
                  <p className="intervention-approach">
                    <strong>Suggested Approach:</strong> {intervention.suggestedApproach}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Class Strengths */}
          {aiInsights.strengths && aiInsights.strengths.length > 0 && (
            <div className="insight-card success-card">
              <h3>✅ Class Strengths</h3>
              <ul className="strengths-list">
                {aiInsights.strengths.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Comparative Benchmark */}
          {aiInsights.comparativeBenchmark && (
            <div className="insight-card">
              <h3>📊 Comparative Performance</h3>
              <div className="benchmark-grid">
                <div className="benchmark-item">
                  <span className="benchmark-label">vs. School Average</span>
                  <span className="benchmark-value positive">{aiInsights.comparativeBenchmark.vsSchoolAverage}</span>
                </div>
                <div className="benchmark-item">
                  <span className="benchmark-label">vs. State Average</span>
                  <span className="benchmark-value positive">{aiInsights.comparativeBenchmark.vsStateAverage}</span>
                </div>
                <div className="benchmark-item">
                  <span className="benchmark-label">vs. Last Year</span>
                  <span className="benchmark-value positive">{aiInsights.comparativeBenchmark.vsLastYear}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!aiInsights && !aiLoading && (
        <div className="no-insights-state">
          <div className="ai-icon-xl">🤖</div>
          <h3>Generate AI-Powered Insights</h3>
          <p>Click "Generate AI Insights" to get detailed analysis of class performance, identify at-risk students, and receive actionable recommendations.</p>
        </div>
      )}
    </div>
  )
}

export default AnalyticsView

