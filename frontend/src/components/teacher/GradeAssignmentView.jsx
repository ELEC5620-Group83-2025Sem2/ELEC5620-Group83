import { useState, useEffect } from 'react'
import teacherApi from '../../services/teacherApi'
import './GradeAssignmentView.css'

function GradeAssignmentView({ assignmentId, onBack }) {
  const [assignment, setAssignment] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [gradeData, setGradeData] = useState({
    grade: '',
    feedback: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aiGrading, setAiGrading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentRes, submissionsRes] = await Promise.all([
          teacherApi.getAssignmentById(assignmentId),
          teacherApi.getAssignmentSubmissions(assignmentId)
        ])
        
        // Backend returns { assignment: {...} } not { data: {...} }
        const assignment = assignmentRes.assignment || assignmentRes.data
        const submissions = submissionsRes.submissions || submissionsRes.data || []
        
        if (!assignment) {
          console.error('Assignment not found in response:', assignmentRes)
          return
        }
        
        setAssignment(assignment)
        setSubmissions(submissions)
        
        // Select first submission if available
        if (submissions.length > 0) {
          handleSelectSubmission(submissions[0])
        }
      } catch (error) {
        console.error('Failed to fetch assignment data:', error)
        // Set assignment to null to show error message
        setAssignment(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [assignmentId])

  const handleSelectSubmission = (submission) => {
    setSelectedSubmission(submission)
    setGradeData({
      grade: submission.grade || '',
      feedback: submission.feedback || ''
    })
  }

  const handleGradeChange = (e) => {
    const { name, value } = e.target
    setGradeData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveGrade = async () => {
    if (!selectedSubmission) return

    if (!gradeData.grade) {
      alert('Please enter a grade')
      return
    }

    setSaving(true)
    try {
      await teacherApi.gradeSubmission(assignmentId, selectedSubmission.id, gradeData)
      
      // Update local submissions list
      setSubmissions(prev => prev.map(sub => 
        sub.id === selectedSubmission.id 
          ? { ...sub, grade: gradeData.grade, feedback: gradeData.feedback, status: 'graded' }
          : sub
      ))
      
      alert('Grade saved successfully!')
      
      // Move to next submission if available
      const currentIndex = submissions.findIndex(s => s.id === selectedSubmission.id)
      if (currentIndex < submissions.length - 1) {
        handleSelectSubmission(submissions[currentIndex + 1])
      }
    } catch (error) {
      console.error('Failed to save grade:', error)
      alert('Failed to save grade. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleAIAutoGrade = async () => {
    if (!selectedSubmission || !assignment) return
    
    const confirmed = window.confirm(
      'Use AI to automatically grade this submission? You can review and modify the grade before saving.'
    )
    if (!confirmed) return

    setAiGrading(true)
    try {
      // Call AI auto-grade API
      const response = await teacherApi.autoGradeSubmission(selectedSubmission.id, assignmentId)
      
      if (response.data) {
        // Update grade data with AI suggestion
        setGradeData({
          grade: response.data.grade || '',
          feedback: response.data.feedback || ''
        })
        
        alert(`AI Grading Complete!\nSuggested Grade: ${response.data.grade}\n\nPlease review and save if you agree.`)
      }
    } catch (error) {
      console.error('AI grading failed:', error)
      alert('AI grading failed. Please grade manually.')
    } finally {
      setAiGrading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading assignment data...</p>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
        <h3>Assignment Not Found</h3>
        <button className="btn-back" onClick={onBack}>
          ← Back to Assignments
        </button>
      </div>
    )
  }

  return (
    <div className="grade-assignment-view">
      {/* Header */}
      <div className="grade-header">
        <button className="btn-back" onClick={onBack}>
          ← Back to Assignments
        </button>
        <div className="assignment-meta">
          <h2>{assignment.title}</h2>
          <div className="grade-stats">
            <span>Total Submissions: {submissions.length}</span>
            <span>Graded: {submissions.filter(s => s.status === 'graded').length}</span>
            <span>Pending: {submissions.filter(s => s.status !== 'graded').length}</span>
          </div>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <h3>No Submissions Yet</h3>
          <p>No students have submitted this assignment yet</p>
        </div>
      ) : (
        <div className="grading-container">
          {/* Submissions List */}
          <div className="submissions-list">
            <h3>Submissions</h3>
            {submissions.map(submission => {
              // Support both submission.profiles and submission.student formats
              const student = submission.student || submission.profiles
              const studentName = student
                ? `${student.first_name || ''} ${student.last_name || ''}`.trim() || student.email
                : 'Unknown Student'

              return (
                <div
                  key={submission.id}
                  className={`submission-item ${selectedSubmission?.id === submission.id ? 'active' : ''}`}
                  onClick={() => handleSelectSubmission(submission)}
                >
                  <div className="submission-student">
                    <span className="student-avatar">👤</span>
                    <span className="student-name">{studentName}</span>
                  </div>
                  <div className="submission-date">
                    {new Date(submission.submitted_at).toLocaleDateString()}
                  </div>
                  <span className={`submission-status ${submission.status === 'graded' ? 'graded-badge' : 'pending-badge'}`}>
                    {submission.status === 'graded' ? 'Graded' : 'Pending'}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Grading Panel */}
          {selectedSubmission && (
            <div className="grading-panel">
              <div className="submission-header">
                <h3>
                  {selectedSubmission.profiles 
                    ? `${selectedSubmission.profiles.first_name || ''} ${selectedSubmission.profiles.last_name || ''}`.trim() || selectedSubmission.profiles.email
                    : 'Unknown Student'
                  }'s Submission
                </h3>
                <span className="submission-date">
                  Submitted {new Date(selectedSubmission.submitted_at).toLocaleString()}
                </span>
              </div>

              {/* AI Auto-Grade Button */}
              <div className="ai-grade-button-container">
                <button 
                  className="btn-ai-grade" 
                  onClick={handleAIAutoGrade}
                  disabled={aiGrading || !selectedSubmission}
                >
                  {aiGrading ? (
                    <>
                      <span className="spinner"></span> AI Grading...
                    </>
                  ) : (
                    <>
                      <span>✨</span> AI Auto-Grade
                    </>
                  )}
                </button>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                  AI will analyze the submission and suggest a grade with feedback
                </p>
              </div>

              {/* Submission Content */}
              <div className="submission-content">
                <h4>Submission Content</h4>
                <div className="content-box">
                  <p>{selectedSubmission.submission_content || 'No text content'}</p>
                  {selectedSubmission.submission_file_url && (
                    <div className="attachments">
                      <p>📎 Attachment: <a href={selectedSubmission.submission_file_url} target="_blank" rel="noopener noreferrer">View File</a></p>
                    </div>
                  )}
                </div>
              </div>

              {/* Grading Form */}
              <div className="grading-form">
                <div className="form-group">
                  <label>Grade (out of {assignment.total_points || 100})</label>
                  <input
                    type="number"
                    name="grade"
                    className="grade-input"
                    value={gradeData.grade}
                    onChange={handleGradeChange}
                    max={assignment.total_points || 100}
                    min="0"
                    placeholder="Enter grade"
                  />
                </div>

                <div className="form-group">
                  <label>Feedback Comments</label>
                  <textarea
                    name="feedback"
                    className="feedback-textarea"
                    value={gradeData.feedback}
                    onChange={handleGradeChange}
                    rows="6"
                    placeholder="Enter feedback comments..."
                  />
                </div>

                <div className="grading-actions">
                  <button 
                    className="btn-save-grade"
                    onClick={handleSaveGrade}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Grade'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GradeAssignmentView
