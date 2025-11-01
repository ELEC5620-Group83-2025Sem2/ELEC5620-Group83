import { useState, useEffect } from 'react'
import teacherApi from '../../services/teacherApi'
import './ClassDetailView.css'

function ClassDetailView({ classId, onBack, onCreateAssignment }) {
  const [classData, setClassData] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await teacherApi.getClassById(classId)
        setClassData(response.class || response.data)
      } catch (error) {
        console.error('Failed to fetch class details:', error)
        console.error('Error details:', error.message, error.response)
      } finally {
        setLoading(false)
      }
    }

    fetchClassData()
  }, [classId])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading class details...</p>
      </div>
    )
  }

  if (!classData) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
        <h3>Class Not Found</h3>
        <button className="btn-back" onClick={onBack}>
          ← Back to Classes
        </button>
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
        <div className="class-detail-hero" style={{ borderLeft: `6px solid ${classData.color || '#667eea'}` }}>
          <div className="class-detail-info">
            <div className="class-icon-large" style={{ background: `${classData.color || '#667eea'}20`, color: classData.color || '#667eea' }}>
              📚
            </div>
            <div>
              <h1 className="class-detail-title">{classData.name}</h1>
              <p className="class-detail-code">{classData.code}</p>
              <p className="class-detail-period">
                Created {new Date(classData.created_at).toLocaleDateString()}
              </p>
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
          className={`detail-tab ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          Announcements
        </button>
      </div>

      {/* Content Sections */}
      <div className="detail-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="detail-card">
              <h2>Class Description</h2>
              <p>{classData.description || 'No description'}</p>
            </div>

            <div className="detail-card">
              <h2>Class Information</h2>
              <div className="info-row">
                <span className="info-icon">🏷️</span>
                <span>Class Code: {classData.code}</span>
              </div>
              <div className="info-row">
                <span className="info-icon">📅</span>
                <span>Created: {new Date(classData.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="detail-card">
              <h2>Quick Actions</h2>
              <button 
                className="btn-primary"
                onClick={onCreateAssignment}
                style={{ marginRight: '1rem' }}
              >
                ➕ Create Assignment
              </button>
            </div>
          </div>
        )}

        {activeTab === 'roster' && (
          <div className="roster-section">
            <div className="detail-card">
              <h2>Student Roster</h2>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Student roster feature coming soon</p>
                <p style={{ color: '#718096', marginTop: '0.5rem' }}>
                  View and manage class students here
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="assignments-section">
            <div className="detail-card">
              <h2>Class Assignments</h2>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Class assignments list coming soon</p>
                <button 
                  className="btn-primary"
                  onClick={onCreateAssignment}
                  style={{ marginTop: '1rem' }}
                >
                  ➕ Create Assignment
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="announcements-section">
            <div className="detail-card">
              <h2>Class Announcements</h2>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Class announcements feature coming soon</p>
                <p style={{ color: '#718096', marginTop: '0.5rem' }}>
                  You can post new announcements from the Announcements tab
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClassDetailView
