import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import axios from 'axios'
import PortalShell from '../../../components/portal/PortalShell'
import styles from '../../../components/portal/Portal.module.css'
import {
  HiOutlineClipboardList,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineViewBoards,
  HiOutlineTable,
  HiOutlineChatAlt2,
  HiOutlineClock,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineSparkles,
} from 'react-icons/hi'

const KANBAN_COLUMNS = [
  { id: 'BACKLOG', label: 'Backlog', color: '#64748b' },
  { id: 'TODO', label: 'To Do', color: '#3b82f6' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: '#f59e0b' },
  { id: 'IN_REVIEW', label: 'In Review', color: '#8b5cf6' },
  { id: 'DONE', label: 'Done', color: '#10b981' },
]

export default function TasksModule() {
  const router = useRouter()
  const [tasks, setTasks] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')

  // Filters
  const [selectedProject, setSelectedProject] = useState(router.query.projectId as string || '')
  const [selectedAssignee, setSelectedAssignee] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('ALL')
  const [search, setSearch] = useState('')

  // Create Task Modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newProjectId, setNewProjectId] = useState('')
  const [newAssigneeId, setNewAssigneeId] = useState('')
  const [newPriority, setNewPriority] = useState('MEDIUM')
  const [newStatus, setNewStatus] = useState('TODO')
  const [newDueDate, setNewDueDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [createError, setCreateError] = useState('')

  // Task Detail Modal
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [taskDetail, setTaskDetail] = useState<any>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commentSubmitting, setCommentSubmitting] = useState(false)

  const loadTasks = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedProject) params.set('projectId', selectedProject)
      if (selectedAssignee) params.set('assigneeId', selectedAssignee)
      if (selectedPriority && selectedPriority !== 'ALL') params.set('priority', selectedPriority)
      if (search.trim()) params.set('search', search.trim())

      const res = await axios.get(`/api/portal/tasks?${params.toString()}`)
      setTasks(res.data)
    } catch (err) {
      console.error('Failed to load tasks', err)
    } finally {
      setLoading(false)
    }
  }, [selectedProject, selectedAssignee, selectedPriority, search])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  useEffect(() => {
    async function loadMeta() {
      try {
        const [prjRes, empRes] = await Promise.all([
          axios.get('/api/portal/projects'),
          axios.get('/api/portal/employees?limit=50'),
        ])
        setProjects(prjRes.data)
        setEmployees(empRes.data.data)
        if (!selectedProject && prjRes.data[0]) {
          setNewProjectId(prjRes.data[0].id.toString())
        }
      } catch (err) {
        console.error('Failed to load task metadata', err)
      }
    }
    loadMeta()
  }, [selectedProject])

  const handleOpenDetail = async (task: any) => {
    setSelectedTask(task)
    setDetailLoading(true)
    try {
      const res = await axios.get(`/api/portal/tasks/${task.id}`)
      setTaskDetail(res.data)
    } catch (err) {
      console.error('Failed to load task detail', err)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleUpdateStatus = async (taskId: number, newStatusVal: string) => {
    try {
      await axios.put(`/api/portal/tasks/${taskId}`, { status: newStatusVal })
      loadTasks()
      if (selectedTask?.id === taskId) {
        handleOpenDetail({ id: taskId })
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update task status')
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError('')
    setSubmitting(true)

    try {
      await axios.post('/api/portal/tasks', {
        title: newTitle,
        description: newDesc,
        projectId: newProjectId || selectedProject,
        assigneeId: newAssigneeId ? parseInt(newAssigneeId) : null,
        priority: newPriority,
        status: newStatus,
        dueDate: newDueDate || null,
      })
      setShowCreateModal(false)
      setNewTitle('')
      setNewDesc('')
      loadTasks()
    } catch (err: any) {
      setCreateError(err.response?.data?.error || 'Failed to create task')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setCommentSubmitting(true)

    try {
      await axios.post(`/api/portal/tasks/${selectedTask.id}`, { content: commentText })
      setCommentText('')
      handleOpenDetail(selectedTask)
      loadTasks()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to post comment')
    } finally {
      setCommentSubmitting(false)
    }
  }

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'URGENT':
      case 'CRITICAL':
        return styles.badgeDanger
      case 'HIGH':
        return styles.badgeWarning
      case 'MEDIUM':
        return styles.badgeInfo
      default:
        return styles.badgeNeutral
    }
  }

  return (
    <PortalShell title="Task Kanban" breadcrumbs={[{ label: 'Tasks & Kanban' }]}>
      <Head>
        <title>Tasks & Kanban Board — Success Tunnel ERP</title>
      </Head>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
            Work Items & Kanban Board
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            {tasks.length} tasks across project milestone delivery streams
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ background: '#e2e8f0', borderRadius: '6px', padding: '0.2rem', display: 'flex' }}>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                background: viewMode === 'kanban' ? '#ffffff' : 'transparent',
                border: 'none',
                borderRadius: '4px',
                padding: '0.4rem 0.65rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: viewMode === 'kanban' ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <HiOutlineViewBoards /> Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                background: viewMode === 'table' ? '#ffffff' : 'transparent',
                border: 'none',
                borderRadius: '4px',
                padding: '0.4rem 0.65rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: viewMode === 'table' ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <HiOutlineTable /> Table
            </button>
          </div>

          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setShowCreateModal(true)}>
            <HiOutlinePlus style={{ fontSize: '1.1rem' }} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={styles.card} style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <HiOutlineSearch style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.input}
              style={{ paddingLeft: '2.2rem' }}
            />
          </div>

          <div style={{ flex: '0 1 200px' }}>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className={styles.select}
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: '0 1 180px' }}>
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className={styles.select}
            >
              <option value="">All Assignees</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: '0 1 150px' }}>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className={styles.select}
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main View: Kanban Board vs Table */}
      {viewMode === 'kanban' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(260px, 1fr))', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {KANBAN_COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id)
            return (
              <div
                key={col.id}
                style={{
                  background: '#f1f5f9',
                  borderRadius: '8px',
                  padding: '1rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '540px',
                }}
              >
                {/* Column Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{col.label}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#e2e8f0', color: '#475569', padding: '0.15rem 0.45rem', borderRadius: '9999px' }}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1 }}>
                  {colTasks.map((t) => {
                    const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE'
                    return (
                      <div
                        key={t.id}
                        onClick={() => handleOpenDetail(t)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          padding: '0.85rem',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                          cursor: 'pointer',
                          transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 700, color: '#2563eb' }}>
                            {t.taskCode}
                          </span>
                          <span className={`${styles.badge} ${getPriorityBadge(t.priority)}`}>
                            {t.priority}
                          </span>
                        </div>

                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a', marginBottom: '0.5rem', lineHeight: '1.25' }}>
                          {t.title}
                        </div>

                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.6rem' }}>
                          {t.project?.name}
                        </div>

                        {/* Footer info: Assignee, Due date & status jump */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f8fafc', paddingTop: '0.4rem', fontSize: '0.75rem' }}>
                          <span style={{ fontWeight: 500, color: '#334155' }}>
                            {t.assignee?.name ? t.assignee.name.split(' ')[0] : 'Unassigned'}
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {t.dueDate && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: isOverdue ? '#dc2626' : '#64748b', fontWeight: isOverdue ? 700 : 500 }}>
                                <HiOutlineClock />
                                {new Date(t.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                            {t._count?.comments > 0 && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', color: '#64748b' }}>
                                <HiOutlineChatAlt2 /> {t._count.comments}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Table View */
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Task Title</th>
                <th>Project</th>
                <th>Assignee</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} onClick={() => handleOpenDetail(t)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2563eb' }}>{t.taskCode}</td>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{t.title}</td>
                  <td style={{ fontSize: '0.8rem', color: '#475569' }}>{t.project?.name}</td>
                  <td>{t.assignee?.name || 'Unassigned'}</td>
                  <td><span className={`${styles.badge} ${getPriorityBadge(t.priority)}`}>{t.priority}</span></td>
                  <td>
                    <select
                      value={t.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleUpdateStatus(t.id, e.target.value)}
                      className={styles.select}
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.4rem', width: 'auto' }}
                    >
                      {KANBAN_COLUMNS.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenDetail(t)
                      }}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Task Detail Modal (Drawer) */}
      {selectedTask && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '680px' }}>
            <div className={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2563eb', fontSize: '0.9rem' }}>
                  {selectedTask.taskCode}
                </span>
                <span className={`${styles.badge} ${getPriorityBadge(selectedTask.priority)}`}>
                  {selectedTask.priority}
                </span>
              </div>
              <button className={styles.collapseBtn} onClick={() => setSelectedTask(null)}>
                <HiOutlineX style={{ fontSize: '1.2rem' }} />
              </button>
            </div>

            {detailLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading details...</div>
            ) : taskDetail ? (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                  {taskDetail.title}
                </h2>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.825rem', color: '#64748b', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div>Project: <strong style={{ color: '#0f172a' }}>{taskDetail.project?.name}</strong></div>
                  <div>Assignee: <strong style={{ color: '#0f172a' }}>{taskDetail.assignee?.name || 'Unassigned'}</strong></div>
                  <div>Due: <strong style={{ color: '#0f172a' }}>{taskDetail.dueDate ? new Date(taskDetail.dueDate).toLocaleDateString() : 'None'}</strong></div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label className={styles.label}>Workflow Stage</label>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {KANBAN_COLUMNS.map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => handleUpdateStatus(taskDetail.id, col.id)}
                        style={{
                          padding: '0.35rem 0.65rem',
                          borderRadius: '4px',
                          border: '1px solid',
                          borderColor: taskDetail.status === col.id ? col.color : '#cbd5e1',
                          background: taskDetail.status === col.id ? col.color : '#ffffff',
                          color: taskDetail.status === col.id ? '#ffffff' : '#334155',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {col.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className={styles.label}>Description & Acceptance Criteria</label>
                  <p style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', color: '#334155', lineHeight: '1.5', margin: 0 }}>
                    {taskDetail.description || 'No detailed instructions provided.'}
                  </p>
                </div>

                {/* Comments & Activity Timeline */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                    Activity History & Discussion
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '220px', overflowY: 'auto', marginBottom: '1rem' }}>
                    {taskDetail.comments?.map((c: any) => (
                      <div key={c.id} style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <strong style={{ color: '#0f172a' }}>{c.author?.name || c.author?.email}</strong>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ margin: 0, color: '#334155' }}>{c.content}</p>
                      </div>
                    ))}
                    {taskDetail.comments?.length === 0 && (
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No comments recorded yet.</div>
                    )}
                  </div>

                  {/* Add Comment Input */}
                  <form onSubmit={handlePostComment} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Add an update or note..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className={styles.input}
                    />
                    <button
                      type="submit"
                      disabled={commentSubmitting || !commentText.trim()}
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      style={{ flexShrink: 0 }}
                    >
                      {commentSubmitting ? 'Posting...' : 'Comment'}
                    </button>
                  </form>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Create New Project Task
              </h2>
              <button className={styles.collapseBtn} onClick={() => setShowCreateModal(false)}>
                <HiOutlineX style={{ fontSize: '1.2rem' }} />
              </button>
            </div>

            {createError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateTask}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={styles.input}
                  placeholder="e.g. Conduct MSME GST Reconciliation Audit"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Associated Project *</label>
                  <select
                    value={newProjectId}
                    onChange={(e) => setNewProjectId(e.target.value)}
                    className={styles.select}
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Assignee</label>
                  <select
                    value={newAssigneeId}
                    onChange={(e) => setNewAssigneeId(e.target.value)}
                    className={styles.select}
                  >
                    <option value="">Unassigned</option>
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className={styles.select}
                  >
                    {KANBAN_COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className={styles.select}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description & Task Notes</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className={styles.textarea}
                  placeholder="Outline key deliverables, dependencies, and requirements..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  {submitting ? 'Creating Task...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalShell>
  )
}
