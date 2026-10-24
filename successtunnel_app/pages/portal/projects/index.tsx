import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios'
import PortalShell from '../../../components/portal/PortalShell'
import styles from '../../../components/portal/Portal.module.css'
import {
  HiOutlineClipboardList,
  HiOutlinePlus,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineX,
  HiOutlineCash,
  HiOutlineArrowRight,
  HiOutlineSparkles,
} from 'react-icons/hi'

export default function ProjectsModule() {
  const [projects, setProjects] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedDept, setSelectedDept] = useState('')

  // Create Project Modal
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [businessObjective, setBusinessObjective] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [managerId, setManagerId] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [status, setStatus] = useState('PLANNED')
  const [budget, setBudget] = useState('250000')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadProjects = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter && statusFilter !== 'ALL') params.set('status', statusFilter)
      if (selectedDept) params.set('departmentId', selectedDept)

      const res = await axios.get(`/api/portal/projects?${params.toString()}`)
      setProjects(res.data)
    } catch (err) {
      console.error('Failed to load projects', err)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, selectedDept])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  useEffect(() => {
    async function loadMeta() {
      try {
        const [deptRes, empRes] = await Promise.all([
          axios.get('/api/portal/departments'),
          axios.get('/api/portal/employees?limit=50'),
        ])
        setDepartments(deptRes.data)
        setEmployees(empRes.data.data)
      } catch (err) {
        console.error('Failed to load project metadata', err)
      }
    }
    loadMeta()
  }, [])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await axios.post('/api/portal/projects', {
        name,
        description,
        businessObjective,
        departmentId: departmentId ? parseInt(departmentId) : null,
        managerId: managerId ? parseInt(managerId) : null,
        priority,
        status,
        budget,
        startDate,
        endDate: endDate || null,
      })
      setShowModal(false)
      setName('')
      setDescription('')
      setBusinessObjective('')
      loadProjects()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create project')
    } finally {
      setSubmitting(false)
    }
  }

  const getPriorityBadge = (p: string) => {
    switch (p) {
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

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'IN_PROGRESS':
        return styles.badgeSuccess
      case 'COMPLETED':
        return styles.badgeInfo
      case 'ON_HOLD':
        return styles.badgeWarning
      case 'CANCELLED':
        return styles.badgeDanger
      default:
        return styles.badgeNeutral
    }
  }

  return (
    <PortalShell title="Project Portfolio" breadcrumbs={[{ label: 'Projects' }]}>
      <Head>
        <title>Projects — Success Tunnel ERP</title>
      </Head>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
            Enterprise Projects Portfolio
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Manage roadmaps, deliverables, milestone progress, and task allocations.
          </p>
        </div>

        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setShowModal(true)}>
          <HiOutlinePlus style={{ fontSize: '1.1rem' }} />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className={styles.card} style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '0 1 200px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.select}
            >
              <option value="ALL">All Statuses</option>
              <option value="PLANNED">Planned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div style={{ flex: '0 1 220px' }}>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className={styles.select}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Project Cards Grid */}
      {loading ? (
        <div className={styles.card} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          Loading enterprise projects...
        </div>
      ) : projects.length === 0 ? (
        <div className={styles.card} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          No projects matched the current filter.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {projects.map((prj) => (
            <div key={prj.id} className={styles.card} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#2563eb',
                    }}>
                      {prj.projectCode}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {prj.name}
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <span className={`${styles.badge} ${getPriorityBadge(prj.priority)}`}>
                    {prj.priority}
                  </span>
                  <span className={`${styles.badge} ${getStatusBadge(prj.status)}`}>
                    {prj.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.5rem 0 1rem 0', flex: 1 }}>
                {prj.description || prj.businessObjective || 'No description provided.'}
              </p>

              {/* Progress Bar */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', color: '#475569', marginBottom: '0.35rem' }}>
                  <span>Completion Status ({prj.taskStats?.done || 0}/{prj.taskStats?.total || 0} tasks done)</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{prj.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${prj.progress}%`, height: '100%', background: '#2563eb', borderRadius: '4px' }} />
                </div>
              </div>

              {/* Project Meta Footer */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Lead: <strong style={{ color: '#0f172a' }}>{prj.manager?.name || 'Unassigned'}</strong>
                </div>

                <Link
                  href={`/portal/tasks?projectId=${prj.id}`}
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                >
                  <span>Task Board</span>
                  <HiOutlineArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Initiate New Enterprise Project
              </h2>
              <button
                className={styles.collapseBtn}
                onClick={() => setShowModal(false)}
                style={{ color: '#64748b' }}
              >
                <HiOutlineX style={{ fontSize: '1.2rem' }} />
              </button>
            </div>

            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                marginBottom: '1rem',
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleCreateProject}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Project Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                  placeholder="e.g. Q4 Corporate Compliance Overhaul"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Owning Department</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className={styles.select}
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Project Manager / Lead</label>
                  <select
                    value={managerId}
                    onChange={(e) => setManagerId(e.target.value)}
                    className={styles.select}
                  >
                    <option value="">Assign Project Manager</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={styles.select}
                  >
                    <option value="PLANNED">Planned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="ON_HOLD">On Hold</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={styles.select}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Estimated Budget (INR)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Target Completion Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Business Objective</label>
                <textarea
                  rows={2}
                  value={businessObjective}
                  onChange={(e) => setBusinessObjective(e.target.value)}
                  className={styles.textarea}
                  placeholder="What organizational outcome will this initiative achieve?"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  {submitting ? 'Creating Project...' : 'Launch Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalShell>
  )
}
