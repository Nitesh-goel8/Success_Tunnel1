import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import axios from 'axios'
import PortalShell from '../../../components/portal/PortalShell'
import styles from '../../../components/portal/Portal.module.css'
import {
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
  HiOutlinePlus,
  HiOutlineX,
  HiOutlineClipboardList,
} from 'react-icons/hi'

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [headId, setHeadId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

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

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await axios.post('/api/portal/departments', {
        name,
        code,
        description,
        headId: headId ? parseInt(headId) : null,
      })
      setShowModal(false)
      setName('')
      setCode('')
      setDescription('')
      setHeadId('')
      loadData()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create department')
    } finally {
      setSubmitting(false)
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

        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setShowModal(true)}>
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
          No departments configured. Click &quot;New Department&quot; to establish an organizational unit.
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#2563eb' }}>
                  <HiOutlineClipboardList />
                  <span>{dept._count?.projects || 0} Projects</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Department Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Create New Department
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

            <form onSubmit={handleCreateDepartment}>
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
                  {submitting ? 'Creating Unit...' : 'Establish Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalShell>
  )
}
