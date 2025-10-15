function ClassesView({ enrolledClasses }) {
  return (
    <div className="classes-grid">
      {enrolledClasses.map(course => (
        <div key={course.id} className="class-card-detailed" style={{ borderTop: `4px solid ${course.color}` }}>
          <div className="class-card-header">
            <div className="class-icon" style={{ background: `${course.color}20`, color: course.color }}>
              📚
            </div>
            <span className="class-grade-large" style={{ background: `${course.color}20`, color: course.color }}>
              {course.grade}
            </span>
          </div>
          <h3>{course.name}</h3>
          <p className="class-info">{course.code}</p>
          <p className="class-teacher">👨‍🏫 {course.teacher}</p>
          <div className="class-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${course.progress}%`, background: course.color }}
              ></div>
            </div>
            <span className="progress-text">{course.progress}% Complete</span>
          </div>
          <div className="class-stats">
            <div className="stat-item">
              <span className="stat-label">Next Class</span>
              <span className="stat-value">{course.nextClass}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Assignments</span>
              <span className="stat-value">{course.assignments} pending</span>
            </div>
          </div>
          <button className="btn-class-action" style={{ background: course.color }}>
            Go to Class
          </button>
        </div>
      ))}
    </div>
  )
}

export default ClassesView

