import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import teacherApi from '../../services/teacherApi'

function StudentGradesView() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState(null)
  const [stats, setStats] = useState(null)
  const [grades, setGrades] = useState([])
  const [selectedClass, setSelectedClass] = useState('all')
  const [classes, setClasses] = useState([])

  useEffect(() => {
    fetchStudentGrades()
  }, [studentId, selectedClass])

  const fetchStudentGrades = async () => {
    try {
      setLoading(true)
      const response = await teacherApi.getStudentGrades(studentId, selectedClass)
      setStudent(response.student)
      setStats(response.stats)
      setGrades(response.grades)
      
      // Extract unique classes from grades
      const uniqueClasses = [...new Map(
        response.grades.map(g => [g.classCode, { code: g.classCode, name: g.className, color: g.classColor }])
      ).values()]
      setClasses(uniqueClasses)
    } catch (error) {
      console.error('Failed to fetch student grades:', error)
      alert('获取学生成绩失败')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      submitted: { label: '已提交', color: '#3b82f6' },
      graded: { label: '已评分', color: '#10b981' },
      not_submitted: { label: '未提交', color: '#ef4444' },
      late: { label: '迟交', color: '#f59e0b' }
    }
    const statusInfo = statusMap[status] || statusMap.not_submitted
    return (
      <span className="status-badge" style={{ background: statusInfo.color }}>
        {statusInfo.label}
      </span>
    )
  }

  const getGradeColor = (percentage) => {
    if (!percentage) return '#9ca3af'
    if (percentage >= 90) return '#10b981'
    if (percentage >= 80) return '#3b82f6'
    if (percentage >= 70) return '#f59e0b'
    if (percentage >= 60) return '#ef4444'
    return '#ef4444'
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>加载中...</p>
      </div>
    )
  }

  if (!student) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
        <p>未找到学生</p>
        <button className="btn-secondary" onClick={() => navigate('/teacher/students')}>
          返回学生列表
        </button>
      </div>
    )
  }

  return (
    <div className="student-grades-view">
      {/* Header */}
      <div className="grades-header">
        <button className="btn-back" onClick={() => navigate('/teacher/students')}>
          ← 返回学生列表
        </button>
        
        <div className="student-info-card">
          <div className="student-avatar">
            {student.avatar ? (
              <img src={student.avatar} alt={`${student.firstName} ${student.lastName}`} />
            ) : (
              <div className="avatar-placeholder">
                {(student.firstName?.[0] || student.lastName?.[0] || '?').toUpperCase()}
              </div>
            )}
          </div>
          <div className="student-info-details">
            <h2>{student.firstName} {student.lastName}</h2>
            <p>{student.email}</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grades-stats-grid">
        <div className="stat-card">
          <h3>总成绩</h3>
          <p className="stat-value" style={{ color: getGradeColor(stats.overallGrade) }}>
            {stats.overallGrade !== null ? `${stats.overallGrade}%` : 'N/A'}
          </p>
          <p className="stat-label">加权平均分</p>
        </div>
        
        <div className="stat-card">
          <h3>已评分作业</h3>
          <p className="stat-value">{stats.gradedAssignments}/{stats.totalAssignments}</p>
          <p className="stat-label">
            {stats.totalAssignments > 0 
              ? `${Math.round((stats.gradedAssignments / stats.totalAssignments) * 100)}% 已评分`
              : '无作业'}
          </p>
        </div>
        
        <div className="stat-card">
          <h3>提交率</h3>
          <p className="stat-value">{stats.submittedCount}/{stats.totalAssignments}</p>
          <p className="stat-label">
            {stats.totalAssignments > 0 
              ? `${Math.round((stats.submittedCount / stats.totalAssignments) * 100)}% 已提交`
              : '无作业'}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="grades-filter">
        <label>筛选课程：</label>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="all">所有课程</option>
          {classes.map(cls => (
            <option key={cls.code} value={cls.code}>{cls.name}</option>
          ))}
        </select>
      </div>

      {/* Grades Table */}
      <div className="grades-table-container">
        <table className="grades-table">
          <thead>
            <tr>
              <th>作业名称</th>
              <th>课程</th>
              <th>截止日期</th>
              <th>总分</th>
              <th>得分</th>
              <th>百分比</th>
              <th>权重</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {grades.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                  暂无成绩数据
                </td>
              </tr>
            ) : (
              grades.map(grade => (
                <tr key={grade.assignmentId}>
                  <td>
                    <strong>{grade.assignmentTitle}</strong>
                    {grade.feedback && (
                      <div className="grade-feedback">
                        <small>💬 {grade.feedback}</small>
                      </div>
                    )}
                  </td>
                  <td>
                    <span 
                      className="class-badge" 
                      style={{ background: grade.classColor || '#3b82f6' }}
                    >
                      {grade.classCode}
                    </span>
                  </td>
                  <td>
                    {grade.dueDate 
                      ? `${new Date(grade.dueDate).toLocaleDateString('zh-CN')} ${grade.dueTime || ''}`
                      : 'N/A'}
                  </td>
                  <td>{grade.totalPoints || 'N/A'}</td>
                  <td>
                    {grade.grade !== null ? (
                      <strong style={{ color: getGradeColor(grade.percentage) }}>
                        {grade.grade}
                      </strong>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>-</span>
                    )}
                  </td>
                  <td>
                    {grade.percentage !== null ? (
                      <span style={{ color: getGradeColor(grade.percentage), fontWeight: 600 }}>
                        {grade.percentage}%
                      </span>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>-</span>
                    )}
                  </td>
                  <td>{grade.weight ? `${grade.weight}%` : 'N/A'}</td>
                  <td>{getStatusBadge(grade.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentGradesView

