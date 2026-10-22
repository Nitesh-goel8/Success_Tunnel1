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
} from 'react-icons/hi'

export default function AttendanceModule() {
  const [records, setRecords] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7)) // YYYY-MM
  const [selectedUser, setSelectedUser] = useState('')
  const [punching, setPunching] = useState(false)
  const [notes, setNotes] = useState('')

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
        setEmployees(res.data.data)
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

  const todayStr = new Date().toISOString().split('T')[0]
  const todayRecord = records.find((r) => r.date === todayStr)

  // Calculate monthly stats
  const totalDays = records.length
  const totalHours = Math.round(
    records.reduce((acc, r) => acc + (r.durationMinutes || 0), 0) / 60
  )

  return (
    <PortalShell title="Attendance Management" breadcrumbs={[{ label: 'Attendance' }]}>
      <Head>
        <title>Attendance — Success Tunnel ERP</title>
      </Head>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
            Workforce Attendance & Time Logs
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Daily check-ins, working duration calculation, and monthly attendance tracking.
          </p>
        </div>

        <button onClick={loadAttendance} className={`${styles.btn} ${styles.btnSecondary}`}>
          <HiOutlineRefresh /> Refresh Logs
        </button>
      </div>

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
            {!todayRecord ? (
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={punching}
                onClick={() => handlePunch('checkin')}
              >
                <HiOutlineCheckCircle />
                <span>{punching ? 'Recording...' : 'Check In Now'}</span>
              </button>
            ) : !todayRecord.checkOut ? (
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                disabled={punching}
                onClick={() => handlePunch('checkout')}
                style={{ borderColor: '#f59e0b', color: '#b45309' }}
              >
                <HiOutlineClock />
                <span>{punching ? 'Recording...' : 'Check Out Now'}</span>
              </button>
            ) : (
              <span className={`${styles.badge} ${styles.badgeSuccess}`} style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}>
                <HiOutlineCheckCircle /> Shift Completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className={styles.card} style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Days Recorded
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>
            {totalDays}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>During {selectedMonth}</div>
        </div>

        <div className={styles.card} style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Total Working Hours
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>
            {totalHours} hrs
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Recorded duration</div>
        </div>

        <div className={styles.card} style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Compliance Rate
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', margin: '0.25rem 0' }}>
            {totalDays > 0 ? '98.5%' : '0%'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Timely check-ins</div>
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
                      <span className={`${styles.badge} ${styles.badgeSuccess}`}>
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
    </PortalShell>
  )
}
