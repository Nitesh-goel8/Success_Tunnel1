import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import axios from 'axios'
import PortalShell from '../../../components/portal/PortalShell'
import styles from '../../../components/portal/Portal.module.css'
import {
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineClipboardList,
  HiOutlineEye,
  HiOutlineViewGrid,
  HiOutlineArrowNarrowDown,
  HiOutlineShieldCheck,
  HiOutlineCode,
} from 'react-icons/hi'

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'hierarchy' | 'cards'>('hierarchy')

  // Create / Edit Modal State
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedDept, setSelectedDept] = useState<any>(null)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [headId, setHeadId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // View Department Members Modal
  const [viewingDept, setViewingDept] = useState<any>(null)
  const [loadingDeptDetails, setLoadingDeptDetails] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const [deptRes, empRes] = await Promise.all([
        axios.get('/api/portal/departments'),
        axios.get('/api/portal/employees?limit=50'),
      ])
      setDepartments(deptRes.data)
      setEmployees(empRes.data.data)
    } catch (err) {
      console.error('Failed to load department data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenCreate = () => {
    setModalMode('create')
    setName('')
    setCode('')
    setDescription('')
    setHeadId('')
    setError('')
    setShowModal(true)
  }

  const handleOpenEdit = (dept: any) => {
    setModalMode('edit')
    setSelectedDept(dept)
    setName(dept.name || '')
    setCode(dept.code || '')
    setDescription(dept.description || '')
    setHeadId(dept.head?.id ? dept.head.id.toString() : '')
    setError('')
    setShowModal(true)
  }

  const handleViewDetails = async (id: number) => {
    setLoadingDeptDetails(true)
    try {
      const res = await axios.get(`/api/portal/departments/${id}`)
      setViewingDept(res.data)
    } catch (err) {
      console.error('Failed to load department details', err)
      alert('Could not retrieve department details')
    } finally {
      setLoadingDeptDetails(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (modalMode === 'create') {
        await axios.post('/api/portal/departments', {
          name,
          code,
          description,
          headId: headId ? parseInt(headId) : null,
        })
      } else {
        await axios.put(`/api/portal/departments/${selectedDept.id}`, {
          name,
          code,
          description,
          headId: headId ? parseInt(headId) : null,
        })
      }
      setShowModal(false)
      loadData()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (dept: any) => {
    if (!confirm(`Are you sure you want to delete department "${dept.name}"?`)) return

    try {
      await axios.delete(`/api/portal/departments/${dept.id}`)
      loadData()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to remove department')
    }
  }

  return (
    <PortalShell title="Departments & Org Hierarchy" breadcrumbs={[{ label: 'Departments' }]}>
      <Head>
        <title>Departments & Work Hierarchy — Success Tunnel ERP</title>
      </Head>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
            Organizational Structure & Work Hierarchy
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Configure functional units, assign department leadership, and inspect cross-team reporting lines.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* View Mode Switcher */}
          <div style={{
            display: 'inline-flex',
            background: '#f1f5f9',
            borderRadius: '6px',
            padding: '0.2rem',
            border: '1px solid #e2e8f0',
          }}>
            <button
              onClick={() => setViewMode('hierarchy')}
              style={{
                border: 'none',
                background: viewMode === 'hierarchy' ? '#ffffff' : 'transparent',
                color: viewMode === 'hierarchy' ? '#2563eb' : '#64748b',
                fontWeight: viewMode === 'hierarchy' ? 700 : 500,
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: viewMode === 'hierarchy' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <HiOutlineUserGroup />
              <span>Org Hierarchy Chart</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              style={{
                border: 'none',
                background: viewMode === 'cards' ? '#ffffff' : 'transparent',
                color: viewMode === 'cards' ? '#2563eb' : '#64748b',
                fontWeight: viewMode === 'cards' ? 700 : 500,
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: viewMode === 'cards' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <HiOutlineViewGrid />
              <span>Department Cards</span>
            </button>
          </div>

          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleOpenCreate}
            style={{ fontSize: '0.85rem' }}
          >
            <HiOutlinePlus style={{ fontSize: '1.1rem' }} />
            <span>New Department</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: WORK & ORG HIERARCHY CHART */}
      {viewMode === 'hierarchy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Top Executive Node: Abhishek Kumar */}
          <div className={styles.card} style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #334155',
            padding: '1.5rem',
            maxWidth: '820px',
            margin: '0 auto',
            width: '100%',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                }}>
                  AK
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#38bdf8', color: '#0f172a', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                      DEPARTMENT HEAD
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, background: 'rgba(255,255,255,0.15)', color: '#e2e8f0', padding: '0.1rem 0.45rem', borderRadius: '4px', fontFamily: 'monospace' }}>
                      ST-ENG-001
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, background: '#10b981', color: '#ffffff', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                      ACTIVE
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.25rem 0 0.1rem 0', color: '#ffffff' }}>
                    Abhishek Kumar
                  </h2>
                  <div style={{ fontSize: '0.875rem', color: '#93c5fd', fontWeight: 600 }}>
                    VP of Engineering & Head of Technology
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Primary Department
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.15rem' }}>
                  Engineering & Technology (ENG)
                </div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.15rem' }}>
                  Leading Engineering Operations & Core Technology Pods
                </div>
              </div>
            </div>
          </div>

          {/* Connector Down */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '-0.75rem 0' }}>
            <div style={{ width: '2px', height: '24px', background: '#94a3b8' }} />
            <div style={{
              background: '#2563eb',
              color: '#ffffff',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
            }}>
              <HiOutlineArrowNarrowDown />
            </div>
            <div style={{ width: '2px', height: '24px', background: '#94a3b8' }} />
          </div>

          {/* Department Leadership Nodes Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.25rem' }}>
            {departments.map((dept) => {
              const isEng = dept.code === 'ENG'
              return (
                <div
                  key={dept.id}
                  className={styles.card}
                  style={{
                    borderTop: isEng ? '4px solid #2563eb' : '4px solid #64748b',
                    background: isEng ? '#f8fafc' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: isEng ? '#dbeafe' : '#e2e8f0',
                        color: isEng ? '#1d4ed8' : '#334155',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                      }}>
                        {dept.code}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                        {dept._count?.members || 0} Members
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0.2rem 0 0.4rem 0' }}>
                      {dept.name}
                    </h3>

                    <div style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '0.6rem 0.75rem',
                      marginBottom: '0.75rem',
                    }}>
                      <div style={{ fontSize: '0.675rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                        Designated Department Head
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: isEng ? '#2563eb' : '#0f172a', marginTop: '0.15rem' }}>
                        {dept.head?.name || 'Unassigned'}
                      </div>
                      {dept.head?.email && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {dept.head.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {dept._count?.projects || 0} Active Initiatives
                    </span>
                    <button
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      onClick={() => handleViewDetails(dept.id)}
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                    >
                      <HiOutlineEye />
                      <span>Inspect Team</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      )}

      {/* VIEW MODE 2: DEPARTMENT CARDS GRID */}
      {viewMode === 'cards' && (
        <>
          {loading ? (
            <div className={styles.card} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              Loading organizational units...
            </div>
          ) : departments.length === 0 ? (
            <div className={styles.card} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              No departments configured. Click &ldquo;New Department&rdquo; to establish an organizational unit.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {departments.map((dept) => (
                <div key={dept.id} className={styles.card} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: '#e0e7ff',
                        color: '#3730a3',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                      }}>
                        {dept.code}
                      </span>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0.5rem 0 0.25rem 0' }}>
                        {dept.name}
                      </h3>
                    </div>
                    <div style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      padding: '0.35rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}>
                      <HiOutlineUserGroup />
                      <span>{dept._count?.members || 0} Members</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.825rem', color: '#64748b', flex: 1, margin: '0 0 1rem 0' }}>
                    {dept.description || 'No departmental description provided.'}
                  </p>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                        Department Head
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                        {dept.head?.name || 'Unassigned'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        className={styles.iconBtn}
                        onClick={() => handleViewDetails(dept.id)}
                        title="View Department Members"
                      >
                        <HiOutlineEye style={{ fontSize: '0.9rem', color: '#2563eb' }} />
                      </button>
                      <button
                        className={styles.iconBtn}
                        onClick={() => handleOpenEdit(dept)}
                        title="Edit Department"
                      >
                        <HiOutlinePencil style={{ fontSize: '0.9rem' }} />
                      </button>
                      <button
                        className={styles.iconBtn}
                        onClick={() => handleDelete(dept)}
                        title="Delete Department"
                        style={{ color: '#dc2626' }}
                      >
                        <HiOutlineTrash style={{ fontSize: '0.9rem' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Department Details Modal */}
      {viewingDept && (
        <div className={styles.modalOverlay} onClick={() => setViewingDept(null)}>
          <div
            className={styles.modalContent}
            style={{ maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2563eb', fontSize: '0.8rem' }}>
                  {viewingDept.code}
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.2rem 0', color: '#0f172a' }}>
                  {viewingDept.name}
                </h2>
              </div>
              <button
                className={styles.collapseBtn}
                onClick={() => setViewingDept(null)}
                style={{ color: '#64748b' }}
              >
                <HiOutlineX style={{ fontSize: '1.2rem' }} />
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
              {viewingDept.description || 'No description provided.'}
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#0f172a' }}>
                Department Head
              </h4>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                {viewingDept.head?.name ? (
                  <div>
                    <strong>{viewingDept.head.name}</strong> ({viewingDept.head.email})
                  </div>
                ) : (
                  <span style={{ color: '#94a3b8' }}>No department head currently designated.</span>
                )}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#0f172a' }}>
                Department Personnel ({viewingDept.members?.length || 0})
              </h4>
              {!viewingDept.members || viewingDept.members.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                  No employees currently assigned to this department.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {viewingDept.members.map((m: any) => (
                    <div
                      key={m.id}
                      style={{
                        padding: '0.65rem 0.85rem',
                        background: '#f8fafc',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {m.email} • {m.employeeProfile?.designation || m.role}
                        </div>
                      </div>
                      <span className={`${styles.badge} ${m.status === 'ACTIVE' ? styles.badgeSuccess : styles.badgeNeutral}`}>
                        {m.employeeProfile?.employeeCode || m.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Department Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div
            className={styles.modalContent}
            style={{ maxWidth: '480px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                {modalMode === 'create' ? 'Create New Department' : 'Edit Department'}
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
              <div style={{ padding: '0.75rem', background: '#fef2f2', color: '#991b1b', borderRadius: '6px', fontSize: '0.825rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className={styles.formLabel}>Department Name *</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  placeholder="e.g. Artificial Intelligence Research"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className={styles.formLabel}>Department Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  className={styles.formInput}
                  placeholder="e.g. AIR"
                  style={{ textTransform: 'uppercase' }}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
                <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>
                  Short 2-6 character identifier for employee badges and project codes.
                </span>
              </div>

              <div>
                <label className={styles.formLabel}>Department Head</label>
                <select
                  className={styles.formSelect}
                  value={headId}
                  onChange={(e) => setHeadId(e.target.value)}
                >
                  <option value="">-- No Department Head --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employeeProfile?.designation || emp.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.formTextarea}
                  rows={3}
                  placeholder="Outline departmental objectives and responsibilities..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
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
                  {submitting ? 'Saving...' : modalMode === 'create' ? 'Create Department' : 'Update Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalShell>
  )
}
