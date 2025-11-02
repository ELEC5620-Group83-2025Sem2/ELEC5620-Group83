import { useState, useEffect } from 'react'
import teacherApi from '../../services/teacherApi'
import './ClassDetailView.css'
import './ModulesView.css'

function ClassDetailView({ classId, onBack, onCreateAssignment }) {
  const [classData, setClassData] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [modules, setModules] = useState([])
  const [loadingModules, setLoadingModules] = useState(false)
  const [showCreateModule, setShowCreateModule] = useState(false)
  const [newModule, setNewModule] = useState({ title: '', description_richtext: '', is_published: false })
  const [creatingModule, setCreatingModule] = useState(false)

  const [expandedModuleId, setExpandedModuleId] = useState(null)
  const [showNewItemFor, setShowNewItemFor] = useState(null)
  const [newItem, setNewItem] = useState({ item_type: 'link', title: '', link_url: '', content_richtext: '' })
  const [uploadingFileFor, setUploadingFileFor] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

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

  useEffect(() => {
    if (activeTab === 'modules') {
      fetchModules()
    }
  }, [activeTab])

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
          className={`detail-tab ${activeTab === 'roster' ? 'active' : ''}`}
          onClick={() => setActiveTab('roster')}
        >
          Student Roster
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

        {activeTab === 'roster' && (
          <div className="roster-section">
            <div className="detail-card">
              <h2>Student Roster</h2>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Student roster feature coming soon</p>
                <p style={{ color: '#718096', marginTop: '0.5rem' }}>
                  View and manage class students here
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="assignments-section">
            <div className="detail-card">
              <h2>Class Assignments</h2>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Class assignments list coming soon</p>
                <button 
                  className="btn-primary"
                  onClick={onCreateAssignment}
                  style={{ marginTop: '1rem' }}
                >
                  ➕ Create Assignment
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="announcements-section">
            <div className="detail-card">
              <h2>Class Announcements</h2>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Class announcements feature coming soon</p>
                <p style={{ color: '#718096', marginTop: '0.5rem' }}>
                  You can post new announcements from the Announcements tab
                </p>
              </div>
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
                                      link_url: newItem.item_type === 'link' ? newItem.link_url : null,
                                      content_richtext: newItem.item_type === 'rich_text' ? newItem.content_richtext : null
                                    }
                                    const created = await teacherApi.createModuleItem(mod.id, payload)
                                    // if file type, upload immediately
                                    if (newItem.item_type === 'file' && selectedFile) {
                                      await teacherApi.uploadModuleFile(mod.id, created.item.id, selectedFile)
                                    }
                                    setNewItem({ item_type: 'link', title: '', link_url: '', content_richtext: '' })
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
