import { useState } from 'react'
import { teacherClasses, generateAssignment, generateRubric, suggestQuestions } from './teacherMockData'

function CreateAssignmentView({ assignmentId, classId, onBack }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: classId || '',
    type: 'homework',
    dueDate: '',
    dueTime: '23:59',
    totalPoints: 100
  })

  const [questions, setQuestions] = useState([])
  const [rubric, setRubric] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)
  const [aiModalType, setAiModalType] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `Q${questions.length + 1}`,
        type: 'multiple-choice',
        question: '',
        points: 10,
        options: [
          { id: 'a', text: '' },
          { id: 'b', text: '' },
          { id: 'c', text: '' },
          { id: 'd', text: '' }
        ]
      }
    ])
  }

  const handleGenerateAssignment = async () => {
    setAiLoading(true)
    setAiModalType('generate')
    setShowAiModal(true)

    // Call AI generation skeleton
    const result = await generateAssignment({
      subject: 'Mathematics',
      topic: 'Calculus',
      difficulty: 'medium',
      type: formData.type,
      questionCount: 3
    })

    if (result.success) {
      setFormData({
        ...formData,
        title: result.assignment.title,
        description: result.assignment.description,
        totalPoints: result.assignment.totalPoints
      })
      setQuestions(result.assignment.questions)
    }

    setAiLoading(false)
  }

  const handleGenerateRubric = async () => {
    setAiLoading(true)
    setAiModalType('rubric')
    setShowAiModal(true)

    // Call AI rubric generation skeleton
    const result = await generateRubric({
      title: formData.title,
      description: formData.description,
      type: formData.type
    })

    if (result.success) {
      setRubric(result.rubric)
    }

    setAiLoading(false)
  }

  const handleSuggestQuestions = async () => {
    setAiLoading(true)

    // Call AI question suggestion skeleton
    const result = await suggestQuestions({
      topic: 'Calculus',
      difficulty: 'medium',
      existingQuestions: questions
    })

    if (result.success) {
      const newQuestions = result.questions.map((q, idx) => ({
        id: `Q${questions.length + idx + 1}`,
        type: q.type,
        question: q.question,
        points: 10,
        options: q.type === 'multiple-choice' ? [
          { id: 'a', text: 'Option A' },
          { id: 'b', text: 'Option B' },
          { id: 'c', text: 'Option C' },
          { id: 'd', text: 'Option D' }
        ] : undefined
      }))
      setQuestions([...questions, ...newQuestions])
    }

    setAiLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Assignment created! (This would save to backend)')
    onBack()
  }

  return (
    <div className="create-assignment-view">
      <button className="btn-back" onClick={onBack}>
        ← Back to Assignments
      </button>

      <div className="create-assignment-header">
        <h2>{assignmentId ? 'Edit' : 'Create'} Assignment</h2>
        <div className="ai-badge">
          <span className="ai-icon">🤖</span>
          <span>AI-Powered Tools Available</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="assignment-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="title">Assignment Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="classId">Class *</label>
              <select
                id="classId"
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                required
              >
                <option value="">Select a class</option>
                {teacherClasses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type">Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
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
              <label htmlFor="dueDate">Due Date *</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueTime">Due Time *</label>
              <input
                type="time"
                id="dueTime"
                name="dueTime"
                value={formData.dueTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="totalPoints">Total Points *</label>
              <input
                type="number"
                id="totalPoints"
                name="totalPoints"
                value={formData.totalPoints}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>
        </div>

        {/* AI Generation Section */}
        <div className="form-section ai-section">
          <h3>
            <span className="ai-icon">🤖</span> AI-Powered Tools
          </h3>
          <p className="section-description">
            Use AI to generate assignment content, rubrics, and questions
          </p>
          
          <div className="ai-tools-grid">
            <button
              type="button"
              className="ai-tool-button"
              onClick={handleGenerateAssignment}
              disabled={aiLoading}
            >
              <span className="ai-tool-icon">✨</span>
              <div>
                <h4>Generate Assignment</h4>
                <p>Create complete assignment with AI</p>
              </div>
            </button>

            <button
              type="button"
              className="ai-tool-button"
              onClick={handleGenerateRubric}
              disabled={aiLoading || !formData.title}
            >
              <span className="ai-tool-icon">📋</span>
              <div>
                <h4>Generate Rubric</h4>
                <p>AI-powered grading criteria</p>
              </div>
            </button>

            <button
              type="button"
              className="ai-tool-button"
              onClick={handleSuggestQuestions}
              disabled={aiLoading}
            >
              <span className="ai-tool-icon">💡</span>
              <div>
                <h4>Suggest Questions</h4>
                <p>Get AI-generated question ideas</p>
              </div>
            </button>
          </div>
        </div>

        {/* Questions Section */}
        {(formData.type === 'quiz' || formData.type === 'test') && (
          <div className="form-section">
            <div className="section-header">
              <h3>Questions</h3>
              <button type="button" className="btn-add" onClick={handleAddQuestion}>
                + Add Question
              </button>
            </div>

            {questions.length > 0 ? (
              <div className="questions-list">
                {questions.map((question, index) => (
                  <div key={question.id} className="question-item">
                    <div className="question-header">
                      <span className="question-number">Question {index + 1}</span>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => setQuestions(questions.filter(q => q.id !== question.id))}
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter question text..."
                      value={question.question}
                      onChange={(e) => {
                        const updated = [...questions]
                        updated[index].question = e.target.value
                        setQuestions(updated)
                      }}
                      className="question-input"
                    />
                    {question.type === 'multiple-choice' && (
                      <div className="options-list">
                        {question.options.map((option, optIdx) => (
                          <input
                            key={option.id}
                            type="text"
                            placeholder={`Option ${option.id.toUpperCase()}`}
                            value={option.text}
                            onChange={(e) => {
                              const updated = [...questions]
                              updated[index].options[optIdx].text = e.target.value
                              setQuestions(updated)
                            }}
                            className="option-input"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-questions">
                <p>No questions added yet. Click "Add Question" or use AI to generate questions.</p>
              </div>
            )}
          </div>
        )}

        {/* Rubric Section */}
        {rubric && (
          <div className="form-section">
            <h3>Grading Rubric</h3>
            <div className="rubric-display">
              <p className="rubric-total">Total Points: {rubric.totalPoints}</p>
              {rubric.criteria.map(criterion => (
                <div key={criterion.id} className="rubric-criterion">
                  <h4>{criterion.name} ({criterion.points} points)</h4>
                  <p>{criterion.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onBack}>
            Cancel
          </button>
          <button type="button" className="btn-save-draft">
            Save as Draft
          </button>
          <button type="submit" className="btn-submit">
            Publish Assignment
          </button>
        </div>
      </form>

      {/* AI Modal */}
      {showAiModal && (
        <div className="modal-overlay">
          <div className="modal ai-modal">
            <div className="modal-header">
              <h3>
                {aiLoading && '🤖 AI is generating...'}
                {!aiLoading && aiModalType === 'generate' && '✅ Assignment Generated'}
                {!aiLoading && aiModalType === 'rubric' && '✅ Rubric Generated'}
              </h3>
              {!aiLoading && (
                <button className="modal-close" onClick={() => setShowAiModal(false)}>×</button>
              )}
            </div>
            <div className="modal-body">
              {aiLoading ? (
                <div className="ai-loading">
                  <div className="loading-spinner"></div>
                  <p>Generating with AI... This may take a few moments</p>
                </div>
              ) : (
                <div className="ai-success">
                  <p>✨ Content has been generated and added to your assignment!</p>
                  <button className="btn-primary" onClick={() => setShowAiModal(false)}>
                    Continue Editing
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateAssignmentView

