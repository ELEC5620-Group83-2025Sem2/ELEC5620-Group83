import { useState, useEffect } from 'react'
import authService from '../../services/authService'

function SettingsView({ studentData, userProfile, onProfileUpdate }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || ''
      })
    }
  }, [userProfile])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name
      }

      const response = await authService.updateProfile(updateData)
      
      if (response.profile) {
        onProfileUpdate(response.profile)
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        
        // Update localStorage
        const currentUser = authService.getCurrentUser()
        if (currentUser) {
          localStorage.setItem('user', JSON.stringify({
            ...currentUser,
            first_name: response.profile.first_name,
            last_name: response.profile.last_name
          }))
        }
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="settings-container">
      <section className="settings-section">
        <h3>Profile Settings</h3>
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        <div className="settings-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>First Name</label>
              <input 
                type="text" 
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input 
                type="text" 
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={userProfile?.email || studentData.email} 
                disabled 
              />
            </div>
            <div className="form-group">
              <label>Student ID</label>
              <input 
                type="text" 
                value={userProfile?.id?.slice(0, 8) || studentData.studentId} 
                disabled 
              />
            </div>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
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

