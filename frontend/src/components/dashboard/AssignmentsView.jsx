import { getDaysUntilDue } from './mockData'

function AssignmentsView({ upcomingAssignments, onAssignmentClick }) {
  return (
    <div className="assignments-detailed">
      {upcomingAssignments.map(assignment => (
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
      ))}
    </div>
  )
}

export default AssignmentsView

