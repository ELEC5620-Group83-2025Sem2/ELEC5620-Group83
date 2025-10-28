import { useState, useEffect } from 'react'
import teacherApi from '../../services/teacherApi'

function MyClassesView({ onClassClick }) {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await teacherApi.getClasses()
        setClasses(response.data || [])
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
        <p>Loading classes...</p>
      </div>
    )
  }

  if (classes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
        <h3>No Classes Yet</h3>
        <p>You haven't created any classes</p>
      </div>
    )
  }

  return (
    <div className="classes-grid">
      {classes.map(classItem => (
        <div
          key={classItem.id}
          className="class-card-detailed"
          style={{ borderTop: `4px solid ${classItem.color || '#667eea'}` }}
        >
          <div className="class-card-header">
            <div className="class-icon" style={{ background: `${classItem.color || '#667eea'}20`, color: classItem.color || '#667eea' }}>
              📚
            </div>
            <span className="class-period">{classItem.code}</span>
          </div>
          <h3>{classItem.name}</h3>
          <p className="class-description">{classItem.description || 'No description'}</p>
          
          <div className="class-stats">
            <div className="stat-item">
              <span className="stat-label">Created</span>
              <span className="stat-value">
                {new Date(classItem.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <button
            className="btn-class-action"
            style={{ background: classItem.color || '#667eea' }}
            onClick={() => onClassClick(classItem.id)}
          >
            View Class
          </button>
        </div>
      ))}
    </div>
  )
}

export default MyClassesView
