import { useState } from 'react'
import { allAssignments, getSubmissionStats } from './teacherMockData'

function AssignmentsView({ onAssignmentClick, onCreateAssignment, onGradeAssignment }) {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterClass, setFilterClass] = useState('all')

  // Get unique class names for filter
  const uniqueClasses = [...new Set(allAssignments.map(a => a.className))]

  // Filter assignments
  const filteredAssignments = allAssignments.filter(assignment => {
    const statusMatch = filterStatus === 'all' || assignment.status === filterStatus
    const classMatch = filterClass === 'all' || assignment.className === filterClass
    return statusMatch && classMatch
  })

  const getStatusBadgeClass = (status) => {
    const classes = {
      'published': 'status-published',
      'draft': 'status-draft',
      'grading_needed': 'status-grading',
      'graded': 'status-graded'
    }
    return classes[status] || ''
  }

  return (
    <div className="assignments-view">
      {/* Header with Filters */}
      <div className="assignments-header">
        <button className="btn-create-assignment" onClick={onCreateAssignment}>
          + Create Assignment
        </button>
      </div>

      <div className="assignments-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="grading_needed">Grading Needed</option>
            <option value="graded">Graded</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Class:</label>
          <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="all">All Classes</option>
            {uniqueClasses.map(className => (
              <option key={className} value={className}>{className}</option>
            ))}
          </select>
        </div>
        <div className="filter-results">
          Showing {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Assignments List */}
      <div className="assignments-detailed">
        {filteredAssignments.map(assignment => {
          const stats = getSubmissionStats(assignment.id)
          
          return (
            <div key={assignment.id} className="assignment-card">
              <div className="assignment-header">
                <div>
                  <h3>{assignment.title}</h3>
                  <p className="assignment-class-name" style={{ color: assignment.classColor }}>
                    {assignment.className}
                  </p>
                </div>
                <span className={`status-badge ${getStatusBadgeClass(assignment.status)}`}>
                  {assignment.status.replace('_', ' ')}
                </span>
              </div>

              <p className="assignment-description">{assignment.description}</p>

              <div className="assignment-details">
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <span>Due: {assignment.dueDate} at {assignment.dueTime}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📊</span>
                  <span>Type: {assignment.type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">💯</span>
                  <span>Points: {assignment.totalPoints}</span>
                </div>
              </div>

              {assignment.published && (
                <div className="submission-stats">
                  <div className="stat-progress">
                    <div className="progress-label">
                      <span>Submissions: {stats.submitted}/{stats.total}</span>
                      <span>{stats.percentage}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${stats.percentage}%`,
                          background: assignment.classColor
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="stat-progress">
                    <div className="progress-label">
                      <span>Graded: {stats.graded}/{stats.submitted}</span>
                      <span>{stats.submitted > 0 ? Math.round((stats.graded / stats.submitted) * 100) : 0}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${stats.submitted > 0 ? (stats.graded / stats.submitted) * 100 : 0}%`,
                          background: '#48bb78'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="assignment-actions">
                <button
                  className="btn-assignment-action"
                  onClick={() => onAssignmentClick(assignment.id)}
                >
                  View Details
                </button>
                {assignment.status === 'grading_needed' && stats.pending > 0 && (
                  <button
                    className="btn-assignment-action btn-grade"
                    onClick={() => onGradeAssignment(assignment.id)}
                  >
                    Grade Submissions ({stats.pending})
                  </button>
                )}
                <button className="btn-assignment-action btn-secondary">
                  Edit
                </button>
                {assignment.status === 'draft' && (
                  <button
                    className="btn-assignment-action btn-publish"
                    style={{ background: assignment.classColor }}
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="empty-state">
          <p>No assignments found</p>
          <button className="btn-primary-action" onClick={onCreateAssignment}>
            Create Your First Assignment
          </button>
        </div>
      )}
    </div>
  )
}

export default AssignmentsView

