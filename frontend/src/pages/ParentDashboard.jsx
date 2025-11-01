import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import './StudentDashboard.css'

function ParentDashboard() {
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [parentProfile, setParentProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchParentProfile = async () => {
      try {
        const response = await authService.getProfile()
        setParentProfile(response.data)
      } catch (error) {
        console.error('Failed to fetch parent profile:', error)
        if (error.response?.status === 401) {
          navigate('/login/parent')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchParentProfile()
  }, [navigate])

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
    navigate('/login/parent')
  }

  const displayName = parentProfile
    ? `${parentProfile.firstName || ''} ${parentProfile.lastName || ''}`.trim()
    : 'Parent'

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo-dashboard" onClick={() => navigate('/')}>
            <span className="logo-icon">⚡</span>
            <span className="logo-text">HSC Power</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <span className="nav-icon">👨‍👩‍👧‍👦</span>
            <span className="nav-label">Dashboard</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-footer-text">Parent Portal</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <h1 className="page-title">Parent Dashboard</h1>
          <div className="header-right">
            <button className="header-btn">
              <span className="notification-icon">🔔</span>
            </button>

            <div className="user-menu-container">
              <button
                className="user-profile-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className="user-avatar">👨‍👩‍👧‍👦</span>
                <span className="user-name">{displayName}</span>
              </button>

              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-info-name">{displayName}</p>
                    <p className="user-info-email">{parentProfile?.email || ''}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="dashboard-content">
          <div className="welcome-section">
            <h2>Welcome, {displayName}!</h2>
            <p>The parent dashboard is coming soon. You'll be able to view your child's progress and reports here.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ParentDashboard

