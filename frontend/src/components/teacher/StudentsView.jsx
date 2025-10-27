import { useState } from 'react'
import { studentsList, teacherClasses } from './teacherMockData'

function StudentsView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterClass, setFilterClass] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState(null)

  // Filter students
  const filteredStudents = studentsList.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = filterClass === 'all' || student.classes.includes(filterClass)
    return matchesSearch && matchesClass
  })

  const getStudentClasses = (classIds) => {
    return teacherClasses.filter(c => classIds.includes(c.id))
  }

  return (
    <div className="students-view">
      {/* Search and Filters */}
      <div className="students-header">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="filter-group">
          <label>Filter by Class:</label>
          <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="all">All Classes</option>
            {teacherClasses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="students-results">
        <p>Showing {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Students Grid */}
      <div className="students-grid">
        {filteredStudents.map(student => (
          <div
            key={student.id}
            className="student-card"
            onClick={() => setSelectedStudent(student)}
          >
            <div className="student-avatar-large">{student.avatar}</div>
            <h3>{student.name}</h3>
            <p className="student-email">{student.email}</p>
            <p className="student-id">ID: {student.studentId}</p>
            
            <div className="student-stats">
              <div className="student-stat">
                <span className="stat-label">Overall Grade</span>
                <span className="stat-value">{student.overallGrade}</span>
              </div>
              <div className="student-stat">
                <span className="stat-label">Attendance</span>
                <span className="stat-value">{student.attendance}%</span>
              </div>
            </div>

            <div className="student-classes-tags">
              {getStudentClasses(student.classes).map(c => (
                <span key={c.id} className="class-tag" style={{ background: `${c.color}20`, color: c.color }}>
                  {c.code}
                </span>
              ))}
            </div>

            <div className="student-recent-activity">
              <small>{student.recentActivity}</small>
            </div>

            <button className="btn-view-student">View Profile</button>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="empty-state">
          <p>No students found</p>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal student-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedStudent.name} - Profile</h3>
              <button className="modal-close" onClick={() => setSelectedStudent(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="student-profile">
                <div className="profile-header">
                  <div className="student-avatar-xl">{selectedStudent.avatar}</div>
                  <div className="profile-info">
                    <h2>{selectedStudent.name}</h2>
                    <p>{selectedStudent.email}</p>
                    <p className="student-id-large">ID: {selectedStudent.studentId}</p>
                  </div>
                </div>

                <div className="profile-stats-grid">
                  <div className="profile-stat-card">
                    <h4>Overall Grade</h4>
                    <p className="stat-large">{selectedStudent.overallGrade}</p>
                  </div>
                  <div className="profile-stat-card">
                    <h4>Attendance</h4>
                    <p className="stat-large">{selectedStudent.attendance}%</p>
                  </div>
                  <div className="profile-stat-card">
                    <h4>Classes</h4>
                    <p className="stat-large">{selectedStudent.classes.length}</p>
                  </div>
                </div>

                <div className="profile-section">
                  <h4>Enrolled Classes</h4>
                  <div className="profile-classes-list">
                    {getStudentClasses(selectedStudent.classes).map(c => (
                      <div key={c.id} className="profile-class-item" style={{ borderLeft: `4px solid ${c.color}` }}>
                        <div>
                          <h5>{c.name}</h5>
                          <p>{c.code}</p>
                        </div>
                        <span className="class-grade-badge" style={{ background: `${c.color}20`, color: c.color }}>
                          {c.averageGrade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="profile-section">
                  <h4>Recent Activity</h4>
                  <p>{selectedStudent.recentActivity}</p>
                </div>

                <div className="profile-section">
                  <h4>Notes</h4>
                  <textarea
                    className="notes-textarea"
                    placeholder="Add notes about this student..."
                    rows="4"
                  />
                  <button className="btn-save-notes">Save Notes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentsView

