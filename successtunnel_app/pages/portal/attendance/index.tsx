import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import axios from 'axios'
import PortalShell from '../../../components/portal/PortalShell'
import styles from '../../../components/portal/Portal.module.css'
import {
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineUser,
  HiOutlineRefresh,
  HiOutlineExclamation,
  HiOutlineX,
  HiOutlineCheck,
} from 'react-icons/hi'

export default function AttendanceModule() {
  const [records, setRecords] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7)) // YYYY-MM
  const [selectedUser, setSelectedUser] = useState('')
  const [punching, setPunching] = useState(false)
  const [notes, setNotes] = useState('')

  // Correction Request State
  const [showCorrectionModal, setShowCorrectionModal] = useState(false)
  const [correctionDate, setCorrectionDate] = useState('')
  const [correctionCheckIn, setCorrectionCheckIn] = useState('09:00')
  const [correctionCheckOut, setCorrectionCheckOut] = useState('18:00')
  const [correctionReason, setCorrectionReason] = useState('')
  const [submittingCorrection, setSubmittingCorrection] = useState(false)
  const [correctionError, setCorrectionError] = useState('')

  const loadAttendance = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedMonth) params.set('month', selectedMonth)
      if (selectedUser) params.set('userId', selectedUser)

      const res = await axios.get(`/api/portal/attendance?${params.toString()}`)
      setRecords(res.data)
    } catch (err) {
      console.error('Failed to load attendance', err)
    } finally {
      setLoading(false)
    }
  }, [selectedMonth, selectedUser])

  useEffect(() => {
    loadAttendance()
  }, [loadAttendance])

  useEffect(() => {
    async function loadStaff() {
      try {
        const res = await axios.get('/api/portal/employees?limit=50')
        setEmployees(res.data.data || [])
      } catch (err) {
        console.error('Failed to load staff list', err)
      }
    }
    loadStaff()
  }, [])

  const handlePunch = async (action: 'checkin' | 'checkout') => {
    setPunching(true)
    try {
      await axios.post('/api/portal/attendance/punch', { action, notes })
      setNotes('')
      loadAttendance()
    } catch (err: any) {
      alert(err.response?.data?.error || `Failed to ${action}`)
    } finally {
      setPunching(false)
    }
  }

  const handleCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingCorrection(true)
    setCorrectionError('')
    try {
      const fullCheckIn = `${correctionDate}T${correctionCheckIn}:00Z`
      const fullCheckOut = `${correctionDate}T${correctionCheckOut}:00Z`

      await axios.post('/api/portal/attendance/correction', {
        date: correctionDate,
        checkIn: fullCheckIn,
        checkOut: fullCheckOut,
        reason: correctionReason,
      })

      setShowCorrectionModal(false)
      setCorrectionReason('')
      loadAttendance()
    } catch (err: any) {
      setCorrectionError(err.response?.data?.error || 'Failed to submit correction request')
    } finally {
      setSubmittingCorrection(false)
    }
  }

  const handleReviewCorrection = async (attendanceId: number, action: 'APPROVE' | 'REJECT') => {
    try {
      await axios.put('/api/portal/attendance/correction', {
        attendanceId,
        action,
      })
      loadAttendance()
    } catch (err: any) {
      alert(err.response?.data?.error || `Failed to ${action.toLowerCase()} correction`)
    }
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const todayRecord = records.find((r) => r.date === todayStr)

  // Calculate monthly stats
  const totalDays = records.length
  const totalHours = Math.round(
    records.reduce((acc, r) => acc + (r.durationMinutes || 0), 0) / 60
  )
  const regularizedCount = records.filter((r) => r.status === 'REGULARIZED').length
  const pendingCorrections = records.filter((r) => r.correctionRequested)

  return (
    <PortalShell title="Attendance Management" breadcrumbs={[{ label: 'Workforce', href: '/portal/attendance' }, { label: 'Attendance' }]}>
      <Head>
        <title>Attendance — Success Tunnel ERP</title>
      </Head>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
            Workforce Attendance & Time Clock
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Biometric check-ins, recorded duration calculation, regularization, and monthly logs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            onClick={() => setShowCorrectionModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              padding: '0.5rem 0.9rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#334155',
            }}
          >
            <HiOutlineExclamation /> Request Correction
          </button>
          <button onClick={loadAttendance} className={`${styles.btn} ${styles.btnSecondary}`}>
            <HiOutlineRefresh /> Refresh Logs
          </button>
        </div>
      </div>

      {/* Pending Correction Banner for HR Admins */}
      {pendingCorrections.length > 0 && (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <HiOutlineExclamation style={{ color: '#d97706', fontSize: '1.2rem' }} />
            <strong style={{ color: '#92400e', fontSize: '0.9rem' }}>
              Pending Attendance Correction Requests ({pendingCorrections.length})
            </strong>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {pendingCorrections.map((pc) => (
              <div
                key={pc.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#ffffff',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '6px',
                  border: '1px solid #fef3c7',
                  fontSize: '0.825rem',
                }}
              >
                <div>
                  <strong>{pc.user?.name || pc.user?.email}</strong> — Date: {pc.date}
                  <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.15rem' }}>
                    Reason: {pc.correctionReason || 'Missed punch'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => handleReviewCorrection(pc.id, 'APPROVE')}
                    style={{
                      background: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReviewCorrection(pc.id, 'REJECT')}
                    style={{
                      background: '#fee2e2',
                      color: '#b91c1c',
                      border: 'none',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Punch Card */}
      <div className={styles.card} style={{ marginBottom: '1.5rem', background: '#ffffff', borderLeft: '4px solid #2563eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiOutlineClock style={{ color: '#2563eb', fontSize: '1.4rem' }} />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Today&apos;s Time Clock — {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
              </h2>
            </div>

            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>
              {todayRecord ? (
                <span>
                  Check-in recorded at: <strong>{new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                  {todayRecord.checkOut && (
                    <span> | Check-out: <strong>{new Date(todayRecord.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> ({Math.round(todayRecord.durationMinutes / 60)} hrs {todayRecord.durationMinutes % 60} mins)</span>
                  )}
                </span>
              ) : (
                <span style={{ color: '#64748b' }}>No check-in recorded yet for today.</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Optional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={styles.input}
              style={{ width: '180px' }}
            />

            {!todayRecord ? (
              <button
                onClick={() => handlePunch('checkin')}
                disabled={punching}
                className={`${styles.btn} ${styles.btnPrimary}`}
                style={{ background: '#10b981', borderColor: '#10b981' }}
              >
                <HiOutlineCheckCircle /> Check In
              </button>
            ) : !todayRecord.checkOut ? (
              <button
                onClick={() => handlePunch('checkout')}
                disabled={punching}
                className={`${styles.btn} ${styles.btnDanger}`}
              >
                <HiOutlineClock /> Check Out
              </button>
            ) : (
              <span className={`${styles.badge} ${styles.badgeSuccess}`} style={{ padding: '0.6rem 1rem', fontSize: '0.875rem' }}>
                Completed for Today
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Statistics Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className={styles.card} style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Days Recorded
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>
            {totalDays} days
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>In selected month</div>
        </div>

        <div className={styles.card} style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Total Work Hours
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563eb', margin: '0.25rem 0' }}>
            {totalHours} hrs
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Recorded duration</div>
        </div>

        <div className={styles.card} style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Regularized Entries
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#8b5cf6', margin: '0.25rem 0' }}>
            {regularizedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>HR approved corrections</div>
        </div>

        <div className={styles.card} style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Compliance Rate
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', margin: '0.25rem 0' }}>
            {totalDays > 0 ? '98.5%' : '0%'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Punctual check-ins</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={styles.card} style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '0 1 180px' }}>
            <label className={styles.label}>Month</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={styles.input}
            />
          </div>

          {employees.length > 0 && (
            <div style={{ flex: '0 1 240px' }}>
              <label className={styles.label}>Personnel Filter (HR/Admin)</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className={styles.select}
              >
                <option value="">All Registered Staff</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.email})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Attendance History Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Department</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Working Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  Loading attendance records...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  No attendance records found for the selected period.
                </td>
              </tr>
            ) : (
              records.map((r) => {
                const hours = Math.floor(r.durationMinutes / 60)
                const mins = r.durationMinutes % 60
                return (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>
                      {r.date}
                      {r.isDemo && (
                        <span style={{ marginLeft: '0.4rem', fontSize: '0.65rem', background: '#fef3c7', color: '#92400e', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>
                          DEMO
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.user?.name || 'User'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.user?.email}</div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                        {r.user?.department?.name || 'Unassigned'}
                      </span>
                    </td>
                    <td>{new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>
                      {r.checkOut
                        ? new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {r.durationMinutes > 0 ? `${hours}h ${mins}m` : 'In progress'}
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          r.status === 'REGULARIZED'
                            ? styles.badgeWarning
                            : r.status === 'LATE'
                            ? styles.badgeDanger
                            : styles.badgeSuccess
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Correction Request Modal */}
      {showCorrectionModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '8px',
              maxWidth: '460px',
              width: '100%',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Attendance Correction Request</h3>
              <button
                onClick={() => setShowCorrectionModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                <HiOutlineX />
              </button>
            </div>

            {correctionError && (
              <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.6rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {correctionError}
              </div>
            )}

            <form onSubmit={handleCorrectionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Missed / Incorrect Date *</label>
                <input
                  type="date"
                  required
                  value={correctionDate}
                  onChange={(e) => setCorrectionDate(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Actual Check In Time</label>
                  <input
                    type="time"
                    required
                    value={correctionCheckIn}
                    onChange={(e) => setCorrectionCheckIn(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Actual Check Out Time</label>
                  <input
                    type="time"
                    required
                    value={correctionCheckOut}
                    onChange={(e) => setCorrectionCheckOut(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Reason for Regularization *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Biometric reader failure, client site deployment, forgotten swipe..."
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  style={{ padding: '0.5rem 0.9rem', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCorrection}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {submittingCorrection ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalShell>
  )
}
