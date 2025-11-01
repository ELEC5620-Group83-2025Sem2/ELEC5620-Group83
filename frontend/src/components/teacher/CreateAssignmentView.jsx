import { useState, useEffect } from 'react'
import teacherApi from '../../services/teacherApi'
import './CreateAssignmentView.css'

function CreateAssignmentView({ assignmentId, classId, onBack }) {
  const [classes, setClasses] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    class_id: classId || '',
    due_date: '',
    total_points: 100,
    assignment_type: 'homework',
    instructions: '',
    requirements: '',
    submission_type: 'online',
    rubric: [],
    questions: []
  })
  const [loading, setLoading] = useState(false)
  const [rubricLoading, setRubricLoading] = useState(false)
  const [rubricError, setRubricError] = useState('')
  const [assignmentGenLoading, setAssignmentGenLoading] = useState(false)
  const [assignmentGenError, setAssignmentGenError] = useState('')

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await teacherApi.getClasses()
        setClasses(response.classes || [])
      } catch (error) {
        console.error('Failed to fetch classes:', error)
      }
    }

    fetchClasses()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.class_id) {
      alert('Please enter a title and select a class')
      return
    }

    setLoading(true)
    try {
      // Map to backend expected payload
      const payload = {
        classId: formData.class_id,
        title: formData.title,
        description: formData.description,
        instructions: [],
        dueDate: formData.due_date,
        totalPoints: Number(formData.total_points) || 100,
        rubric: formData.rubric || [],
        questions: formData.questions || [],
        resources: []
      }
      await teacherApi.createAssignment(payload)
      alert('Assignment created successfully!')
      onBack()
    } catch (error) {
      console.error('Failed to create assignment:', error)
      alert('Failed to create assignment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateRubric = async () => {
    if (!formData.title) {
      alert('Please enter an assignment title first')
      return
    }
    setRubricError('')
    setRubricLoading(true)
    try {
      const qs = Array.isArray(formData.questions) ? formData.questions : []
      const summary = qs.reduce((acc, q) => {
        const t = q.type || 'text'
        const pts = Number(q.points) || 0
        acc.total += 1
        acc.points_total += pts
        acc.counts[t] = (acc.counts[t] || 0) + 1
        acc.points_by_type[t] = (acc.points_by_type[t] || 0) + pts
        return acc
      }, { total: 0, points_total: 0, counts: {}, points_by_type: {} })
      const payload = {
        assignment_title: formData.title,
        assignment_description: formData.description,
        submission_type: formData.submission_type,
        total_points: Number(formData.total_points) || 100,
        question_summary: summary
      }
      const res = await teacherApi.generateRubric(payload)
      const rubric = res?.rubric || []
      setFormData(prev => ({ ...prev, rubric }))
    } catch (err) {
      console.error('Failed to generate rubric:', err)
      setRubricError('Failed to generate rubric. Please try again later.')
    } finally {
      setRubricLoading(false)
    }
  }

  const handleAddRubricItem = () => {
    setFormData(prev => ({
      ...prev,
      rubric: [...(prev.rubric || []), { criteria: '', description: '', points: 0, levels: { excellent: '', good: '', fair: '', poor: '' } }]
    }))
  }

  const handleUpdateRubricItem = (index, field, value) => {
    setFormData(prev => {
      const next = [...(prev.rubric || [])]
      if (!next[index]) return prev
      if (field.startsWith('levels.')) {
        const key = field.split('.')[1]
        next[index] = { ...next[index], levels: { ...(next[index].levels || {}), [key]: value } }
      } else {
        next[index] = { ...next[index], [field]: field === 'points' ? Number(value) || 0 : value }
      }
      return { ...prev, rubric: next }
    })
  }

  const handleRemoveRubricItem = (index) => {
    setFormData(prev => ({
      ...prev,
      rubric: (prev.rubric || []).filter((_, i) => i !== index)
    }))
  }

  const handleAddQuestion = (type = 'multiple_choice') => {
    const base = type === 'multiple_choice'
      ? { type: 'multiple_choice', question: '', points: 5, options: [''], answer: '' }
      : { type: 'text', prompt: '', points: 10, expected_answer: '' }
    setFormData(prev => ({ ...prev, questions: [...(prev.questions || []), base] }))
  }

  const handleUpdateQuestion = (index, field, value) => {
    setFormData(prev => {
      const next = [...(prev.questions || [])]
      if (!next[index]) return prev
      next[index] = { ...next[index], [field]: field === 'points' ? Number(value) || 0 : value }
      return { ...prev, questions: next }
    })
  }

  const handleMCQOptionChange = (qIndex, optIndex, value) => {
    setFormData(prev => {
      const questions = [...(prev.questions || [])]
      const q = { ...(questions[qIndex] || {}) }
      const options = [...(q.options || [])]
      options[optIndex] = value
      q.options = options
      questions[qIndex] = q
      return { ...prev, questions }
    })
  }

  const handleAddMCQOption = (qIndex) => {
    setFormData(prev => {
      const questions = [...(prev.questions || [])]
      const q = { ...(questions[qIndex] || {}) }
      q.options = [...(q.options || []), '']
      questions[qIndex] = q
      return { ...prev, questions }
    })
  }

  const handleRemoveQuestion = (index) => {
    setFormData(prev => ({ ...prev, questions: (prev.questions || []).filter((_, i) => i !== index) }))
  }

  const handleGenerateAssignment = async () => {
    if (!formData.title) {
      alert('Please enter a title or topic for the assignment')
      return
    }
    setAssignmentGenError('')
    setAssignmentGenLoading(true)
    try {
      const selectedClass = classes.find(cls => String(cls.id) === String(formData.class_id))
      const classContext = selectedClass?.name || ''
      const mcqOnly = /mcq\s*only/i.test(formData.title || '') || formData.assignment_type === 'quiz'
      const params = {
        subject: classContext, // help the model infer domain from class name
        class_context: classContext,
        topic: formData.title,
        difficulty: 'medium',
        assignment_type: formData.assignment_type === 'quiz' ? 'quiz' : (formData.assignment_type === 'project' ? 'project' : 'problem_set'),
        question_count: 6,
        mcq_only: mcqOnly
      }
      const res = await teacherApi.generateAssignment(params)
      const a = res?.assignment
      if (a) {
        setFormData(prev => ({
          ...prev,
          title: a.title || prev.title,
          description: a.description || prev.description,
          total_points: a.total_points || prev.total_points,
          submission_type: a.submission_type || prev.submission_type,
          // generate-assignment no longer returns rubric; keep existing if any
          rubric: Array.isArray(a.rubric) ? a.rubric : prev.rubric,
          questions: Array.isArray(a.questions) ? a.questions : prev.questions
        }))
      }
    } catch (err) {
      console.error('Failed to generate assignment:', err)
      setAssignmentGenError('Failed to generate assignment. Please try again later.')
    } finally {
      setAssignmentGenLoading(false)
    }
  }

  return (
    <div className="create-assignment-view">
      <div className="create-assignment-header">
        <button className="btn-back" onClick={onBack}>
          ← Back to Assignments
        </button>
        <h2>{assignmentId ? 'Edit Assignment' : 'Create New Assignment'}</h2>
      </div>

      <form className="assignment-form" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label>Assignment Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter assignment title"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Class *</label>
              <select
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Assignment Type</label>
              <select
                name="assignment_type"
                value={formData.assignment_type}
                onChange={handleChange}
              >
                <option value="homework">Homework</option>
                <option value="quiz">Quiz</option>
                <option value="test">Test</option>
                <option value="project">Project</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="datetime-local"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Total Points</label>
              <input
                type="number"
                name="total_points"
                value={formData.total_points}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter assignment description..."
            />
          </div>

          <div className="form-group">
            <label>Instructions</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows="4"
              placeholder="Enter assignment instructions..."
            />
          </div>

          <div className="form-group">
            <label>Requirements</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="4"
              placeholder="Enter assignment requirements..."
            />
          </div>

          <div className="form-group">
            <label>Submission Type</label>
            <select
              name="submission_type"
              value={formData.submission_type}
              onChange={handleChange}
            >
              <option value="online">Online Submission</option>
              <option value="in-person">In-Person Submission</option>
              <option value="quiz">Online Quiz</option>
            </select>
          </div>
        </div>

        {/* AI Features Section */}
        <div className="form-section ai-section">
          <h3>AI Assistant Tools <span className="ai-badge">AI Powered</span></h3>
          <p className="section-description">Use AI features to generate grading criteria tailored to your assignment.</p>
          
          <div className="ai-tools-grid">
            <button type="button" className="ai-tool-button" onClick={handleGenerateAssignment} disabled={assignmentGenLoading}>
              <span className="ai-tool-icon">✨</span>
              <div>
                <h4>{assignmentGenLoading ? 'Generating Assignment...' : 'Generate Assignment'}</h4>
                <p>AI creates assignment content</p>
              </div>
            </button>

            <button type="button" className="ai-tool-button" onClick={handleGenerateRubric} disabled={rubricLoading}>
              <span className="ai-tool-icon">📋</span>
              <div>
                <h4>{rubricLoading ? 'Generating Rubric...' : 'Generate Rubric'}</h4>
                <p>AI generates grading rubric</p>
              </div>
            </button>

            <button type="button" className="ai-tool-button" disabled>
              <span className="ai-tool-icon">❓</span>
              <div>
                <h4>Suggest Questions</h4>
                <p>AI recommends relevant questions</p>
              </div>
            </button>
          </div>

          {assignmentGenError && (
            <div className="error-text" style={{ marginTop: '0.75rem' }}>{assignmentGenError}</div>
          )}

          {rubricError && (
            <div className="error-text" style={{ marginTop: '0.75rem' }}>{rubricError}</div>
          )}

          {Array.isArray(formData.rubric) && formData.rubric.length > 0 && (
            <div className="rubric-preview" style={{ marginTop: '1rem' }}>
              <h4>Rubric Preview</h4>
              <ul>
                {formData.rubric.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>
                    <strong>{item.criteria}</strong> — {item.points} pts
                    {item.description ? <div style={{ fontSize: '0.9rem' }}>{item.description}</div> : null}
                  </li>
                ))}
              </ul>
              <div style={{ fontWeight: 600 }}>Total: {formData.rubric.reduce((s, c) => s + (Number(c.points) || 0), 0)} pts</div>
            </div>
          )}
        </div>

        {/* Manual Rubric Builder */}
        <div className="form-section">
          <h3>Rubric</h3>
          <button type="button" className="btn-secondary" onClick={handleAddRubricItem}>Add Criterion</button>
          {(formData.rubric || []).map((r, idx) => (
            <div key={idx} className="form-row" style={{ marginTop: '0.75rem' }}>
              <div className="form-group" style={{ flex: 2 }}>
                <label>Criterion</label>
                <input type="text" value={r.criteria || ''} onChange={(e) => handleUpdateRubricItem(idx, 'criteria', e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Points</label>
                <input type="number" value={r.points || 0} onChange={(e) => handleUpdateRubricItem(idx, 'points', e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: 5 }}>
                <label>Description</label>
                <input type="text" value={r.description || ''} onChange={(e) => handleUpdateRubricItem(idx, 'description', e.target.value)} />
              </div>
              <div className="form-group" style={{ alignSelf: 'flex-end' }}>
                <button type="button" className="btn-danger" onClick={() => handleRemoveRubricItem(idx)}>Remove</button>
              </div>
              <div className="form-group" style={{ flexBasis: '100%' }}>
                <label>Levels (optional)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  <input placeholder="Excellent" value={r.levels?.excellent || ''} onChange={(e) => handleUpdateRubricItem(idx, 'levels.excellent', e.target.value)} />
                  <input placeholder="Good" value={r.levels?.good || ''} onChange={(e) => handleUpdateRubricItem(idx, 'levels.good', e.target.value)} />
                  <input placeholder="Fair" value={r.levels?.fair || ''} onChange={(e) => handleUpdateRubricItem(idx, 'levels.fair', e.target.value)} />
                  <input placeholder="Poor" value={r.levels?.poor || ''} onChange={(e) => handleUpdateRubricItem(idx, 'levels.poor', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Questions Builder */}
        <div className="form-section">
          <h3>Questions</h3>
          <div className="form-row">
            <button type="button" className="btn-secondary" onClick={() => handleAddQuestion('multiple_choice')}>Add MCQ</button>
            <button type="button" className="btn-secondary" onClick={() => handleAddQuestion('text')}>Add Text/Short Answer</button>
          </div>
          {(formData.questions || []).map((q, idx) => (
            <div key={idx} className="form-section" style={{ border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '8px', marginTop: '0.75rem' }}>
              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select value={q.type} onChange={(e) => handleUpdateQuestion(idx, 'type', e.target.value)}>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="short_answer">Short Answer</option>
                    <option value="text">Text</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Points</label>
                  <input type="number" value={q.points || 0} onChange={(e) => handleUpdateQuestion(idx, 'points', e.target.value)} />
                </div>
                <div className="form-group" style={{ alignSelf: 'flex-end' }}>
                  <button type="button" className="btn-danger" onClick={() => handleRemoveQuestion(idx)}>Remove</button>
                </div>
              </div>

              {q.type === 'multiple_choice' ? (
                <>
                  <div className="form-group">
                    <label>Question</label>
                    <textarea rows="2" value={q.question || ''} onChange={(e) => handleUpdateQuestion(idx, 'question', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Options</label>
                    {(q.options || []).map((opt, oIdx) => (
                      <div key={oIdx} className="form-row">
                        <input type="text" value={opt} onChange={(e) => handleMCQOptionChange(idx, oIdx, e.target.value)} />
                      </div>
                    ))}
                    <button type="button" className="btn-secondary" onClick={() => handleAddMCQOption(idx)}>Add Option</button>
                  </div>
                  <div className="form-group">
                    <label>Correct Answer</label>
                    <input type="text" value={q.answer || ''} onChange={(e) => handleUpdateQuestion(idx, 'answer', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Explanation (optional)</label>
                    <textarea rows="2" value={q.explanation || ''} onChange={(e) => handleUpdateQuestion(idx, 'explanation', e.target.value)} />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>{q.type === 'text' ? 'Prompt' : 'Question'}</label>
                    <textarea rows="2" value={q.prompt || q.question || ''} onChange={(e) => handleUpdateQuestion(idx, q.type === 'text' ? 'prompt' : 'question', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Expected Answer (optional)</label>
                    <textarea rows="2" value={q.expected_answer || ''} onChange={(e) => handleUpdateQuestion(idx, 'expected_answer', e.target.value)} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onBack}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : (assignmentId ? 'Update Assignment' : 'Create Assignment')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateAssignmentView


