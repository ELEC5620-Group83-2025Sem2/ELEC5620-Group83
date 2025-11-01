import { useState, useMemo, useEffect } from 'react'
import * as studentApi from '../../services/studentApi'
import './HSCSubjectsView.css'

function HSCSubjectsView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedUnits, setSelectedUnits] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [currentPlan, setCurrentPlan] = useState({ subjects: [], totalUnits: 0, maxUnits: 12 })
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [notification, setNotification] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [hscSubjects, setHscSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState(['All'])
  const [units, setUnits] = useState(['All'])
  const [difficulties, setDifficulties] = useState(['All'])
  
  // Fetch HSC subjects and study plan on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch subjects and study plan in parallel
        const [subjectsRes, planRes] = await Promise.all([
          studentApi.getHSCSubjects().catch(() => ({ subjects: [], categories: ['All'], units: ['All'], difficulties: ['All'] })),
          studentApi.getHSCStudyPlan().catch(() => ({ plan: { subjects: [], totalUnits: 0, plan_name: 'My HSC Plan' } }))
        ])
        
        setHscSubjects(subjectsRes.subjects || [])
        setCategories(subjectsRes.categories || ['All'])
        setUnits(subjectsRes.units || ['All'])
        setDifficulties(subjectsRes.difficulties || ['All'])
        
        // Set study plan
        const plan = planRes.plan || {}
        setCurrentPlan({
          subjects: plan.subjects || [],
          totalUnits: plan.total_units || 0,
          maxUnits: 12,
          planName: plan.plan_name || 'My HSC Plan'
        })
      } catch (error) {
        console.error('Failed to fetch HSC data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Filter and sort subjects
  const filteredSubjects = useMemo(() => {
    let filtered = hscSubjects.filter(subject => {
      const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           subject.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           subject.careerPaths.some(path => path.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'All' || subject.category === selectedCategory
      const matchesUnits = selectedUnits === 'All' || subject.units.toString() === selectedUnits
      const matchesDifficulty = selectedDifficulty === 'All' || subject.difficulty === selectedDifficulty

      return matchesSearch && matchesCategory && matchesUnits && matchesDifficulty
    })

    // Sort subjects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'popularity':
          return b.popularity - a.popularity
        case 'difficulty':
          const difficultyOrder = { 'Low': 1, 'Medium': 2, 'High': 3, 'Very High': 4, 'Extreme': 5 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case 'units':
          return b.units - a.units
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedCategory, selectedUnits, selectedDifficulty, sortBy])

  const handleAddToPlan = async (subject) => {
    // Check if already in plan
    if (isSubjectInPlan(subject.id)) {
      setNotification({
        type: 'error',
        message: 'Subject already in your plan'
      })
      setTimeout(() => setNotification(null), 5000)
      return
    }
    
    // Check if adding would exceed max units
    const newTotalUnits = currentPlan.totalUnits + subject.units
    if (newTotalUnits > currentPlan.maxUnits) {
      setNotification({
        type: 'error',
        message: `Cannot add subject: Would exceed maximum ${currentPlan.maxUnits} units`
      })
      setTimeout(() => setNotification(null), 5000)
      return
    }
    
    // Update plan locally and save to backend
    const newSubjects = [...currentPlan.subjects, subject]
    const newPlan = {
      ...currentPlan,
      subjects: newSubjects,
      totalUnits: newTotalUnits
    }
    setCurrentPlan(newPlan)
    
    try {
      await studentApi.saveHSCStudyPlan({
        subjects: newSubjects,
        plan_name: currentPlan.planName
      })
      
      setNotification({
        type: 'success',
        message: `${subject.name} has been added to your study plan!`
      })
    } catch (error) {
      console.error('Failed to save study plan:', error)
      // Revert on error
      setCurrentPlan(currentPlan)
      setNotification({
        type: 'error',
        message: 'Failed to save study plan. Please try again.'
      })
    }
    
    setTimeout(() => setNotification(null), 5000)
  }

  const handleRemoveFromPlan = async (subjectId) => {
    const subjectToRemove = currentPlan.subjects.find(s => s.id === subjectId)
    if (!subjectToRemove) {
      setNotification({
        type: 'error',
        message: 'Subject not found in plan'
      })
      setTimeout(() => setNotification(null), 5000)
      return
    }
    
    // Update plan locally and save to backend
    const newSubjects = currentPlan.subjects.filter(s => s.id !== subjectId)
    const newPlan = {
      ...currentPlan,
      subjects: newSubjects,
      totalUnits: currentPlan.totalUnits - subjectToRemove.units
    }
    setCurrentPlan(newPlan)
    
    try {
      await studentApi.saveHSCStudyPlan({
        subjects: newSubjects,
        plan_name: currentPlan.planName
      })
      
      setNotification({
        type: 'success',
        message: 'Subject removed from your study plan'
      })
    } catch (error) {
      console.error('Failed to save study plan:', error)
      // Revert on error
      setCurrentPlan(currentPlan)
      setNotification({
        type: 'error',
        message: 'Failed to save study plan. Please try again.'
      })
    }
    
    setTimeout(() => setNotification(null), 5000)
  }

  const isSubjectInPlan = (subjectId) => {
    return currentPlan.subjects.some(s => s.id === subjectId)
  }

  const getPlanWarningsList = () => {
    const warnings = []
    
    if (currentPlan.totalUnits < 10) {
      warnings.push('You need at least 10 units to complete the HSC')
    }
    
    if (currentPlan.totalUnits > currentPlan.maxUnits) {
      warnings.push(`You have exceeded the maximum ${currentPlan.maxUnits} units`)
    }
    
    // Check for English requirement (must have at least 1 English subject)
    const hasEnglish = currentPlan.subjects.some(s => s.category === 'English')
    if (!hasEnglish && currentPlan.subjects.length > 0) {
      warnings.push('You must include at least one English subject')
    }
    
    return warnings
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Low': return '#48bb78'
      case 'Medium': return '#ed8936'
      case 'High': return '#f56565'
      case 'Very High': return '#c53030'
      case 'Extreme': return '#742a2a'
      default: return '#718096'
    }
  }

  const getATARColor = (contribution) => {
    switch (contribution) {
      case 'High': return '#48bb78'
      case 'Medium': return '#ed8936'
      case 'Low': return '#f56565'
      default: return '#718096'
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
    setSelectedUnits('All')
    setSelectedDifficulty('All')
    setSortBy('name')
  }

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject)
  }

  const handleCloseSubjectDetail = () => {
    setSelectedSubject(null)
  }

  // Loading state
  if (loading) {
    return (
      <div className="hsc-subjects-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginLeft: '10px' }}>Loading HSC subjects...</p>
        </div>
      </div>
    )
  }

  // Subject Detail Modal
  if (selectedSubject) {
    return (
      <div className="subject-detail-modal">
        <div className="modal-overlay" onClick={handleCloseSubjectDetail}></div>
        <div className="modal-content subject-modal">
          <div className="modal-header">
            <div>
              <h2>{selectedSubject.name}</h2>
              <span className="subject-code-large">{selectedSubject.code}</span>
            </div>
            <button className="btn-close-modal" onClick={handleCloseSubjectDetail}>
              ✕
            </button>
          </div>

          <div className="subject-detail-content">
            {/* Header Info */}
            <div className="subject-detail-header">
              <div className="detail-badges">
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(selectedSubject.difficulty) }}
                >
                  {selectedSubject.difficulty}
                </span>
                <span className="units-badge-large">{selectedSubject.units} units</span>
                <span className="category-badge">{selectedSubject.category}</span>
              </div>
            </div>

            {/* Description */}
            <div className="detail-section">
              <h3>📚 Course Description</h3>
              <p className="description-full">{selectedSubject.description}</p>
            </div>

            {/* Course Details Grid */}
            <div className="detail-section">
              <h3>📋 Course Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-icon">📌</span>
                  <div>
                    <span className="detail-label">Prerequisites</span>
                    <span className="detail-value">
                      {selectedSubject.prerequisites.length > 0 
                        ? selectedSubject.prerequisites.join(', ') 
                        : 'None'}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🎯</span>
                  <div>
                    <span className="detail-label">ATAR Contribution</span>
                    <span 
                      className="detail-value"
                      style={{ color: getATARColor(selectedSubject.atarContribution), fontWeight: 'bold' }}
                    >
                      {selectedSubject.atarContribution}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📝</span>
                  <div>
                    <span className="detail-label">Exam Type</span>
                    <span className="detail-value">{selectedSubject.examType}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🔬</span>
                  <div>
                    <span className="detail-label">Practical Work</span>
                    <span className="detail-value">{selectedSubject.practicalWork}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Popularity */}
            <div className="detail-section">
              <h3>📊 Popularity</h3>
              <div className="popularity-detail">
                <div className="popularity-bar-large">
                  <div 
                    className="popularity-fill"
                    style={{ width: `${selectedSubject.popularity}%` }}
                  ></div>
                </div>
                <span className="popularity-percentage">{selectedSubject.popularity}% of students choose this subject</span>
              </div>
            </div>

            {/* Career Paths */}
            <div className="detail-section">
              <h3>💼 Career Paths</h3>
              <div className="career-paths-grid">
                {selectedSubject.careerPaths.map((path, index) => (
                  <div key={index} className="career-path-item">
                    <span className="career-icon">🎓</span>
                    <span>{path}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended For */}
            <div className="detail-section">
              <h3>✨ Recommended For</h3>
              <ul className="recommended-list-full">
                {selectedSubject.recommendedFor.map((item, index) => (
                  <li key={index}>
                    <span className="check-icon">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="subject-detail-actions">
              {isSubjectInPlan(selectedSubject.id) ? (
                <button 
                  className="btn-remove-plan-large"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFromPlan(selectedSubject.id)
                  }}
                >
                  ❌ Remove from Plan
                </button>
              ) : (
                <button 
                  className="btn-add-plan-large"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToPlan(selectedSubject)
                  }}
                >
                  ➕ Add to My Plan
                </button>
              )}
              <button 
                className="btn-close-detail"
                onClick={handleCloseSubjectDetail}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="hsc-subjects-container">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="notification-icon">
            {notification.type === 'success' ? '✅' : '⚠️'}
          </span>
          <span className="notification-message">{notification.message}</span>
          <button
            className="notification-close"
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="subjects-header">
        <div className="header-content">
          <h2>Browse HSC Subjects</h2>
          <p>Explore all available HSC subjects and find the perfect combination for your studies.</p>
        </div>
        <div className="header-actions">
          <button
            className="btn-view-plan"
            onClick={() => setShowPlanModal(true)}
          >
            📋 View My Plan ({currentPlan.totalUnits}/{currentPlan.maxUnits} units)
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search subjects by name, code, or career path..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Units:</label>
            <select 
              value={selectedUnits} 
              onChange={(e) => setSelectedUnits(e.target.value)}
              className="filter-select"
            >
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Difficulty:</label>
            <select 
              value={selectedDifficulty} 
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="filter-select"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Name</option>
              <option value="popularity">Popularity</option>
              <option value="difficulty">Difficulty</option>
              <option value="units">Units</option>
            </select>
          </div>

          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>Showing {filteredSubjects.length} of {hscSubjects.length} subjects</p>
      </div>

      {/* Subjects Grid */}
      <div className="subjects-grid">
        {filteredSubjects.map(subject => (
          <div 
            key={subject.id} 
            className="subject-card clickable-card"
            onClick={() => handleSubjectClick(subject)}
          >
            <div className="subject-header">
              <div className="subject-title">
                <h3>{subject.name}</h3>
                <span className="subject-code">{subject.code}</span>
              </div>
              <div className="subject-badges">
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(subject.difficulty) }}
                >
                  {subject.difficulty}
                </span>
                <span className="units-badge">{subject.units} units</span>
              </div>
            </div>

            <div className="subject-category">
              <span className="category-tag">{subject.category}</span>
            </div>

            <p className="subject-description">{subject.description}</p>

            <div className="subject-details">
              <div className="detail-row">
                <span className="detail-label">Prerequisites:</span>
                <span className="detail-value">
                  {subject.prerequisites.length > 0 ? subject.prerequisites.join(', ') : 'None'}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">ATAR Contribution:</span>
                <span 
                  className="detail-value atar-contribution"
                  style={{ color: getATARColor(subject.atarContribution) }}
                >
                  {subject.atarContribution}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Exam Type:</span>
                <span className="detail-value">{subject.examType}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Practical Work:</span>
                <span className="detail-value">{subject.practicalWork}</span>
              </div>
            </div>

            <div className="career-paths">
              <span className="career-label">Career Paths:</span>
              <div className="career-tags">
                {subject.careerPaths.slice(0, 3).map((path, index) => (
                  <span key={index} className="career-tag">{path}</span>
                ))}
                {subject.careerPaths.length > 3 && (
                  <span className="career-tag more">+{subject.careerPaths.length - 3} more</span>
                )}
              </div>
            </div>

            <div className="subject-footer">
              <div className="popularity-indicator">
                <span className="popularity-label">Popularity:</span>
                <div className="popularity-bar">
                  <div 
                    className="popularity-fill"
                    style={{ width: `${subject.popularity}%` }}
                  ></div>
                </div>
                <span className="popularity-value">{subject.popularity}%</span>
              </div>
            </div>

            <div className="recommended-for">
              <span className="recommended-label">Recommended for:</span>
              <ul className="recommended-list">
                {subject.recommendedFor.slice(0, 2).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="subject-actions">
              {isSubjectInPlan(subject.id) ? (
                <button 
                  className="btn-remove-plan"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFromPlan(subject.id)
                  }}
                >
                  ❌ Remove from Plan
                </button>
              ) : (
                <button 
                  className="btn-add-plan"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToPlan(subject)
                  }}
                >
                  ➕ Add to Plan
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredSubjects.length === 0 && (
        <div className="no-results">
          <h3>No subjects found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      )}

      {/* Study Plan Modal */}
      {showPlanModal && (
        <div className="plan-modal-overlay">
          <div className="plan-modal">
            <div className="plan-modal-header">
              <h3>My HSC Study Plan</h3>
              <button
                className="plan-modal-close"
                onClick={() => setShowPlanModal(false)}
              >
                ×
              </button>
            </div>

            <div className="plan-summary">
              <div className="plan-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Units:</span>
                  <span className="stat-value">{currentPlan.totalUnits}/{currentPlan.maxUnits}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Subjects:</span>
                  <span className="stat-value">{currentPlan.subjects.length}</span>
                </div>
              </div>

              <div className="units-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(currentPlan.totalUnits / currentPlan.maxUnits) * 100}%`,
                      backgroundColor: currentPlan.totalUnits >= currentPlan.maxUnits ? '#f56565' : '#667eea'
                    }}
                  ></div>
                </div>
                <span className="progress-text">
                  {currentPlan.totalUnits}/{currentPlan.maxUnits} units used
                </span>
              </div>
            </div>

            {getPlanWarningsList().length > 0 && (
              <div className="plan-warnings">
                <h4>⚠️ Warnings & Recommendations</h4>
                <ul className="warnings-list">
                  {getPlanWarningsList().map((warning, index) => (
                    <li key={index} className="warning-item">{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="plan-subjects">
              <h4>Selected Subjects</h4>
              {currentPlan.subjects.length === 0 ? (
                <div className="empty-plan">
                  <p>Your study plan is empty. Add subjects from the list above to build your HSC lineup.</p>
                </div>
              ) : (
                <div className="plan-subjects-list">
                  {currentPlan.subjects.map(subject => (
                    <div key={subject.id} className="plan-subject-item">
                      <div className="subject-info">
                        <h5>{subject.name}</h5>
                        <span className="subject-code">{subject.code}</span>
                        <span className="subject-units">{subject.units} units</span>
                      </div>
                      <button
                        className="btn-remove-subject"
                        onClick={() => handleRemoveFromPlan(subject.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="plan-modal-actions">
              <button
                className="btn-close-plan"
                onClick={() => setShowPlanModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HSCSubjectsView

