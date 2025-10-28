import { useState, useEffect } from 'react'
import teacherApi from '../../services/teacherApi'

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
    submission_type: 'online'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await teacherApi.getClasses()
        setClasses(response.data || [])
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
      await teacherApi.createAssignment(formData)
      alert('Assignment created successfully!')
      onBack()
    } catch (error) {
      console.error('Failed to create assignment:', error)
      alert('Failed to create assignment. Please try again.')
    } finally {
      setLoading(false)
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

        {/* AI Features Section (Placeholder) */}
        <div className="form-section ai-section">
          <h3>AI Assistant Tools <span className="ai-badge">AI Powered</span></h3>
          <p className="section-description">
            Use AI features to help generate assignment content and grading criteria (coming soon)
          </p>
          
          <div className="ai-tools-grid">
            <button type="button" className="ai-tool-button" disabled>
              <span className="ai-tool-icon">✨</span>
              <div>
                <h4>Generate Assignment</h4>
                <p>AI creates assignment content</p>
              </div>
            </button>

            <button type="button" className="ai-tool-button" disabled>
              <span className="ai-tool-icon">📋</span>
              <div>
                <h4>Generate Rubric</h4>
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

