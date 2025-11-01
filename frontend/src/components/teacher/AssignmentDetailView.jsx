import { useEffect, useState } from 'react'
import teacherApi from '../../services/teacherApi'
import './CreateAssignmentView.css'

function AssignmentDetailView({ assignmentId, onBack }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [assignment, setAssignment] = useState(null)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true)
        const res = await teacherApi.getAssignmentById(assignmentId)
        setAssignment(res.assignment)
      } catch (err) {
        console.error('Failed to fetch assignment:', err)
        setError('Failed to load assignment')
      } finally {
        setLoading(false)
      }
    }
    if (assignmentId) fetchDetails()
  }, [assignmentId])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading assignment...</p>
      </div>
    )
  }

  if (error || !assignment) {
    return (
      <div className="create-assignment-view">
        <div className="create-assignment-header">
          <button className="btn-back" onClick={onBack}>← Back to Assignments</button>
          <h2>Assignment Details</h2>
        </div>
        <div className="assignment-form">
          <p style={{ color: '#c53030' }}>{error || 'Assignment not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="create-assignment-view">
      <div className="create-assignment-header">
        <button className="btn-back" onClick={onBack}>← Back to Assignments</button>
        <h2>{assignment.title}</h2>
      </div>

      <div className="assignment-form">
        <div className="form-section">
          <h3>Overview</h3>
          <div className="assignment-overview">
            <p><strong>Class:</strong> {assignment.className || assignment.classCode || '—'}</p>
            <p><strong>Due Date:</strong> {assignment.due_date || assignment.dueDate || '—'}</p>
            <p><strong>Type:</strong> {assignment.submission_type || assignment.assignment_type || 'homework'}</p>
            <p><strong>Total Points:</strong> {assignment.total_points || assignment.totalPoints || 100}</p>
            <p><strong>Status:</strong> {assignment.status || 'draft'}</p>
          </div>
          {assignment.description && (
            <div className="form-group">
              <label>Description</label>
              <textarea value={assignment.description} readOnly rows="3" />
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Questions</h3>
          {(assignment.questions || []).length === 0 ? (
            <p style={{ color: '#718096' }}>No questions found for this assignment.</p>
          ) : (
            <div className="questions-list">
              {(assignment.questions || []).map((q, idx) => (
                <div key={q.id || idx} className="question-item">
                  <div className="question-header">
                    <span className="question-number">Q{q.position || idx + 1}</span>
                    <span className="assignment-type">{q.type?.replace('_', ' ') || 'question'}</span>
                    <span className="assignment-type">{q.points} pts</span>
                  </div>
                  <div className="question-text">
                    {q.question}
                  </div>
                  {Array.isArray(q.options) && q.options.length > 0 && (
                    <ul className="options-list">
                      {q.options.map((opt) => (
                        <li key={opt.option_key || opt.key} className="option-input">
                          <strong>{opt.option_key || opt.key}.</strong> {opt.text}
                          {opt.is_correct ? ' ✓' : ''}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Rubric</h3>
          <div className="rubric-display">
            <div className="rubric-total">Total: {assignment.total_points || assignment.totalPoints || 100} pts</div>
            {(assignment.rubric || []).length === 0 ? (
              <p style={{ color: '#718096' }}>No rubric items saved in database (they are stored in a separate table if used).</p>
            ) : (
              (assignment.rubric || []).map((item, idx) => (
                <div className="rubric-criterion" key={idx}>
                  <h4>{item.criteria} — {item.points} pts</h4>
                  {item.description && <p>{item.description}</p>}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-cancel" onClick={onBack}>Back</button>
        </div>
      </div>
    </div>
  )
}

export default AssignmentDetailView


