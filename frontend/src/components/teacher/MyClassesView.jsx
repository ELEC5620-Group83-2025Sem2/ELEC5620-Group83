import { teacherClasses } from './teacherMockData'

function MyClassesView({ onClassClick }) {
  return (
    <div className="classes-view">
      <div className="classes-grid">
        {teacherClasses.map(classItem => (
          <div
            key={classItem.id}
            className="class-card-detailed"
            style={{ borderTop: `4px solid ${classItem.color}` }}
          >
            <div className="class-card-header">
              <div className="class-icon" style={{ background: `${classItem.color}20`, color: classItem.color }}>
                📚
              </div>
              <span className="class-grade-large" style={{ background: `${classItem.color}20`, color: classItem.color }}>
                {classItem.averageGrade}
              </span>
            </div>
            
            <h3>{classItem.name}</h3>
            <p className="class-info">{classItem.code}</p>
            <p className="class-period">{classItem.period}</p>
            
            <div className="class-description">
              <p>{classItem.description}</p>
            </div>

            <div className="class-stats">
              <div className="stat-item">
                <span className="stat-label">Students</span>
                <span className="stat-value">{classItem.studentsCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Avg Grade</span>
                <span className="stat-value">{classItem.averageGrade}</span>
              </div>
            </div>

            <div className="class-stats">
              <div className="stat-item">
                <span className="stat-label">Upcoming Assignments</span>
                <span className="stat-value">{classItem.upcomingAssignments}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Pending Grading</span>
                <span className="stat-value pending-highlight">{classItem.pendingGrading}</span>
              </div>
            </div>

            <div className="class-schedule-preview">
              <h4>Schedule</h4>
              {classItem.schedule.map((session, idx) => (
                <div key={idx} className="schedule-preview-item">
                  <span>{session.day}</span>
                  <span>{session.time}</span>
                </div>
              ))}
            </div>

            <button
              className="btn-class-action"
              style={{ background: classItem.color }}
              onClick={() => onClassClick(classItem.id)}
            >
              Manage Class
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyClassesView

