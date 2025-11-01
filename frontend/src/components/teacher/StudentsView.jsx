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
        const studentsData = studentsRes.students || []
        console.log('Students data:', studentsData)
        if (studentsData.length > 0) {
          console.log('First student data:', studentsData[0])
          console.log('First student enrolled_at:', studentsData[0].enrolled_at)
          console.log('First student classes:', studentsData[0].classes)
        }
        setStudents(studentsData)
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
              // Support both snake_case (first_name) and camelCase (firstName) from backend
              const firstName = student.firstName || student.first_name || '';
              const lastName = student.lastName || student.last_name || '';
              const fullName = `${firstName} ${lastName}`.trim();
              const displayName = fullName || student.name || student.email;

              return (
                <div key={student.id} className="student-card">
                  <div className="student-avatar-large">👤</div>
                  <h3>{displayName}</h3>
                  <p className="student-email">{student.email}</p>
                  {/* Hide UUID - email is sufficient for identification */}
                  {/* <p className="student-id">ID: {student.id?.substring(0, 8)}...</p> */}
                  
                  <div className="student-stats">
                    <div className="student-stat">
                      <span className="stat-label">Enrolled</span>
                      <span className="stat-value">
                        {/* Priority: 1. classes[0].enrolledAt (from enrollments.enrolled_at), 2. student.enrolled_at, 3. created_at */}
                        {student.classes && student.classes.length > 0 && student.classes[0].enrolledAt
                          ? new Date(student.classes[0].enrolledAt).toLocaleDateString()
                          : (student.enrolled_at 
                              ? new Date(student.enrolled_at).toLocaleDateString()
                              : (student.created_at 
                                  ? new Date(student.created_at).toLocaleDateString() 
                                  : 'N/A'))}
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
                  {/* Support both snake_case (first_name) and camelCase (firstName) from backend */}
                  <h2>{(() => {
                    const firstName = selectedStudent.firstName || selectedStudent.first_name || '';
                    const lastName = selectedStudent.lastName || selectedStudent.last_name || '';
                    const fullName = `${firstName} ${lastName}`.trim();
                    return fullName || selectedStudent.name || selectedStudent.email;
                  })()}</h2>
                  <p>{selectedStudent.email}</p>
                  {/* Hide UUID - email is sufficient for identification */}
                  {/* <p className="student-id-large">ID: {selectedStudent.id?.substring(0, 8)}...</p> */}
                </div>
              </div>

              <div className="profile-section">
                <h4>Basic Information</h4>
                <p>Name: {(() => {
                  // Support both snake_case (first_name) and camelCase (firstName) from backend
                  const firstName = selectedStudent.firstName || selectedStudent.first_name || '';
                  const lastName = selectedStudent.lastName || selectedStudent.last_name || '';
                  const fullName = `${firstName} ${lastName}`.trim();
                  // Fallback to name field, then email
                  return fullName || selectedStudent.name || selectedStudent.email || 'N/A';
                })()}</p>
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
