import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import axios from 'axios'
import PortalShell from '../../../components/portal/PortalShell'
import styles from '../../../components/portal/Portal.module.css'
import {
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineEye,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineClipboardList,
} from 'react-icons/hi'

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [potentialManagers, setPotentialManagers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  // Detailed Profile View State
  const [viewingEmployee, setViewingEmployee] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [profileTab, setProfileTab] = useState<'overview' | 'tasks' | 'attendance' | 'documents'>('overview')

  // Create / Edit Modal State
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
    managerId: '',
    emergencyContact: '',
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
    async function loadMeta() {
      try {
        const [deptRes, mgrRes] = await Promise.all([
          axios.get('/api/portal/departments'),
          axios.get('/api/portal/employees?limit=50'),
        ])
        setDepartments(deptRes.data)
        setPotentialManagers(mgrRes.data.data || [])
      } catch (err) {
        console.error('Failed to load metadata', err)
      }
    }
    loadMeta()
  }, [])

  const handleOpenProfile = async (id: number) => {
    setLoadingProfile(true)
    setProfileTab('overview')
    try {
      const res = await axios.get(`/api/portal/employees/${id}`)
      setViewingEmployee(res.data)
    } catch (err) {
      console.error('Failed to load profile details', err)
      alert('Could not load detailed employee profile')
    } finally {
      setLoadingProfile(false)
    }
  }

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
      managerId: '',
      emergencyContact: '',
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
      managerId: emp.employeeProfile?.manager?.id?.toString() || '',
      emergencyContact: emp.employeeProfile?.emergencyContact || '',
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
              <option value="PROBATION">Probation</option>
              <option value="NOTICE">Notice Period</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="INACTIVE">Inactive</option>
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
              <th>Reporting To</th>
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
                      <button
                        onClick={() => handleOpenProfile(emp.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: '#2563eb',
                          padding: 0,
                          textDecoration: 'underline',
                        }}
                        title="Click to view full employee profile"
                      >
                        {profile.employeeCode || `ST-EMP-${emp.id}`}
                      </button>
                    </td>
                    <td>
                      <div
                        style={{ fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}
                        onClick={() => handleOpenProfile(emp.id)}
                      >
                        {emp.name || 'Unnamed'}
                      </div>
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
                    <td style={{ fontSize: '0.8rem', color: '#475569' }}>
                      {profile.manager?.user?.name ? (
                        <span>{profile.manager.user.name}</span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>None</span>
                      )}
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
                          onClick={() => handleOpenProfile(emp.id)}
                          title="View Full Profile"
                        >
                          <HiOutlineEye style={{ fontSize: '0.9rem', color: '#2563eb' }} />
                        </button>
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

      {/* Detailed Employee Profile Drawer / Modal */}
      {viewingEmployee && (
        <div className={styles.modalOverlay} onClick={() => setViewingEmployee(null)}>
          <div
            className={styles.modalContent}
            style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className={styles.avatar} style={{ width: 42, height: 42 }}>
                  {viewingEmployee.name ? viewingEmployee.name.charAt(0).toUpperCase() : 'E'}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    {viewingEmployee.name}
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {viewingEmployee.employeeProfile?.employeeCode || `ST-EMP-${viewingEmployee.id}`} • {viewingEmployee.department?.name || 'General'}
                  </div>
                </div>
              </div>

              <button
                className={styles.collapseBtn}
                onClick={() => setViewingEmployee(null)}
                style={{ color: '#64748b' }}
              >
                <HiOutlineX style={{ fontSize: '1.2rem' }} />
              </button>
            </div>

            {/* Profile Navigation Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '1rem', marginBottom: '1.25rem' }}>
              <button
                className={styles.tabBtn}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: 'none',
                  background: 'transparent',
                  fontWeight: profileTab === 'overview' ? 700 : 500,
                  color: profileTab === 'overview' ? '#2563eb' : '#64748b',
                  borderBottom: profileTab === 'overview' ? '2px solid #2563eb' : '2px solid transparent',
                  cursor: 'pointer',
                }}
                onClick={() => setProfileTab('overview')}
              >
                Profile Overview
              </button>
              <button
                className={styles.tabBtn}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: 'none',
                  background: 'transparent',
                  fontWeight: profileTab === 'tasks' ? 700 : 500,
                  color: profileTab === 'tasks' ? '#2563eb' : '#64748b',
                  borderBottom: profileTab === 'tasks' ? '2px solid #2563eb' : '2px solid transparent',
                  cursor: 'pointer',
                }}
                onClick={() => setProfileTab('tasks')}
              >
                Assigned Work ({viewingEmployee.assignedTasks?.length || 0})
              </button>
              <button
                className={styles.tabBtn}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: 'none',
                  background: 'transparent',
                  fontWeight: profileTab === 'attendance' ? 700 : 500,
                  color: profileTab === 'attendance' ? '#2563eb' : '#64748b',
                  borderBottom: profileTab === 'attendance' ? '2px solid #2563eb' : '2px solid transparent',
                  cursor: 'pointer',
                }}
                onClick={() => setProfileTab('attendance')}
              >
                Recent Attendance & Leaves
              </button>
              <button
                className={styles.tabBtn}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: 'none',
                  background: 'transparent',
                  fontWeight: profileTab === 'documents' ? 700 : 500,
                  color: profileTab === 'documents' ? '#2563eb' : '#64748b',
                  borderBottom: profileTab === 'documents' ? '2px solid #2563eb' : '2px solid transparent',
                  cursor: 'pointer',
                }}
                onClick={() => setProfileTab('documents')}
              >
                Documents ({(viewingEmployee.assignedDocs?.length || 0) + (viewingEmployee.uploadedDocs?.length || 0)})
              </button>
            </div>

            {/* TAB 1: Profile Overview */}
            {profileTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.85rem' }}>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Employment & Role
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}><strong>Designation:</strong> {viewingEmployee.employeeProfile?.designation || 'Staff'}</div>
                  <div style={{ marginBottom: '0.5rem' }}><strong>Department:</strong> {viewingEmployee.department?.name || 'Unassigned'}</div>
                  <div style={{ marginBottom: '0.5rem' }}><strong>Employment Type:</strong> {viewingEmployee.employeeProfile?.employmentType || 'Full-time'}</div>
                  <div style={{ marginBottom: '0.5rem' }}><strong>Work Location:</strong> {viewingEmployee.employeeProfile?.workLocation || 'Headquarters'}</div>
                  <div><strong>Joining Date:</strong> {new Date(viewingEmployee.employeeProfile?.joiningDate || viewingEmployee.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Contact & Hierarchy
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}><strong>Corporate Email:</strong> {viewingEmployee.email}</div>
                  <div style={{ marginBottom: '0.5rem' }}><strong>Phone Number:</strong> {viewingEmployee.phone || 'Not recorded'}</div>
                  <div style={{ marginBottom: '0.5rem' }}><strong>Emergency Contact:</strong> {viewingEmployee.employeeProfile?.emergencyContact || 'Not recorded'}</div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Reporting Manager:</strong>{' '}
                    {viewingEmployee.employeeProfile?.manager?.user?.name ? (
                      <span>{viewingEmployee.employeeProfile.manager.user.name} ({viewingEmployee.employeeProfile.manager.designation})</span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>None</span>
                    )}
                  </div>
                  <div>
                    <strong>Direct Reports:</strong> {viewingEmployee.employeeProfile?.directReports?.length || 0} staff members
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Assigned Tasks */}
            {profileTab === 'tasks' && (
              <div>
                {!viewingEmployee.assignedTasks || viewingEmployee.assignedTasks.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No tasks currently assigned to this employee.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {viewingEmployee.assignedTasks.map((task: any) => (
                      <div key={task.id} style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#2563eb', fontWeight: 700 }}>
                            {task.taskCode}
                          </span>
                          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{task.title}</div>
                        </div>
                        <span className={`${styles.badge} ${task.status === 'DONE' ? styles.badgeSuccess : styles.badgeInfo}`}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Attendance & Leaves */}
            {profileTab === 'attendance' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Recent Timesheet Logs</h4>
                  {!viewingEmployee.attendance || viewingEmployee.attendance.length === 0 ? (
                    <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>No recent clock-in entries.</div>
                  ) : (
                    viewingEmployee.attendance.map((att: any) => (
                      <div key={att.id} style={{ padding: '0.5rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{att.date}</span>
                        <span style={{ fontWeight: 600 }}>{Math.round(att.durationMinutes / 60)} hrs ({att.status})</span>
                      </div>
                    ))
                  )}
                </div>

                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Recent Leave Applications</h4>
                  {!viewingEmployee.leaveRequests || viewingEmployee.leaveRequests.length === 0 ? (
                    <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>No recent leave requests.</div>
                  ) : (
                    viewingEmployee.leaveRequests.map((leave: any) => (
                      <div key={leave.id} style={{ padding: '0.5rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{leave.leaveType} ({leave.totalDays}d)</span>
                        <span className={`${styles.badge} ${leave.status === 'APPROVED' ? styles.badgeSuccess : styles.badgeWarning}`}>
                          {leave.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: Documents */}
            {profileTab === 'documents' && (
              <div>
                {(!viewingEmployee.assignedDocs || viewingEmployee.assignedDocs.length === 0) &&
                (!viewingEmployee.uploadedDocs || viewingEmployee.uploadedDocs.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No linked documents or records found for this employee.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[...(viewingEmployee.assignedDocs || []), ...(viewingEmployee.uploadedDocs || [])].map((doc: any, i: number) => (
                      <div key={i} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <HiOutlineDocumentText style={{ fontSize: '1.2rem', color: '#2563eb' }} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>{doc.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{doc.category} • {doc.version || 'v1.0'}</div>
                          </div>
                        </div>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`${styles.btn} ${styles.btnSecondary}`}
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          View Document
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setViewingEmployee(null)}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '620px' }}>
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
                  <label className={styles.label}>Temporary Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={styles.input}
                    placeholder="Leave empty to generate standard temporary password"
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
                    <option value="NOTICE">NOTICE PERIOD</option>
                    <option value="ON_LEAVE">ON_LEAVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Reporting Manager (Hierarchy)</label>
                  <select
                    value={formData.managerId}
                    onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                    className={styles.select}
                  >
                    <option value="">No Direct Manager (Top-level / Self)</option>
                    {potentialManagers
                      .filter((m) => modalMode !== 'edit' || m.id !== selectedEmployee?.id)
                      .map((mgr) => (
                        <option key={mgr.id} value={mgr.employeeProfile?.id || mgr.id}>
                          {mgr.name} — {mgr.employeeProfile?.designation || mgr.role} ({mgr.department?.code || 'GEN'})
                        </option>
                      ))}
                  </select>
                </div>

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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
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

                <div className={styles.formGroup}>
                  <label className={styles.label}>Emergency Contact</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className={styles.input}
                    placeholder="e.g. Parent/Spouse: +91 98111 22233"
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
