import { useState } from 'react'
import { announcements, teacherClasses } from './teacherMockData'

function AnnouncementsView() {
  const [showComposer, setShowComposer] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    classId: 'all',
    scheduleDate: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Announcement posted!')
    setFormData({ title: '', message: '', classId: 'all', scheduleDate: '' })
    setShowComposer(false)
  }

  return (
    <div className="announcements-view">
      {/* Header */}
      <div className="announcements-header">
        <button
          className="btn-create-announcement"
          onClick={() => setShowComposer(!showComposer)}
        >
          {showComposer ? '✕ Cancel' : '+ Create Announcement'}
        </button>
      </div>

      {/* Announcement Composer */}
      {showComposer && (
        <div className="announcement-composer">
          <h3>Create New Announcement</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Announcement title..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your announcement message..."
                rows="6"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="classId">Post to:</label>
                <select
                  id="classId"
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                >
                  <option value="all">All Classes</option>
                  {teacherClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="scheduleDate">Schedule for later (optional):</label>
                <input
                  type="datetime-local"
                  id="scheduleDate"
                  name="scheduleDate"
                  value={formData.scheduleDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowComposer(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-post">
                {formData.scheduleDate ? 'Schedule Announcement' : 'Post Now'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      <div className="announcements-list-section">
        <h3>Recent Announcements</h3>
        {announcements.length > 0 ? (
          <div className="announcements-list">
            {announcements.map(announcement => {
              const targetClass = teacherClasses.find(c => c.id === announcement.classId)
              
              return (
                <div key={announcement.id} className="announcement-card">
                  <div className="announcement-card-header">
                    <div>
                      <h4>{announcement.title}</h4>
                      {targetClass && (
                        <span className="class-badge-small" style={{ background: `${targetClass.color}20`, color: targetClass.color }}>
                          {announcement.className}
                        </span>
                      )}
                    </div>
                    <div className="announcement-actions">
                      <button className="btn-icon" title="Edit">✏️</button>
                      <button className="btn-icon" title="Delete">🗑️</button>
                    </div>
                  </div>

                  <p className="announcement-message">{announcement.message}</p>

                  <div className="announcement-meta">
                    <span>📅 Posted: {announcement.postedDate}</span>
                    <span>👁️ Viewed: {announcement.viewedBy}/{announcement.totalStudents}</span>
                    <span className="view-percentage">
                      ({Math.round((announcement.viewedBy / announcement.totalStudents) * 100)}%)
                    </span>
                  </div>

                  <div className="view-status-bar">
                    <div
                      className="view-status-fill"
                      style={{
                        width: `${(announcement.viewedBy / announcement.totalStudents) * 100}%`,
                        background: targetClass?.color || '#667eea'
                      }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>No announcements yet</p>
            <button className="btn-primary-action" onClick={() => setShowComposer(true)}>
              Create First Announcement
            </button>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="announcements-tips">
        <h4>💡 Tips for Effective Announcements</h4>
        <ul>
          <li>Keep announcements clear and concise</li>
          <li>Use specific dates and times when relevant</li>
          <li>Important information should be at the beginning</li>
          <li>Check that all students have viewed important announcements</li>
          <li>Follow up with students who haven't viewed critical announcements</li>
        </ul>
      </div>
    </div>
  )
}

export default AnnouncementsView

