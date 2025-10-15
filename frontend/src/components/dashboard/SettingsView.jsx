function SettingsView({ studentData }) {
  return (
    <div className="settings-container">
      <section className="settings-section">
        <h3>Profile Settings</h3>
        <div className="settings-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" defaultValue={studentData.name} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" defaultValue={studentData.email} />
          </div>
          <div className="form-group">
            <label>Student ID</label>
            <input type="text" defaultValue={studentData.studentId} disabled />
          </div>
          <button className="btn-save">Save Changes</button>
        </div>
      </section>

      <section className="settings-section">
        <h3>Preferences</h3>
        <div className="settings-options">
          <div className="option-item">
            <div>
              <h4>Email Notifications</h4>
              <p>Receive updates about assignments and grades</p>
            </div>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="option-item">
            <div>
              <h4>AI Recommendations</h4>
              <p>Get personalized study and career suggestions</p>
            </div>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h3>Security</h3>
        <button className="btn-secondary-action">Change Password</button>
      </section>
    </div>
  )
}

export default SettingsView

