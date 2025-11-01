import { useState, useEffect } from 'react'
import teacherApi from '../../services/teacherApi'

function AnalyticsView() {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('all')
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState(null)
  const [generating, setGenerating] = useState(false)

  const handleGenerateInsights = async (classId) => {
    if (!classId || classId === 'all') {
      alert('Please select a specific class to generate insights')
      return
    }

    setGenerating(true)
    try {
      const response = await teacherApi.analyzeClassPerformance(classId)
      setInsights(response.data)
      alert('AI Insights generated successfully!')
    } catch (error) {
      console.error('Failed to generate insights:', error)
      alert('Failed to generate AI insights. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await teacherApi.getClasses()
        setClasses(response.classes || [])
      } catch (error) {
        console.error('Failed to fetch classes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading analytics data...</p>
      </div>
    )
  }

  return (
    <div className="analytics-view">
      {/* Header */}
      <div className="analytics-header">
        <div className="class-selector">
          <label>Select Class:</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="all">All Classes</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>

        <button 
          className="btn-generate-insights" 
          onClick={() => handleGenerateInsights(selectedClass)}
          disabled={selectedClass === 'all' || !selectedClass}
        >
          <span>✨</span> Generate AI Insights
        </button>
      </div>

      {/* AI Insights Display */}
      {insights && (
        <div className="ai-insights-section">
          <h3>🤖 AI-Generated Insights</h3>
          
          {insights.insights && insights.insights.length > 0 && (
            <div className="insights-list">
              <h4>Key Insights:</h4>
              <ul>
                {insights.insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
          )}

          {insights.recommendations && insights.recommendations.length > 0 && (
            <div className="insights-list">
              <h4>Recommendations:</h4>
              <ul>
                {insights.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {insights.concerns && insights.concerns.length > 0 && (
            <div className="insights-list concerns">
              <h4>⚠️ Areas of Concern:</h4>
              <ul>
                {insights.concerns.map((concern, index) => (
                  <li key={index}>{concern}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="insights-stats">
            <p><strong>Class Average:</strong> {insights.class_average}%</p>
            <p><strong>Total Submissions Analyzed:</strong> {insights.total_submissions}</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="analytics-stats-grid">
        <div className="analytics-stat-card">
          <h3>Total Students</h3>
          <p className="stat-value-xl">0</p>
          <p className="stat-trend">No data yet</p>
        </div>

        <div className="analytics-stat-card">
          <h3>Average Grade</h3>
          <p className="stat-value-xl">N/A</p>
          <p className="stat-trend">No data yet</p>
        </div>

        <div className="analytics-stat-card">
          <h3>Assignment Completion</h3>
          <p className="stat-value-xl">N/A</p>
          <p className="stat-trend">No data yet</p>
        </div>

        <div className="analytics-stat-card">
          <h3>Attendance Rate</h3>
          <p className="stat-value-xl">N/A</p>
          <p className="stat-trend">No data yet</p>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="analytics-section">
        <h2>Performance Overview</h2>
        <div className="detail-card">
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3>Analytics Feature Coming Soon</h3>
            <p style={{ color: '#718096', marginTop: '0.5rem' }}>
              We're developing detailed class performance analytics, including grade distribution, trend analysis, and AI insights
            </p>
          </div>
        </div>
      </div>

      {/* AI Insights Placeholder */}
      <div className="analytics-section">
        <h2>AI Insights <span className="ai-badge">AI Powered</span></h2>
        <div className="detail-card">
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
            <h3>AI Analysis Feature Coming Soon</h3>
            <p style={{ color: '#718096', marginTop: '0.5rem' }}>
              AI will help identify at-risk students, analyze course difficulty, and provide teaching recommendations
            </p>
            <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '2rem auto', color: '#718096' }}>
              <li style={{ marginBottom: '0.5rem' }}>Identify students who need extra support</li>
              <li style={{ marginBottom: '0.5rem' }}>Analyze course difficulties and weak points</li>
              <li style={{ marginBottom: '0.5rem' }}>Provide personalized teaching suggestions</li>
              <li style={{ marginBottom: '0.5rem' }}>Compare class performance benchmarks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsView
