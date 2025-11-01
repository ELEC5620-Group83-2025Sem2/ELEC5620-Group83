import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DashboardOverview from '../components/dashboard/DashboardOverview'
import authService from '../services/authService'
import * as studentApi from '../services/studentApi'
import ClassesView from '../components/dashboard/ClassesView'
import GradesView from '../components/dashboard/GradesView'
import AssignmentsView from '../components/dashboard/AssignmentsView'
import StudyPlannerView from '../components/dashboard/StudyPlannerView'
import CareerView from '../components/dashboard/CareerView'
import SettingsView from '../components/dashboard/SettingsView'
import HSCSubjectsView from '../components/dashboard/HSCSubjectsView'
import WeeklyReportView from '../components/dashboard/WeeklyReportView'
import ClassDetailPage from '../components/dashboard/ClassDetailPage'
import AssignmentDetailPage from '../components/dashboard/AssignmentDetailPage'
import HSCSubjectRecommendation from '../components/dashboard/HSCSubjectRecommendation'
import './StudentDashboard.css'

function StudentDashboard() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTabFromUrl = searchParams.get('tab') || 'dashboard'
  const [activeTab, setActiveTab] = useState(initialTabFromUrl)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [selectedClassId, setSelectedClassId] = useState(null)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Data states
  const [enrolledClasses, setEnrolledClasses] = useState([])
  const [upcomingAssignments, setUpcomingAssignments] = useState([])
  const [recentGrades, setRecentGrades] = useState([])
  const [dashboardData, setDashboardData] = useState(null)
  const [gradesSummary, setGradesSummary] = useState(null)
  const [reviewQuestions, setReviewQuestions] = useState([])
  const [reviewStats, setReviewStats] = useState({ total: 0, dueForReview: 0, masteryRate: 0, mastered: 0 })
  const [dataLoading, setDataLoading] = useState(true)
  
  // Get initial user data from localStorage
  const getInitialUserData = () => {
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      return currentUser
    }
    return null
  }
  
  const [initialUserData] = useState(() => getInitialUserData())

  const handleLogout = async () => {
    await authService.logout()
    navigate('/login/student')
  }

  useEffect(() => {
    // Set initial user data from localStorage immediately
    // if (initialUserData) {
    //   setUserProfile(initialUserData)
    // }
    
    const fetchUserProfile = async () => {
      try {
        const response = await authService.getProfile()
        setUserProfile(response.data)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        // Keep the initial data if API fails
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])
  
  // Sync activeTab with URL changes
  useEffect(() => {
    if (urlTab !== activeTab && validTabs.includes(urlTab)) {
      setActiveTab(urlTab)
    }
  }, [location.pathname])

  // Keep activeTab in sync with the URL, and update URL when tab changes
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [searchParams])
  
  // Fetch all student data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setDataLoading(true)
        
        // Fetch dashboard overview, classes, assignments, grades, grades summary, and review data in parallel
        const [dashData, classesData, assignmentsData, gradesData, gradesSummaryData, reviewQuestionsData, reviewStatsData] = await Promise.all([
          studentApi.getDashboardData().catch(() => ({ data: {} })),
          studentApi.getStudentClasses().catch(() => ({ classes: [] })),
          studentApi.getStudentAssignments({ upcoming: true }).catch(() => ({ assignments: [] })),
          studentApi.getStudentGrades().catch(() => ({ grades: [] })),
          studentApi.getGradesSummary().catch(() => ({ summary: null })),
          studentApi.getReviewQuestions().catch(() => ({ questions: [] })),
          studentApi.getReviewStats().catch(() => ({ stats: { total: 0, dueForReview: 0, masteryRate: 0, mastered: 0 } }))
        ])
        
        setDashboardData(dashData.data || {})
        setEnrolledClasses(classesData.classes || [])
        setUpcomingAssignments(assignmentsData.assignments || [])
        setRecentGrades((gradesData.grades || []).slice(0, 5))
        setGradesSummary(gradesSummaryData.summary || null)
        setReviewQuestions(reviewQuestionsData.questions || [])
        setReviewStats(reviewStatsData.stats || { total: 0, dueForReview: 0, masteryRate: 0, mastered: 0 })
      } catch (error) {
        console.error('Failed to fetch student data:', error)
      } finally {
        setDataLoading(false)
      }
    }
    
    fetchStudentData()
  }, [])

  const handleClassClick = (classId) => {
    setSelectedClassId(classId)
    setSelectedAssignmentId(null)
  }

  const handleAssignmentClick = (assignmentId) => {
    setSelectedAssignmentId(assignmentId)
    setSelectedClassId(null)
  }

  const handleBackToClasses = () => {
    setSelectedClassId(null)
  }

  const handleBackToAssignments = () => {
    setSelectedAssignmentId(null)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    // Clear selected class/assignment when changing tabs
    setSelectedClassId(null)
    setSelectedAssignmentId(null)
    setSearchParams({ tab })
  }

  const renderContent = () => {
    // Show loading state
    if (dataLoading && activeTab !== 'settings' && activeTab !== 'hsc-subjects-recommendation' && activeTab !== 'hsc-subjects') {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginLeft: '10px' }}>Loading...</p>
        </div>
      )
    }
    
    // Show Class Detail Page if a class is selected
    if (selectedClassId) {
      const classData = enrolledClasses.find(c => c.id === selectedClassId)
      return <ClassDetailPage classData={classData} onBack={handleBackToClasses} />
    }

    // Show Assignment Detail Page if an assignment is selected
    if (selectedAssignmentId) {
      const assignmentData = upcomingAssignments.find(a => a.id === selectedAssignmentId)
      return <AssignmentDetailPage assignmentData={assignmentData} onBack={handleBackToAssignments} />
    }

    // Otherwise show the normal tab content
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview
            dashboardData={dashboardData}
            userProfile={userProfile}
            enrolledClasses={enrolledClasses}
            upcomingAssignments={upcomingAssignments}
            recentGrades={recentGrades}
            onTabChange={handleTabChange}
          />
        )
      case 'classes':
        return <ClassesView enrolledClasses={enrolledClasses} onClassClick={handleClassClick} />
      case 'grades':
        return <GradesView enrolledClasses={enrolledClasses} recentGrades={recentGrades} gradesSummary={gradesSummary} reviewQuestions={reviewQuestions} reviewStats={reviewStats} />
      case 'assignments':
        return <AssignmentsView upcomingAssignments={upcomingAssignments} onAssignmentClick={handleAssignmentClick} />
      case 'study-planner':
        return <StudyPlannerView />
      case 'career':
        return <CareerView />
      case 'hsc-subjects-recommendation':
        return <HSCSubjectRecommendation />
      case 'hsc-subjects':
        return <HSCSubjectsView />
      case 'weekly-report':
        return <WeeklyReportView enrolledClasses={enrolledClasses} recentGrades={recentGrades} upcomingAssignments={upcomingAssignments} />
      case 'settings':
        return <SettingsView userProfile={userProfile} onProfileUpdate={setUserProfile} />
      default:
        return null
    }
  }

  const getPageTitle = () => {
    if (selectedClassId) {
      const classData = enrolledClasses.find(c => c.id === selectedClassId)
      return classData ? classData.name : 'Class Details'
    }
    if (selectedAssignmentId) {
      const assignmentData = upcomingAssignments.find(a => a.id === selectedAssignmentId)
      return assignmentData ? assignmentData.title : 'Assignment Details'
    }
    const titles = {
      dashboard: 'Dashboard',
      classes: 'My Classes',
      grades: 'Grades',
      assignments: 'Assignments',
      'study-planner': 'AI Study Planner',
      career: 'Career Recommendations',
      'hsc-subjects-recommendation': 'HSC Subject Recommendation',
      'hsc-subjects': 'Browse HSC Subjects',
      'weekly-report': 'Weekly Report',
      settings: 'Settings'
    }
    return titles[activeTab] || 'Dashboard'
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo-dashboard" onClick={() => navigate('/student/dashboard?tab=dashboard')}>
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
            className={`nav-item ${activeTab === 'grades' ? 'active' : ''}`}
            onClick={() => handleTabChange('grades')}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-label">Grades</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => handleTabChange('assignments')}
          >
            <span className="nav-icon">📝</span>
            <span className="nav-label">Assignments</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'study-planner' ? 'active' : ''}`}
            onClick={() => handleTabChange('study-planner')}
          >
            <span className="nav-icon">🤖</span>
            <span className="nav-label">AI Study Planner</span>
          </button>
          {/* New HSC Subject Recommendation button */}
          <button 
            className={`nav-item ${activeTab === 'hsc-subjects-recommendation' ? 'active' : ''}`}
            onClick={() => handleTabChange('hsc-subjects-recommendation')}
          >
            <span className="nav-icon">🧠</span>
            <span className="nav-label">HSC Subject Recommendation</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'career' ? 'active' : ''}`}
            onClick={() => handleTabChange('career')}
          >
            <span className="nav-icon">🎯</span>
            <span className="nav-label">Career Path</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'hsc-subjects' ? 'active' : ''}`}
            onClick={() => handleTabChange('hsc-subjects')}
          >
            <span className="nav-icon">📖</span>
            <span className="nav-label">HSC Subjects</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'weekly-report' ? 'active' : ''}`}
            onClick={() => handleTabChange('weekly-report')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Weekly Report</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => handleTabChange('settings')}>
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
                <span className="user-avatar">{userProfile?.avatar || '👤'}</span>
                <span className="user-name">
                  {userProfile?.first_name && userProfile?.last_name 
                    ? `${userProfile.first_name} ${userProfile.last_name}` 
                    : userProfile?.name || (loading ? 'Loading...' : '')}
                </span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-info-name">
                      {userProfile?.first_name && userProfile?.last_name 
                        ? `${userProfile.first_name} ${userProfile.last_name}` 
                        : userProfile?.name || ''}
                    </p>
                    <p className="user-info-email">{userProfile?.email || ''}</p>
                    <p className="user-info-id">ID: {userProfile?.id ? userProfile.id.slice(0, 8) : 'N/A'}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => handleTabChange('settings')}>
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
