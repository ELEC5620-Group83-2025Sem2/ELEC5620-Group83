import { useState, useEffect } from 'react'
import teacherApi from '../../services/teacherApi'

function AssignmentsView({ onAssignmentClick, onCreateAssignment, onGradeAssignment }) {
  const [assignments, setAssignments] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterClass, setFilterClass] = useState('all')
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentsRes, classesRes] = await Promise.all([
          teacherApi.getAssignments(),
          teacherApi.getClasses()
        ])
        setAssignments(assignmentsRes.assignments || [])
        setClasses(classesRes.classes || [])
      } catch (error) {
        console.error('Failed to fetch assignments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      published: 'status-published',
      draft: 'status-draft',
      grading: 'status-grading',
      graded: 'status-graded'
    }
    return statusMap[status] || 'status-draft'
  }

  const filteredAssignments = assignments.filter(assignment => {
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus
    const matchesClass = filterClass === 'all' || assignment.class_id === filterClass
    return matchesStatus && matchesClass
  })

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading assignments...</p>
      </div>
    )
  }

  return (
    <>
      {/* Header with Create Button */}
      <div className="assignments-header">
        <button className="btn-create-assignment" onClick={onCreateAssignment}>
          ➕ Create Assignment
        </button>
      </div>

      {/* Filters */}
      <div className="assignments-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="grading">Needs Grading</option>
            <option value="graded">Graded</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Class:</label>
          <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="all">All Classes</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-results">
          Showing {filteredAssignments.length} assignments
        </div>
      </div>

      {/* Assignments List */}
      <div className="assignments-list">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map(assignment => {
            const assignmentClass = classes.find(c => c.id === assignment.class_id)
            
            return (
              <div key={assignment.id} className="assignment-card">
                <div className="assignment-header">
                  <div>
                    <h3>{assignment.title}</h3>
                    <p className="assignment-class-name">
                      {assignmentClass?.name || 'Unknown Class'}
                    </p>
                  </div>
                  <span className={`status-badge ${getStatusBadgeClass(assignment.status)}`}>
                    {assignment.status || 'draft'}
                  </span>
                </div>

                <p className="assignment-description">{assignment.description || 'No description'}</p>

                <div className="assignment-details">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span>Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📊</span>
                    <span>Total Points: {assignment.total_points || 100}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📝</span>
                    <span>Type: {assignment.assignment_type || 'homework'}</span>
                  </div>
                </div>

                <div className="assignment-actions">
                  <button 
                    className="btn-assignment-action btn-view"
                    onClick={() => onAssignmentClick(assignment.id)}
                  >
                    View
                  </button>
                  <button 
                    className="btn-assignment-action btn-grade"
                    onClick={() => onGradeAssignment(assignment.id)}
                  >
                    Grade
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3>No Assignments</h3>
            <p>Click the button above to create your first assignment</p>
          </div>
        )}
      </div>
    </>
  )
}

export default AssignmentsView
