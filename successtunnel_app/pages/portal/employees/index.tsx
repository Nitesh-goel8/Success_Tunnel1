import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import axios from 'axios'
import PortalShell from '../../../components/portal/PortalShell'
import styles from '../../../components/portal/Portal.module.css'
import {
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlineFilter,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from 'react-icons/hi'

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    departmentId: '',
    phone: '',
    designation: '',
    workLocation: 'Headquarters - New Delhi',
    employmentType: 'Full-time',
    status: 'ACTIVE',
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '10')
      if (search.trim()) params.set('search', search.trim())
      if (selectedDept) params.set('departmentId', selectedDept)
      if (selectedStatus && selectedStatus !== 'ALL') params.set('status', selectedStatus)

      const res = await axios.get(`/api/portal/employees?${params.toString()}`)
      setEmployees(res.data.data)
      setTotalPages(res.data.pagination.totalPages)
      setTotalCount(res.data.pagination.total)
    } catch (err) {
      console.error('Failed to load employees', err)
    } finally {
      setLoading(false)
    }
  }, [page, search, selectedDept, selectedStatus])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  useEffect(() => {
    async function loadDepts() {
      try {
        const res = await axios.get('/api/portal/departments')
        setDepartments(res.data)
      } catch (err) {
        console.error('Failed to load departments', err)
      }
    }
    loadDepts()
  }, [])

  const handleOpenCreate = () => {
    setModalMode('create')
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'employee',
      departmentId: departments[0]?.id?.toString() || '',
      phone: '',
      designation: '',
      workLocation: 'Headquarters - New Delhi',
      employmentType: 'Full-time',
      status: 'ACTIVE',
    })
    setFormError('')
    setShowModal(true)
  }

  const handleOpenEdit = (emp: any) => {
    setModalMode('edit')
    setSelectedEmployee(emp)
    setFormData({
      name: emp.name || '',
      email: emp.email || '',
      password: '',
      role: emp.role || 'employee',
      departmentId: emp.department?.id?.toString() || '',
      phone: emp.phone || '',
      designation: emp.employeeProfile?.designation || '',
      workLocation: emp.employeeProfile?.workLocation || 'Headquarters - New Delhi',
      employmentType: emp.employeeProfile?.employmentType || 'Full-time',
      status: emp.employeeProfile?.status || 'ACTIVE',
    })
    setFormError('')
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)

    try {
      if (modalMode === 'create') {
        await axios.post('/api/portal/employees', formData)
      } else {
        await axios.put(`/api/portal/employees/${selectedEmployee.id}`, formData)
      }
      setShowModal(false)
      fetchEmployees()
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Operation failed. Please verify form values.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeactivate = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate this employee record?')) return
    try {
      await axios.delete(`/api/portal/employees/${id}`)
      fetchEmployees()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to deactivate employee')
    }
  }

  return (
    <PortalShell title="Employee Directory" breadcrumbs={[{ label: 'Employee Directory' }]}>
      <Head>
        <title>Employee Directory — Success Tunnel ERP</title>
      </Head>

      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
            Employee Directory
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            {totalCount} total registered personnel across organizational units
          </p>
        </div>

        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleOpenCreate}>
          <HiOutlinePlus style={{ fontSize: '1.1rem' }} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className={styles.card} style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <HiOutlineSearch style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by name, email, code or role..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className={styles.input}
              style={{ paddingLeft: '2.2rem' }}
            />
          </div>

          {/* Department Filter */}
          <div style={{ flex: '0 1 200px' }}>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value)
                setPage(1)
              }}
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

          {/* Status Filter */}
          <div style={{ flex: '0 1 160px' }}>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setPage(1)
              }}
              className={styles.select}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="PROBATION">Probation</option>
              <option value="ON_LEAVE">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employee Code</th>
              <th>Name & Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Role</th>
              <th>Status</th>
              <th>Location</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  Loading personnel records...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  No employee records matched the query.
                </td>
              </tr>
            ) : (
              employees.map((emp) => {
                const profile = emp.employeeProfile || {}
                const isInactive = profile.status === 'INACTIVE' || emp.status === 'inactive'
                return (
                  <tr key={emp.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2563eb' }}>
                        {profile.employeeCode || `ST-EMP-${emp.id}`}
                      </span>
                      {profile.isDemo && (
                        <span style={{ marginLeft: '0.4rem', fontSize: '0.65rem', background: '#fef3c7', color: '#92400e', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>
                          DEMO
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{emp.name || 'Unnamed'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{emp.email}</div>
                    </td>
                    <td>
                      {emp.department ? (
                        <span className={`${styles.badge} ${styles.badgeInfo}`}>
                          {emp.department.name}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>Unassigned</span>
                      )}
                    </td>
                    <td>{profile.designation || 'Staff'}</td>
                    <td>
                      <span style={{ fontSize: '0.75rem', textTransform: 'capitalize', color: '#475569' }}>
                        {emp.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          isInactive
                            ? styles.badgeDanger
                            : profile.status === 'ACTIVE'
                            ? styles.badgeSuccess
                            : styles.badgeWarning
                        }`}
                      >
                        {isInactive ? 'INACTIVE' : profile.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {profile.workLocation || 'Headquarters'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          className={styles.iconBtn}
                          onClick={() => handleOpenEdit(emp)}
                          title="Edit employee record"
                        >
                          <HiOutlinePencil style={{ fontSize: '0.9rem' }} />
                        </button>
                        {!isInactive && (
                          <button
                            className={styles.iconBtn}
                            onClick={() => handleDeactivate(emp.id)}
                            title="Deactivate employee"
                            style={{ color: '#dc2626' }}
                          >
                            <HiOutlineTrash style={{ fontSize: '0.9rem' }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Page {page} of {totalPages}
          </span>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                {modalMode === 'create' ? 'Add New Employee Record' : 'Edit Employee Details'}
              </h2>
              <button
                className={styles.collapseBtn}
                onClick={() => setShowModal(false)}
                style={{ color: '#64748b' }}
              >
                <HiOutlineX style={{ fontSize: '1.2rem' }} />
              </button>
            </div>

            {formError && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                marginBottom: '1rem',
              }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.input}
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Corporate Email *</label>
                  <input
                    type="email"
                    required
                    disabled={modalMode === 'edit'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={styles.input}
                    placeholder="name@successtunnel.in"
                  />
                </div>
              </div>

              {modalMode === 'create' && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Temporary Password (defaults to Demo@2026!)</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={styles.input}
                    placeholder="Leave empty for default demo password"
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Department *</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className={styles.select}
                    required
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
                  <label className={styles.label}>Job Title / Designation *</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className={styles.input}
                    placeholder="e.g. Tax Associate"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>System Access Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={styles.select}
                  >
                    <option value="employee">Employee (Standard Staff)</option>
                    <option value="project_manager">Project Manager</option>
                    <option value="hr_admin">HR Administrator</option>
                    <option value="finance_admin">Finance Administrator</option>
                    <option value="super_admin">Super Administrator</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Employment Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className={styles.select}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PROBATION">PROBATION</option>
                    <option value="ON_LEAVE">ON_LEAVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={styles.input}
                    placeholder="+91 98765 00000"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Work Location</label>
                  <input
                    type="text"
                    value={formData.workLocation}
                    onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                    className={styles.input}
                    placeholder="e.g. Headquarters - New Delhi"
                  />
                </div>
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
                  {submitting ? 'Saving Record...' : modalMode === 'create' ? 'Create Employee' : 'Update Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalShell>
  )
}
