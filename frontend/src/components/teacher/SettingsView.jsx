import { useState } from 'react'

function SettingsView({ teacherData }) {
  const [formData, setFormData] = useState({
    name: teacherData.name,
    email: teacherData.email,
    bio: teacherData.bio || ''
  })

  const [notifications, setNotifications] = useState({
    emailSubmissions: true,
    emailGrades: false,
    emailAnnouncements: true,
    pushNotifications: true
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleNotificationChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Settings saved!')
  }

  const handlePasswordChange = () => {
    alert('Password change form would open here')
  }

  return (
    <div className="settings-container">
      {/* Profile Settings */}
      <section className="settings-section">
        <h3>Profile Settings</h3>
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="teacherId">Teacher ID</label>
            <input
              type="text"
              id="teacherId"
              value={teacherData.teacherId}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Tell students about yourself..."
            />
          </div>

          <div className="form-group">
            <label>Subjects</label>
            <div className="subjects-display">
              {teacherData.subjects.map((subject, idx) => (
                <span key={idx} className="subject-badge">{subject}</span>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-save">
            Save Changes
          </button>
        </form>
      </section>

      {/* Notification Preferences */}
      <section className="settings-section">
        <h3>Notification Preferences</h3>
        <div className="settings-options">
          <div className="option-item">
            <div>
              <h4>New Submission Notifications</h4>
              <p>Receive email when students submit assignments</p>
            </div>
            <input
              type="checkbox"
              name="emailSubmissions"
              checked={notifications.emailSubmissions}
              onChange={handleNotificationChange}
            />
          </div>

          <div className="option-item">
            <div>
              <h4>Grade Posted Confirmations</h4>
              <p>Receive confirmation when grades are posted</p>
            </div>
            <input
              type="checkbox"
              name="emailGrades"
              checked={notifications.emailGrades}
              onChange={handleNotificationChange}
            />
          </div>

          <div className="option-item">
            <div>
              <h4>Announcement Notifications</h4>
              <p>Get notified when your announcements are viewed</p>
            </div>
            <input
              type="checkbox"
              name="emailAnnouncements"
              checked={notifications.emailAnnouncements}
              onChange={handleNotificationChange}
            />
          </div>

          <div className="option-item">
            <div>
              <h4>Push Notifications</h4>
              <p>Enable browser push notifications</p>
            </div>
            <input
              type="checkbox"
              name="pushNotifications"
              checked={notifications.pushNotifications}
              onChange={handleNotificationChange}
            />
          </div>
        </div>
      </section>

      {/* Teaching Preferences */}
      <section className="settings-section">
        <h3>Teaching Preferences</h3>
        <div className="settings-options">
          <div className="option-item">
            <div>
              <h4>AI Assistance</h4>
              <p>Use AI for grading and assignment generation</p>
            </div>
            <input type="checkbox" defaultChecked />
          </div>

          <div className="option-item">
            <div>
              <h4>Auto-publish Grades</h4>
              <p>Automatically publish grades after entering them</p>
            </div>
            <input type="checkbox" />
          </div>

          <div className="option-item">
            <div>
              <h4>Late Submission Acceptance</h4>
              <p>Allow students to submit assignments after due date</p>
            </div>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="settings-section">
        <h3>Security</h3>
        <div className="security-info">
          <p>Last login: {new Date().toLocaleDateString()}</p>
          <p>Account created: {teacherData.joinedDate || '2024-01-01'}</p>
        </div>
        <button className="btn-secondary-action" onClick={handlePasswordChange}>
          Change Password
        </button>
      </section>

      {/* Danger Zone */}
      <section className="settings-section danger-zone">
        <h3>Account Management</h3>
        <p>If you need to deactivate your account, please contact your administrator.</p>
      </section>
    </div>
  )
}

export default SettingsView

