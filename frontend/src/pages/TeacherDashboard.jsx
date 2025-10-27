import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { teacherData } from '../components/teacher/teacherMockData'
import DashboardOverview from '../components/teacher/DashboardOverview'
import MyClassesView from '../components/teacher/MyClassesView'
import ClassDetailView from '../components/teacher/ClassDetailView'
import AssignmentsView from '../components/teacher/AssignmentsView'
import CreateAssignmentView from '../components/teacher/CreateAssignmentView'
import GradeAssignmentView from '../components/teacher/GradeAssignmentView'
import StudentsView from '../components/teacher/StudentsView'
import AnalyticsView from '../components/teacher/AnalyticsView'
import AnnouncementsView from '../components/teacher/AnnouncementsView'
import SettingsView from '../components/teacher/SettingsView'
import './TeacherDashboard.css'

function TeacherDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [selectedClassId, setSelectedClassId] = useState(null)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null)
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false)
  const [isGradingAssignment, setIsGradingAssignment] = useState(false)

  const handleLogout = () => {
    // Clear authentication
    localStorage.clear()
    navigate('/login/teacher')
  }

  const handleClassClick = (classId) => {
    setSelectedClassId(classId)
  }

  const handleBackToClasses = () => {
    setSelectedClassId(null)
  }

  const handleAssignmentClick = (assignmentId) => {
    setSelectedAssignmentId(assignmentId)
  }

  const handleCreateAssignment = () => {
    setIsCreatingAssignment(true)
  }

  const handleBackToAssignments = () => {
    setSelectedAssignmentId(null)
    setIsCreatingAssignment(false)
    setIsGradingAssignment(false)
  }

  const handleGradeAssignment = (assignmentId) => {
    setSelectedAssignmentId(assignmentId)
    setIsGradingAssignment(true)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSelectedClassId(null)
    setSelectedAssignmentId(null)
    setIsCreatingAssignment(false)
    setIsGradingAssignment(false)
  }

  const renderContent = () => {
    // Priority: Show detail views if selected
    if (selectedClassId) {
      return (
        <ClassDetailView
          classId={selectedClassId}
          onBack={handleBackToClasses}
          onCreateAssignment={handleCreateAssignment}
        />
      )
    }

    if (isCreatingAssignment) {
      return (
        <CreateAssignmentView
          assignmentId={selectedAssignmentId}
          classId={selectedClassId}
          onBack={handleBackToAssignments}
        />
      )
    }

    if (isGradingAssignment && selectedAssignmentId) {
      return (
        <GradeAssignmentView
          assignmentId={selectedAssignmentId}
          onBack={handleBackToAssignments}
        />
      )
    }

    // Main tab views
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview
            onTabChange={handleTabChange}
            onClassClick={handleClassClick}
            onCreateAssignment={handleCreateAssignment}
          />
        )
      case 'classes':
        return (
          <MyClassesView
            onClassClick={handleClassClick}
          />
        )
      case 'assignments':
        return (
          <AssignmentsView
            onAssignmentClick={handleAssignmentClick}
            onCreateAssignment={handleCreateAssignment}
            onGradeAssignment={handleGradeAssignment}
          />
        )
      case 'students':
        return <StudentsView />
      case 'analytics':
        return <AnalyticsView />
      case 'announcements':
        return <AnnouncementsView />
      case 'settings':
        return <SettingsView teacherData={teacherData} />
      default:
        return <DashboardOverview onTabChange={handleTabChange} />
    }
  }

  const getPageTitle = () => {
    if (selectedClassId) return 'Class Details'
    if (isCreatingAssignment) return selectedAssignmentId ? 'Edit Assignment' : 'Create Assignment'
    if (isGradingAssignment) return 'Grade Assignment'
    
    const titles = {
      dashboard: 'Dashboard',
      classes: 'My Classes',
      assignments: 'Assignments',
      students: 'Students',
      analytics: 'Analytics',
      announcements: 'Announcements',
      settings: 'Settings'
    }
    return titles[activeTab] || 'Dashboard'
  }

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
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabChange('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'classes' ? 'active' : ''}`}
            onClick={() => handleTabChange('classes')}
          >
            <span className="nav-icon">📚</span>
            <span className="nav-label">My Classes</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => handleTabChange('assignments')}
          >
            <span className="nav-icon">📝</span>
            <span className="nav-label">Assignments</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => handleTabChange('students')}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-label">Students</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => handleTabChange('analytics')}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-label">Analytics</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => handleTabChange('announcements')}
          >
            <span className="nav-icon">📢</span>
            <span className="nav-label">Announcements</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => handleTabChange('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-footer-text">Teacher Portal v1.0</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <h1 className="page-title">{getPageTitle()}</h1>
          <div className="header-right">
            <button className="header-btn">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>

            <div className="user-menu-container">
              <button
                className="user-profile-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className="user-avatar">👨‍🏫</span>
                <span className="user-name">{teacherData.name}</span>
              </button>

              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-info-name">{teacherData.name}</p>
                    <p className="user-info-email">{teacherData.email}</p>
                    <p className="user-info-id">ID: {teacherData.teacherId}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      handleTabChange('settings')
                      setUserMenuOpen(false)
                    }}
                  >
                    ⚙️ Settings
                  </button>
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
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default TeacherDashboard

