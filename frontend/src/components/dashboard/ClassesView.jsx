function ClassesView({ enrolledClasses, onClassClick }) {
  // Calculate progress percentage based on completed assignments
  const calculateProgress = (course) => {
    const total = course.assignmentCount || 0;
    const completed = course.completedAssignments || 0;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="classes-grid">
      {enrolledClasses.map(course => {
        const progress = calculateProgress(course);
        return (
          <div key={course.id} className="class-card-detailed" style={{ borderTop: `4px solid ${course.color}` }}>
            <div className="class-card-header">
              <div className="class-icon" style={{ background: `${course.color}20`, color: course.color }}>
                📚
              </div>
              <span className="class-grade-large" style={{ background: `${course.color}20`, color: course.color }}>
                {course.studentAvgGrade}
              </span>
            </div>
            <h3>{course.name}</h3>
            <p className="class-info">{course.code}</p>
            <p className="class-teacher">👨‍🏫 {course.teacher}</p>
            <div className="class-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%`, background: course.color }}
                ></div>
              </div>
              <span className="progress-text">{progress}% Complete</span>
            </div>
            <div className="class-stats">
              <div className="stat-item">
                <span className="stat-label">Assignments</span>
                <span className="stat-value">{course.upcomingAssignments} upcoming</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Completed</span>
                <span className="stat-value">{course.completedAssignments} of {course.assignmentCount}</span>
              </div>
            </div>
            <button 
              className="btn-class-action" 
              style={{ background: course.color }}
              onClick={() => onClassClick(course.id)}
            >
              Go to Class
            </button>
          </div>
        );
      })}
    </div>
  )
}

export default ClassesView

