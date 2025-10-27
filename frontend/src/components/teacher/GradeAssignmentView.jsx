import { useState } from 'react'
import { allAssignments, submissions, autoGradeSubmission } from './teacherMockData'

function GradeAssignmentView({ assignmentId, onBack }) {
  const assignment = allAssignments.find(a => a.id === assignmentId)
  const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignmentId)
  const [selectedSubmission, setSelectedSubmission] = useState(
    assignmentSubmissions[0] || null
  )
  const [grade, setGrade] = useState(selectedSubmission?.grade || '')
  const [feedback, setFeedback] = useState(selectedSubmission?.feedback || '')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [showAiPanel, setShowAiPanel] = useState(false)

  if (!assignment) {
    return (
      <div className="grade-assignment-view">
        <button className="btn-back" onClick={onBack}>
          ← Back
        </button>
        <p>Assignment not found</p>
      </div>
    )
  }

  const handleSelectSubmission = (submission) => {
    setSelectedSubmission(submission)
    setGrade(submission.grade || '')
    setFeedback(submission.feedback || '')
    setAiResult(null)
    setShowAiPanel(false)
  }

  const handleAutoGrade = async () => {
    if (!selectedSubmission) return

    setAiLoading(true)
    setShowAiPanel(true)

    // Call AI auto-grading skeleton function
    const result = await autoGradeSubmission(
      selectedSubmission,
      { totalPoints: assignment.totalPoints }
    )

    if (result.success) {
      setAiResult(result)
    }

    setAiLoading(false)
  }

  const handleAcceptAiGrade = () => {
    if (aiResult) {
      setGrade(aiResult.suggestedGrade)
      setFeedback(aiResult.overallFeedback)
      setShowAiPanel(false)
    }
  }

  const handleSaveGrade = () => {
    alert(`Grade saved: ${grade}/${assignment.totalPoints}\nFeedback: ${feedback}`)
    // Move to next submission
    const currentIndex = assignmentSubmissions.findIndex(s => s.id === selectedSubmission.id)
    if (currentIndex < assignmentSubmissions.length - 1) {
      handleSelectSubmission(assignmentSubmissions[currentIndex + 1])
    }
  }

  return (
    <div className="grade-assignment-view">
      <button className="btn-back" onClick={onBack}>
        ← Back to Assignments
      </button>

      <div className="grade-header">
        <div>
          <h2>{assignment.title}</h2>
          <p className="assignment-meta">
            {assignment.className} • {assignment.totalPoints} points
          </p>
        </div>
        <div className="grade-stats">
          <span>Grading: {assignmentSubmissions.filter(s => s.grade !== null).length}/{assignmentSubmissions.length}</span>
        </div>
      </div>

      {assignmentSubmissions.length > 0 ? (
        <div className="grading-container">
          {/* Submissions List */}
          <div className="submissions-list">
            <h3>Submissions ({assignmentSubmissions.length})</h3>
            {assignmentSubmissions.map(submission => (
              <div
                key={submission.id}
                className={`submission-item ${selectedSubmission?.id === submission.id ? 'active' : ''}`}
                onClick={() => handleSelectSubmission(submission)}
              >
                <div className="submission-student">
                  <span className="student-avatar">👤</span>
                  <div>
                    <p className="student-name">{submission.studentName}</p>
                    <p className="submission-date">
                      {submission.submittedDate} at {submission.submittedTime}
                    </p>
                  </div>
                </div>
                <div className="submission-status">
                  {submission.grade !== null ? (
                    <span className="graded-badge">
                      ✅ {submission.grade}/{assignment.totalPoints}
                    </span>
                  ) : (
                    <span className="pending-badge">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Grading Panel */}
          {selectedSubmission && (
            <div className="grading-panel">
              <div className="submission-header">
                <h3>{selectedSubmission.studentName}'s Submission</h3>
                <div className="ai-grade-button-container">
                  <button
                    className="btn-ai-grade"
                    onClick={handleAutoGrade}
                    disabled={aiLoading}
                  >
                    {aiLoading ? (
                      <>
                        <span className="spinner-small">⏳</span> Analyzing...
                      </>
                    ) : (
                      <>
                        <span className="ai-icon">🤖</span> Auto-Grade with AI
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="submission-content">
                <h4>Submission Content</h4>
                <div className="content-box">
                  <pre>{selectedSubmission.content}</pre>
                </div>
                {selectedSubmission.attachments && selectedSubmission.attachments.length > 0 && (
                  <div className="attachments">
                    <h4>Attachments</h4>
                    {selectedSubmission.attachments.map((file, idx) => (
                      <div key={idx} className="attachment-item">
                        <span className="file-icon">📄</span>
                        <span>{file}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Results Panel */}
              {showAiPanel && (
                <div className="ai-results-panel">
                  {aiLoading ? (
                    <div className="ai-loading">
                      <div className="loading-spinner"></div>
                      <p>AI is analyzing the submission...</p>
                    </div>
                  ) : aiResult ? (
                    <div className="ai-results">
                      <div className="ai-results-header">
                        <h4>🤖 AI Grading Results</h4>
                        <span className="confidence-badge">
                          Confidence: {Math.round(aiResult.confidence * 100)}%
                        </span>
                      </div>

                      <div className="ai-suggested-grade">
                        <span className="label">Suggested Grade:</span>
                        <span className="grade-value">
                          {aiResult.suggestedGrade}/{aiResult.maxPoints}
                        </span>
                        <span className="percentage">
                          ({Math.round((aiResult.suggestedGrade / aiResult.maxPoints) * 100)}%)
                        </span>
                      </div>

                      <div className="ai-breakdown">
                        <h5>Breakdown by Criteria</h5>
                        {aiResult.breakdown.map((item, idx) => (
                          <div key={idx} className="criterion-result">
                            <div className="criterion-header">
                              <span className="criterion-name">{item.criterion}</span>
                              <span className="criterion-score">
                                {item.score}/{item.maxScore}
                              </span>
                            </div>
                            <p className="criterion-feedback">{item.feedback}</p>
                          </div>
                        ))}
                      </div>

                      <div className="ai-overall-feedback">
                        <h5>Overall Feedback</h5>
                        <p>{aiResult.overallFeedback}</p>
                      </div>

                      {aiResult.suggestedComments && (
                        <div className="ai-suggestions">
                          <h5>Suggested Comments</h5>
                          <ul>
                            {aiResult.suggestedComments.map((comment, idx) => (
                              <li key={idx}>{comment}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="ai-actions">
                        <button className="btn-accept-ai" onClick={handleAcceptAiGrade}>
                          ✅ Accept AI Grade
                        </button>
                        <button className="btn-modify" onClick={() => setShowAiPanel(false)}>
                          ✏️ Modify Manually
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Manual Grading Form */}
              <div className="grading-form">
                <div className="form-group">
                  <label htmlFor="grade">Grade (out of {assignment.totalPoints})</label>
                  <input
                    type="number"
                    id="grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    min="0"
                    max={assignment.totalPoints}
                    className="grade-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="feedback">Feedback</label>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="6"
                    className="feedback-textarea"
                    placeholder="Provide feedback to the student..."
                  />
                </div>

                <div className="grading-actions">
                  <button
                    className="btn-save-grade"
                    onClick={handleSaveGrade}
                    disabled={!grade}
                  >
                    Save & Next
                  </button>
                  <button className="btn-save-grade btn-secondary">
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <p>No submissions yet</p>
        </div>
      )}
    </div>
  )
}

export default GradeAssignmentView

