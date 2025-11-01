import { useState, useEffect } from 'react'
import teacherApi from '../../services/teacherApi'
import './AssignmentsView.css'

const formatAssignmentType = (value) => {
  if (!value) return ''
  return value
    .toString()
    .trim()
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function AssignmentsView({ onAssignmentClick, onCreateAssignment, onGradeAssignment }) {
  const [assignments, setAssignments] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterClass, setFilterClass] = useState('all')
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentsRes, classesRes] = await Promise.all([
          teacherApi.getAssignments(),
          teacherApi.getClasses()
        ])
        setAssignments(assignmentsRes.assignments || [])
        setClasses(classesRes.classes || [])
      } catch (error) {
        console.error('Failed to fetch assignments:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      published: 'status-published',
      draft: 'status-draft',
      grading: 'status-grading',
      graded: 'status-graded',
    }
    return statusMap[status] || 'status-draft'
  }

  const filteredAssignments = assignments.filter(a => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus
    const matchesClass = filterClass === 'all' || String(a.class_id) === String(filterClass)
    return matchesStatus && matchesClass
  })

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
        <p>Loading assignments...</p>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="assignments-header">
        <button className="btn-create-assignment" onClick={onCreateAssignment}>
          ➕ Create Assignment
        </button>
      </div>

      {/* Filters */}
      <div className="assignments-filters assignments-filters--compact">
        <div className="filter-group">
          <label>Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="grading">Needs Grading</option>
            <option value="graded">Graded</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Class</label>
          <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="all">All Classes</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-results">Showing {filteredAssignments.length}</div>
      </div>

      {/* Compact table */}
      <div className="assignments-table">
        <div className="table-head">
          <div>Assignment</div>
          <div>Status</div>
          <div>Due</div>
          <div>Points</div>
          <div className="actions-col">Actions</div>
        </div>

        {filteredAssignments.length > 0 ? (
          filteredAssignments.map(assignment => {
            const assignmentClass = classes.find(c => String(c.id) === String(assignment.class_id))
            const dueDate = assignment.due_date ? new Date(assignment.due_date) : null

            let dueDateLabel = 'No due date'
            let dueDateTooltip
            if (dueDate) {
              dueDateLabel = `Due ${dueDate.toLocaleDateString(undefined, {
                month: 'short', day: 'numeric', year: 'numeric'
              })}`
              dueDateTooltip = dueDate.toLocaleString(undefined, {
                dateStyle: 'full', timeStyle: 'short'
              })
            }

            const pointsValue = typeof assignment.total_points === 'number'
              ? assignment.total_points
              : Number.parseInt(assignment.total_points, 10)
            const safePointsValue = Number.isFinite(pointsValue) ? pointsValue : 100
            const assignmentTypeLabel = formatAssignmentType(assignment.assignment_type || 'homework')

            return (
              <div key={assignment.id} className="assignment-row">
                {/* Title / class / description (clamped) */}
                <div className="title-col">
                  <div className="title-line">
                    <button
                      className="link-title"
                      onClick={() => onAssignmentClick(assignment.id)}
                      title="Open assignment"
                    >
                      {assignment.title}
                    </button>
                  </div>
                  <div className="meta-line">
                    <span className="assignment-class-name">{assignmentClass?.name || 'Unknown Class'}</span>
                    <span className="dot" aria-hidden="true">•</span>
                    <span title={dueDateTooltip}>{dueDateLabel}</span>
                    {assignmentTypeLabel ? (
                      <>
                        <span className="dot" aria-hidden="true">•</span>
                        <span>{assignmentTypeLabel}</span>
                      </>
                    ) : null}
                  </div>
                  {assignment.description ? (
                    <div className="desc-line" title={assignment.description}>
                      {assignment.description}
                    </div>
                  ) : null}
                </div>

                {/* Status */}
                <div className="status-col">
                  <span className={`status-badge ${getStatusBadgeClass(assignment.status)}`}>
                    {assignment.status || 'draft'}
                  </span>
                </div>

                {/* Due (short) */}
                <div className="due-col" title={dueDateTooltip}>{dueDateLabel}</div>

                {/* Points */}
                <div className="points-col">{safePointsValue}</div>

                {/* Actions */}
                <div className="actions-col">
                  <button
                    className="btn-assignment-action btn-view"
                    onClick={() => onAssignmentClick(assignment.id)}
                    aria-label="View assignment"
                    title="View"
                  >
                    View
                  </button>
                  <button
                    className="btn-assignment-action btn-grade"
                    onClick={() => onGradeAssignment(assignment.id)}
                    aria-label="Grade assignment"
                    title="Grade"
                  >
                    Grade
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="empty-state">
            <div className="emoji">📝</div>
            <h3>No Assignments</h3>
            <p>Click the button above to create your first assignment</p>
          </div>
        )}
      </div>
    </>
  )
}

export default AssignmentsView
