// Helper function to calculate days until due
function getDaysUntilDue(dueDate) {
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = due - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'Overdue'
  if (diffDays === 0) return 'Due today'
  if (diffDays === 1) return 'Due tomorrow'
  return `Due in ${diffDays} days`
}

function AssignmentsView({ upcomingAssignments = [], onAssignmentClick }) {
  return (
    <div className="assignments-detailed">
      {upcomingAssignments.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>
          <h3>No assignments available</h3>
          <p>You don't have any assignments at the moment.</p>
        </div>
      ) : (
        upcomingAssignments.map(assignment => (
        <div key={assignment.id} className="assignment-card">
          <div className="assignment-header">
            <div>
              <h3>{assignment.title}</h3>
              <p className="assignment-class-name">{assignment.class}</p>
            </div>
            <span className={`priority-badge ${assignment.priority}`}>
              {assignment.priority} priority
            </span>
          </div>
          <div className="assignment-details">
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <span>Due: {assignment.dueDate} at {assignment.dueTime}</span>
            </div>
            <div className="detail-item">
              <span className="detail-icon">⏰</span>
              <span>{getDaysUntilDue(assignment.dueDate)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📊</span>
              <span>Status: {assignment.status}</span>
            </div>
          </div>
          <button 
            className="btn-assignment-action"
            onClick={() => onAssignmentClick(assignment.id)}
          >
            View Assignment
          </button>
        </div>
        ))
      )}
    </div>
  )
}

export default AssignmentsView

