import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardOverview from '../components/dashboard/DashboardOverview'
import ClassesView from '../components/dashboard/ClassesView'
import GradesView from '../components/dashboard/GradesView'
import AssignmentsView from '../components/dashboard/AssignmentsView'
import StudyPlannerView from '../components/dashboard/StudyPlannerView'
import CareerView from '../components/dashboard/CareerView'
import SettingsView from '../components/dashboard/SettingsView'
import {
  studentData,
  enrolledClasses,
  upcomingAssignments,
  recentGrades,
  studyPlanSuggestions,
  careerRecommendations
} from '../components/dashboard/mockData'
import './StudentDashboard.css'

function StudentDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login/student')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview
            studentData={studentData}
            enrolledClasses={enrolledClasses}
            upcomingAssignments={upcomingAssignments}
            recentGrades={recentGrades}
            onTabChange={setActiveTab}
          />
        )
      case 'classes':
        return <ClassesView enrolledClasses={enrolledClasses} />
      case 'grades':
        return <GradesView enrolledClasses={enrolledClasses} recentGrades={recentGrades} />
      case 'assignments':
        return <AssignmentsView upcomingAssignments={upcomingAssignments} />
      case 'study-planner':
        return <StudyPlannerView studyPlanSuggestions={studyPlanSuggestions} />
      case 'career':
        return <CareerView careerRecommendations={careerRecommendations} />
      case 'settings':
        return <SettingsView studentData={studentData} />
      default:
        return null
    }
  }

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      classes: 'My Classes',
      grades: 'Grades',
      assignments: 'Assignments',
      'study-planner': 'AI Study Planner',
      career: 'Career Recommendations',
      settings: 'Settings'
    }
    return titles[activeTab] || 'Dashboard'
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
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
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'classes' ? 'active' : ''}`}
            onClick={() => setActiveTab('classes')}
          >
            <span className="nav-icon">📚</span>
            <span className="nav-label">My Classes</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'grades' ? 'active' : ''}`}
            onClick={() => setActiveTab('grades')}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-label">Grades</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            <span className="nav-icon">📝</span>
            <span className="nav-label">Assignments</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'study-planner' ? 'active' : ''}`}
            onClick={() => setActiveTab('study-planner')}
          >
            <span className="nav-icon">🤖</span>
            <span className="nav-label">AI Study Planner</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'career' ? 'active' : ''}`}
            onClick={() => setActiveTab('career')}
          >
            <span className="nav-icon">🎯</span>
            <span className="nav-label">Career Path</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => setActiveTab('settings')}>
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Bar */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="page-title">{getPageTitle()}</h1>
          </div>
          <div className="header-right">
            <button className="header-btn">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>
            <div className="user-menu-container">
              <button 
                className="user-profile-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="user-avatar">{studentData.avatar}</span>
                <span className="user-name">{studentData.name}</span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-info-name">{studentData.name}</p>
                    <p className="user-info-email">{studentData.email}</p>
                    <p className="user-info-id">ID: {studentData.studentId}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => setActiveTab('settings')}>
                    Settings
                  </button>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard
