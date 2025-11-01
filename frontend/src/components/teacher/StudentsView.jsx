import { useState, useEffect } from 'react'
import teacherApi from '../../services/teacherApi'

function StudentsView() {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterClass, setFilterClass] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, classesRes] = await Promise.all([
          teacherApi.getStudents(),
          teacherApi.getClasses()
        ])
        setStudents(studentsRes.students || [])
        setClasses(classesRes.classes || [])
      } catch (error) {
        console.error('Failed to fetch students:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      (student.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading students...</p>
      </div>
    )
  }

  return (
    <>
      <div className="students-header">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="students-results">
        {filteredStudents.length > 0 ? (
          <div className="students-grid">
            {filteredStudents.map(student => {
              const displayName = `${student.first_name || ''} ${student.last_name || ''}`.trim() || student.email

              return (
                <div key={student.id} className="student-card">
                  <div className="student-avatar-large">👤</div>
                  <h3>{displayName}</h3>
                  <p className="student-email">{student.email}</p>
                  <p className="student-id">ID: {student.id}</p>
                  
                  <div className="student-stats">
                    <div className="student-stat">
                      <span className="stat-label">Enrolled</span>
                      <span className="stat-value">
                        {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <button 
                    className="btn-view-student"
                    onClick={() => setSelectedStudent(student)}
                  >
                    View Details
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
            <h3>No Students Found</h3>
            <p>No students match your search criteria</p>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal student-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Student Details</h3>
              <button className="modal-close" onClick={() => setSelectedStudent(null)}>
                ✕
              </button>
            </div>
            
            <div className="student-profile">
              <div className="profile-header">
                <div className="student-avatar-xl">👤</div>
                <div className="profile-info">
                  <h2>{`${selectedStudent.first_name || ''} ${selectedStudent.last_name || ''}`.trim() || selectedStudent.email}</h2>
                  <p>{selectedStudent.email}</p>
                  <p className="student-id-large">ID: {selectedStudent.id}</p>
                </div>
              </div>

              <div className="profile-section">
                <h4>Basic Information</h4>
                <p>Name: {`${selectedStudent.first_name || ''} ${selectedStudent.last_name || ''}`.trim() || 'N/A'}</p>
                <p>Email: {selectedStudent.email}</p>
                <p>Registered: {selectedStudent.created_at ? new Date(selectedStudent.created_at).toLocaleString() : 'N/A'}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setSelectedStudent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default StudentsView
