import { useState, useEffect } from 'react'
import teacherApi from '../../services/teacherApi'
import './ClassDetailView.css'
import './ModulesView.css'

function ClassDetailView({ classId, onBack, onCreateAssignment, onAssignmentClick }) {
  const [classData, setClassData] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [modules, setModules] = useState([])
  const [loadingModules, setLoadingModules] = useState(false)
  const [showCreateModule, setShowCreateModule] = useState(false)
  const [newModule, setNewModule] = useState({ title: '', description_richtext: '', is_published: false })
  const [creatingModule, setCreatingModule] = useState(false)
  const [announcements, setAnnouncements] = useState([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false)
  const [assignments, setAssignments] = useState([])
  const [loadingAssignments, setLoadingAssignments] = useState(false)

  const [expandedModuleId, setExpandedModuleId] = useState(null)
  const [showNewItemFor, setShowNewItemFor] = useState(null)
  const [newItem, setNewItem] = useState({ item_type: 'link', title: '', link_url: '', content_richtext: '', description: '' })
  const [uploadingFileFor, setUploadingFileFor] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [summarizingFor, setSummarizingFor] = useState(null)
  const [descriptionDrafts, setDescriptionDrafts] = useState({})
  const [editingDescriptionFor, setEditingDescriptionFor] = useState(null)

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await teacherApi.getClassById(classId)
        setClassData(response.class || response.data)
      } catch (error) {
        console.error('Failed to fetch class details:', error)
        console.error('Error details:', error.message, error.response)
      } finally {
        setLoading(false)
      }
    }

    fetchClassData()
  }, [classId])

  const fetchModules = async () => {
    setLoadingModules(true)
    try {
      const res = await teacherApi.getModules(classId)
      setModules(res.modules || [])
    } catch (e) {
      console.error('Failed to fetch modules', e)
    } finally {
      setLoadingModules(false)
    }
  }

  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true)
    try {
      const res = await teacherApi.getAnnouncements()
      // Filter announcements for this specific class
      const classAnnouncements = (res.announcements || []).filter(a => a.classId === classId)
      setAnnouncements(classAnnouncements)
    } catch (e) {
      console.error('Failed to fetch announcements', e)
    } finally {
      setLoadingAnnouncements(false)
    }
  }

  const fetchAssignments = async () => {
    setLoadingAssignments(true)
    try {
      const res = await teacherApi.getAssignments()
      // Filter assignments for this specific class
      const classAssignments = (res.assignments || []).filter(a => a.class_id === classId)
      setAssignments(classAssignments)
    } catch (e) {
      console.error('Failed to fetch assignments', e)
    } finally {
      setLoadingAssignments(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'modules') {
      fetchModules()
    } else if (activeTab === 'announcements') {
      fetchAnnouncements()
    } else if (activeTab === 'assignments') {
      fetchAssignments()
    }
  }, [activeTab, classId])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p>Loading class details...</p>
      </div>
    )
  }

  if (!classData) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
        <h3>Class Not Found</h3>
        <button className="btn-back" onClick={onBack}>
          ← Back to Classes
        </button>
      </div>
    )
  }

  return (
    <div className="class-detail-page">
      {/* Header */}
      <div className="detail-page-header">
        <button className="btn-back" onClick={onBack}>
          ← Back to Classes
        </button>
        <div className="class-detail-hero" style={{ borderLeft: `6px solid ${classData.color || '#667eea'}` }}>
          <div className="class-detail-info">
            <div className="class-icon-large" style={{ background: `${classData.color || '#667eea'}20`, color: classData.color || '#667eea' }}>
              📚
            </div>
            <div>
              <h1 className="class-detail-title">{classData.name}</h1>
              <p className="class-detail-code">{classData.code}</p>
              <p className="class-detail-period">
                Created {new Date(classData.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="detail-tabs">
        <button 
          className={`detail-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`detail-tab ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </button>
        <button 
          className={`detail-tab ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          Announcements
        </button>
        <button 
          className={`detail-tab ${activeTab === 'modules' ? 'active' : ''}`}
          onClick={() => setActiveTab('modules')}
        >
          Modules
        </button>
      </div>

      {/* Content Sections */}
      <div className="detail-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="detail-card">
              <h2>Class Description</h2>
              <p>{classData.description || 'No description'}</p>
            </div>

            <div className="detail-card">
              <h2>Class Information</h2>
              <div className="info-row">
                <span className="info-icon">🏷️</span>
                <span>Class Code: {classData.code}</span>
              </div>
              <div className="info-row">
                <span className="info-icon">📅</span>
                <span>Created: {new Date(classData.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="detail-card">
              <h2>Quick Actions</h2>
              <button 
                className="btn-primary"
                onClick={onCreateAssignment}
                style={{ marginRight: '1rem' }}
              >
                ➕ Create Assignment
              </button>
            </div>
          </div>
        )}

        

        {activeTab === 'assignments' && (
          <div className="assignments-section">
            <div className="detail-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Class Assignments</h2>
                <button 
                  className="btn-primary"
                  onClick={onCreateAssignment}
                >
                  ➕ Create Assignment
                </button>
              </div>
              
              {loadingAssignments ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                  <p>Loading assignments...</p>
                </div>
              ) : assignments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                  <p>No assignments yet for this class</p>
                  <p style={{ color: '#718096', marginTop: '0.5rem' }}>
                    Click "Create Assignment" to add your first assignment
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {assignments.map(assignment => {
                    const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null
                    const isDraft = assignment.status === 'draft'
                    const isPublished = assignment.status === 'published'
                    
                    return (
                      <div 
                        key={assignment.id} 
                        style={{
                          padding: '1.5rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          background: '#fff',
                          borderLeft: isDraft ? '4px solid #ed8936' : '4px solid #48bb78',
                          cursor: 'pointer'
                        }}
                        onClick={() => onAssignmentClick && onAssignmentClick(assignment.id)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                              <h3 style={{ 
                                fontSize: '1.125rem', 
                                fontWeight: '600', 
                                margin: 0,
                                color: '#2d3748'
                              }}>
                                {assignment.title}
                              </h3>
                              <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                background: isDraft ? '#fed7d7' : '#c6f6d5',
                                color: isDraft ? '#c53030' : '#2f855a'
                              }}>
                                {isDraft ? '📝 Draft' : '✓ Published'}
                              </span>
                            </div>
                            {assignment.description && (
                              <p style={{ 
                                color: '#718096', 
                                fontSize: '0.875rem',
                                marginTop: '0.5rem',
                                marginBottom: '0.75rem'
                              }}>
                                {assignment.description.length > 150 
                                  ? `${assignment.description.substring(0, 150)}...` 
                                  : assignment.description}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div style={{ 
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                          gap: '1rem',
                          padding: '1rem',
                          background: '#f7fafc',
                          borderRadius: '6px',
                          marginBottom: '1rem'
                        }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.25rem' }}>Due Date</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2d3748' }}>
                              {dueDate ? dueDate.toLocaleDateString() : 'No due date'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.25rem' }}>Total Points</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2d3748' }}>
                              {assignment.totalPoints || 100}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.25rem' }}>Submissions</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2d3748' }}>
                              {assignment.submissionStats?.total || 0} / {assignment.submissionStats?.totalStudents || 0}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.25rem' }}>Pending Grading</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: assignment.submissionStats?.pending > 0 ? '#d69e2e' : '#2d3748' }}>
                              {assignment.submissionStats?.pending || 0}
                            </div>
                          </div>
                        </div>
                        
                        
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="announcements-section">
            <div className="detail-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Class Announcements</h2>
              </div>
              
              {loadingAnnouncements ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                  <p>Loading announcements...</p>
                </div>
              ) : announcements.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📢</div>
                  <p>No announcements yet for this class</p>
                  <p style={{ color: '#718096', marginTop: '0.5rem' }}>
                    Post announcements from the Announcements tab
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {announcements.map(announcement => (
                    <div 
                      key={announcement.id} 
                      style={{
                        padding: '1.5rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        background: '#fff'
                      }}
                    >
                      <h3 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: '600', 
                        marginBottom: '0.5rem',
                        color: '#2d3748'
                      }}>
                        {announcement.title}
                      </h3>
                      <p style={{ 
                        color: '#4a5568', 
                        lineHeight: '1.6',
                        marginBottom: '1rem'
                      }}>
                        {announcement.content}
                      </p>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        color: '#718096',
                        display: 'flex',
                        gap: '1rem'
                      }}>
                        <span>📅 Posted {new Date(announcement.createdAt).toLocaleDateString()}</span>
                        {announcement.viewCount !== undefined && (
                          <span>👁️ {announcement.viewCount} view{announcement.viewCount !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="modules-section">
            <div className="detail-card">
              <div className="modules-header">
                <h2>📚 Modules</h2>
                <button className="btn-primary" onClick={() => setShowCreateModule(true)}>➕ New Module</button>
              </div>

              {loadingModules ? (
                <div className="loading-state">Loading modules…</div>
              ) : (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {modules.length === 0 && (
                    <div className="empty-state">
                      <div className="empty-state-icon">📦</div>
                      <p>No modules yet. Click "New Module" to create one.</p>
                    </div>
                  )}
                  {modules.map(mod => (
                    <div key={mod.id} className="module-card">
                      <div className="module-card-header">
                        <div className="module-info">
                          <h3 className="module-title">{mod.title}</h3>
                          <span className={`module-status-badge ${mod.is_published ? 'published' : 'draft'}`}>
                            {mod.is_published ? '✓ Published' : '✎ Draft'}
                          </span>
                        </div>
                        <div className="module-actions">
                          <button className="btn-secondary" onClick={() => setExpandedModuleId(expandedModuleId === mod.id ? null : mod.id)}>
                            {expandedModuleId === mod.id ? '▲ Hide' : '▼ View'}
                          </button>
                          <button className="btn-secondary" onClick={async () => { await teacherApi.updateModule(mod.id, { is_published: !mod.is_published }); fetchModules() }}>
                            {mod.is_published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button className="btn-secondary" onClick={() => setShowNewItemFor(showNewItemFor === mod.id ? null : mod.id)}>+ Add Item</button>
                          <button className="btn-danger" onClick={async () => { if (confirm('Delete this module and all its items?')) { await teacherApi.deleteModule(mod.id); fetchModules() } }}>🗑 Delete</button>
                        </div>
                      </div>

                      {expandedModuleId === mod.id && (
                        <div className="module-content">
                          {(mod.items || []).length === 0 && (
                            <div className="module-items-empty">No items in this module yet</div>
                          )}
                          {(mod.items || []).map(it => (
                            <div key={it.id} className="module-item">
                              <div className="module-item-info">
                                <div className="module-item-title">
                                  {it.title}
                                  <span className="module-item-type-badge">{it.item_type}</span>
                                </div>
                                {it.item_type === 'link' && it.link_url && (
                                  <a href={it.link_url} target="_blank" rel="noreferrer" className="module-item-link">🔗 {it.link_url}</a>
                                )}
                                {it.item_type === 'rich_text' && it.content_richtext && (
                                  <div className="module-item-content">{it.content_richtext}</div>
                                )}
                                {it.item_type === 'file' && it.file_public_url && (
                                  <a href={it.file_public_url} target="_blank" rel="noreferrer" className="module-item-link">📥 Download File</a>
                                )}
                                {it.item_type === 'file' && !it.file_public_url && (
                                  <div style={{ color: '#e53e3e', fontSize: 12, marginTop: 4 }}>⚠ No file uploaded yet</div>
                                )}
                                {it.item_type === 'file' && (
                                  <div className="file-description-section">
                                    {editingDescriptionFor === it.id ? (
                                      <div className="description-edit-mode">
                                        <label className="description-label">Description</label>
                                        <textarea
                                          className="description-textarea"
                                          rows="3"
                                          value={(descriptionDrafts[it.id] ?? it.description) || ''}
                                          onChange={e => setDescriptionDrafts(prev => ({ ...prev, [it.id]: e.target.value }))}
                                          placeholder="Add a short description for this file"
                                        />
                                        <div className="description-actions">
                                          <button
                                            className="btn-ai-summarize"
                                            disabled={summarizingFor === it.id || !it.file_public_url || !(it.file_mime_type || '').includes('pdf')}
                                            title={!it.file_public_url ? 'Upload the PDF first' : (!(it.file_mime_type || '').includes('pdf') ? 'Only PDFs supported' : 'Generate summary')}
                                            onClick={async () => {
                                              setSummarizingFor(it.id)
                                              try {
                                                const res = await teacherApi.summarizeModuleItem(mod.id, it.id)
                                                const summary = res.summary || ''
                                                setDescriptionDrafts(prev => ({ ...prev, [it.id]: summary }))
                                              } catch (err) {
                                                console.error('Summarize failed', err)
                                                alert('Failed to summarize. Ensure OPENAI_BASE_URL and key configured, and the file is a PDF.')
                                              } finally {
                                                setSummarizingFor(null)
                                              }
                                            }}
                                          >{summarizingFor === it.id ? '⏳ Summarizing…' : '✨ AI Summarize'}</button>
                                          <button
                                            className="btn-save-description"
                                            onClick={async () => {
                                              const draft = (descriptionDrafts[it.id] ?? it.description) || ''
                                              try {
                                                await teacherApi.updateModuleItem(mod.id, it.id, { description: draft })
                                                setEditingDescriptionFor(null)
                                                setDescriptionDrafts(prev => {
                                                  const newDrafts = { ...prev }
                                                  delete newDrafts[it.id]
                                                  return newDrafts
                                                })
                                                await fetchModules()
                                              } catch (e) {
                                                console.error('Save description failed', e)
                                                alert('Failed to save description')
                                              }
                                            }}
                                          >💾 Save</button>
                                          <button
                                            className="btn-cancel-description"
                                            onClick={() => {
                                              setEditingDescriptionFor(null)
                                              setDescriptionDrafts(prev => {
                                                const newDrafts = { ...prev }
                                                delete newDrafts[it.id]
                                                return newDrafts
                                              })
                                            }}
                                          >Cancel</button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="description-view-mode">
                                        {it.description ? (
                                          <>
                                            <div className="description-label">Description:</div>
                                            <div className="description-display">{it.description}</div>
                                            <button
                                              className="btn-edit-description"
                                              onClick={() => setEditingDescriptionFor(it.id)}
                                            >✏️ Edit Description</button>
                                          </>
                                        ) : (
                                          <button
                                            className="btn-add-description"
                                            onClick={() => setEditingDescriptionFor(it.id)}
                                          >➕ Add Description</button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="module-item-actions">
                                {it.item_type === 'file' && (
                                  <label className="btn-secondary" style={{ cursor: 'pointer' }}>
                                    {uploadingFileFor === it.id ? '⏳ Uploading…' : it.file_public_url ? '↻ Replace' : '📁 Upload'}
                                    <input type="file" style={{ display: 'none' }} onChange={async (e) => {
                                      const file = e.target.files?.[0]
                                      if (!file) return
                                      
                                      // Validate file size (50MB limit)
                                      const MAX_SIZE = 50 * 1024 * 1024; // 50MB
                                      if (file.size > MAX_SIZE) {
                                        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                                        alert(`File size (${fileSizeMB}MB) exceeds the maximum allowed size of 50MB. Please select a smaller file.`);
                                        e.target.value = ''; // Reset input
                                        return;
                                      }
                                      
                                      setUploadingFileFor(it.id)
                                      try {
                                        await teacherApi.uploadModuleFile(mod.id, it.id, file)
                                        await fetchModules()
                                      } catch (err) {
                                        console.error('Upload error', err)
                                        alert('Upload failed: ' + (err.message || 'unknown error'))
                                      } finally {
                                        setUploadingFileFor(null)
                                      }
                                    }} />
                                  </label>
                                )}
                                <button className="btn-danger" onClick={async () => { if (confirm('Delete this item?')) { await teacherApi.deleteModuleItem(mod.id, it.id); fetchModules() } }}>🗑</button>
                              </div>
                            </div>
                          ))}

                          {showNewItemFor === mod.id && (
                              <div className="new-item-form">
                              <div className="new-item-form-grid">
                                <label>Type</label>
                                <select value={newItem.item_type} onChange={e => setNewItem(prev => ({ ...prev, item_type: e.target.value }))}>
                                  <option value="link">link</option>
                                  <option value="rich_text">rich_text</option>
                                  <option value="file">file</option>
                                </select>
                                <label>Title</label>
                                <input value={newItem.title} onChange={e => setNewItem(prev => ({ ...prev, title: e.target.value }))} placeholder="Item title" />
                                {newItem.item_type === 'link' && (<>
                                  <label>URL</label>
                                  <input value={newItem.link_url} onChange={e => setNewItem(prev => ({ ...prev, link_url: e.target.value }))} placeholder="https://..." />
                                </>)}
                                {newItem.item_type === 'rich_text' && (<>
                                  <label>Content</label>
                                  <textarea rows="3" value={newItem.content_richtext} onChange={e => setNewItem(prev => ({ ...prev, content_richtext: e.target.value }))} placeholder="Write content..." />
                                </>)}
                                {newItem.item_type === 'file' && (<>
                                  <label>Select File</label>
                                  <div>
                                    <input type="file" onChange={e => {
                                      const file = e.target.files?.[0];
                                      if (!file) {
                                        setSelectedFile(null);
                                        return;
                                      }
                                      
                                      // Validate file size (50MB limit)
                                      const MAX_SIZE = 50 * 1024 * 1024; // 50MB
                                      if (file.size > MAX_SIZE) {
                                        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                                        alert(`File size (${fileSizeMB}MB) exceeds the maximum allowed size of 50MB. Please select a smaller file.`);
                                        e.target.value = ''; // Reset input
                                        setSelectedFile(null);
                                        return;
                                      }
                                      
                                      setSelectedFile(file);
                                    }} />
                                    {selectedFile && <div className="file-selected-info">✓ Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)}MB)</div>}
                                  </div>
                                    <label>Description</label>
                                    <textarea rows="3" value={newItem.description} onChange={e => setNewItem(prev => ({ ...prev, description: e.target.value }))} placeholder="Add a short description (or generate after upload)" />
                                </>)}
                              </div>
                              <div className="new-item-actions">
                                <button className="btn-secondary" onClick={() => { setShowNewItemFor(null); setSelectedFile(null) }}>Cancel</button>
                                <button className="btn-primary" disabled={uploadingFileFor === 'new'} onClick={async () => {
                                  if (!newItem.title) { alert('Title required'); return }
                                  if (newItem.item_type === 'file' && !selectedFile) { alert('Please select a file'); return }
                                  setUploadingFileFor('new')
                                  try {
                                    const payload = {
                                      item_type: newItem.item_type,
                                      title: newItem.title,
                                        description: newItem.item_type === 'file' ? newItem.description : '',
                                      link_url: newItem.item_type === 'link' ? newItem.link_url : null,
                                      content_richtext: newItem.item_type === 'rich_text' ? newItem.content_richtext : null
                                    }
                                    const created = await teacherApi.createModuleItem(mod.id, payload)
                                    // if file type, upload immediately
                                    if (newItem.item_type === 'file' && selectedFile) {
                                      await teacherApi.uploadModuleFile(mod.id, created.item.id, selectedFile)
                                    }
                                      setNewItem({ item_type: 'link', title: '', link_url: '', content_richtext: '', description: '' })
                                    setSelectedFile(null)
                                    setShowNewItemFor(null)
                                    await fetchModules()
                                  } catch (e) {
                                    console.error('Create item failed', e)
                                    alert('Failed to create item: ' + (e.message || 'unknown error'))
                                  } finally {
                                    setUploadingFileFor(null)
                                  }
                                }}>{uploadingFileFor === 'new' ? 'Creating & Uploading…' : 'Create Item'}</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {showCreateModule && (
              <div className="modal-overlay" onClick={() => setShowCreateModule(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Create Module</h3>
                    <button className="btn-close-modal" onClick={() => setShowCreateModule(false)}>✕</button>
                  </div>
                  <div className="form-group">
                    <label>Title</label>
                    <input value={newModule.title} onChange={e => setNewModule(prev => ({ ...prev, title: e.target.value }))} placeholder="Module title" />
                  </div>
                  <div className="form-group">
                    <label>Description (rich text)</label>
                    <textarea rows="3" value={newModule.description_richtext} onChange={e => setNewModule(prev => ({ ...prev, description_richtext: e.target.value }))} placeholder="Describe this module..." />
                  </div>
                  <div className="form-group">
                    <label><input type="checkbox" checked={newModule.is_published} onChange={e => setNewModule(prev => ({ ...prev, is_published: e.target.checked }))} /> Published</label>
                  </div>
                  <div className="modal-actions">
                    <button className="btn-secondary" onClick={() => setShowCreateModule(false)}>Cancel</button>
                    <button className="btn-primary-action" disabled={creatingModule} onClick={async () => {
                      if (!newModule.title) { alert('Title required'); return }
                      setCreatingModule(true)
                      try {
                        await teacherApi.createModule(classId, newModule)
                        setShowCreateModule(false)
                        setNewModule({ title: '', description_richtext: '', is_published: false })
                        await fetchModules()
                      } catch (e) {
                        console.error('Create module failed', e)
                        alert('Failed to create module')
                      } finally {
                        setCreatingModule(false)
                      }
                    }}>{creatingModule ? 'Creating…' : 'Create Module'}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClassDetailView
