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
} from 'react-icons/hi'

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
        <title>Departments — Success Tunnel ERP</title>
      </Head>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
            Departments & Organization Hierarchy
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Configure functional business units, department heads, and cross-team allocation.
          </p>
        </div>

        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleOpenCreate}>
          <HiOutlinePlus style={{ fontSize: '1.1rem' }} />
          <span>New Department</span>
        </button>
      </div>

      {/* Department Cards Grid */}
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
                        padding: '0.6rem 0.75rem',
                        background: '#f8fafc',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.85rem',
                      }}
                    >
                      <div>
                        <strong>{m.name || 'Unnamed'}</strong> ({m.email})
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {m.employeeProfile?.designation || m.role} • {m.employeeProfile?.employeeCode || `ST-EMP-${m.id}`}
                        </div>
                      </div>
                      <span className={`${styles.badge} ${m.status === 'active' ? styles.badgeSuccess : styles.badgeDanger}`}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setViewingDept(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New / Edit Department Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                {modalMode === 'create' ? 'Create New Department' : 'Edit Department Details'}
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

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Department Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                  placeholder="e.g. Legal & Enterprise Compliance"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Department Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className={styles.input}
                    placeholder="e.g. LEG"
                    maxLength={6}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Department Head (Optional)</label>
                  <select
                    value={headId}
                    onChange={(e) => setHeadId(e.target.value)}
                    className={styles.select}
                  >
                    <option value="">Select Department Head</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description & Core Scope</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.textarea}
                  placeholder="Provide scope, core functions, and departmental responsibilities..."
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
                  {submitting ? 'Saving Unit...' : modalMode === 'create' ? 'Establish Department' : 'Update Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalShell>
  )
}
