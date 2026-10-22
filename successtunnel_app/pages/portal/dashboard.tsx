import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios'
import PortalShell from '../../components/portal/PortalShell'
import styles from '../../components/portal/Portal.module.css'
import {
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlineRefresh,
} from 'react-icons/hi'

export default function PortalDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkInLoading, setCheckInLoading] = useState(false)

  const loadStats = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/portal/dashboard/stats')
      setStats(res.data)
    } catch (err) {
      console.error('Failed to load portal stats', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const handleQuickAttendance = async (action: 'checkin' | 'checkout') => {
    setCheckInLoading(true)
    try {
      await axios.post('/api/portal/attendance/punch', { action })
      loadStats()
    } catch (err: any) {
      alert(err.response?.data?.error || `Failed to ${action}`)
    } finally {
      setCheckInLoading(false)
    }
  }

  const metrics = stats?.metrics || {
    activeEmployees: 0,
    activeProjects: 0,
    pendingLeaves: 0,
    totalTasks: 0,
    tasksByStatus: {},
  }

  const tasksByStatus = metrics.tasksByStatus || {}

  return (
    <PortalShell title="Executive Overview" breadcrumbs={[{ label: 'Dashboard' }]}>
      <Head>
        <title>ERP Dashboard — Success Tunnel</title>
      </Head>

      {/* Demo Warning Banner */}
      {stats?.hasDemoData && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fef3c7',
          borderLeft: '4px solid #f59e0b',
          padding: '0.875rem 1.25rem',
          borderRadius: '6px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <HiOutlineSparkles style={{ color: '#d97706', fontSize: '1.25rem' }} />
            <div>
              <span style={{ fontWeight: 700, color: '#92400e', fontSize: '0.85rem' }}>
                DEMO ENVIRONMENT ACTIVE
              </span>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: '#b45309' }}>
                This portal is currently seeded with realistic but fictional demo employees, attendance, and project records for development and testing.
              </p>
            </div>
          </div>
          <button
            onClick={loadStats}
            className={`${styles.btn} ${styles.btnSecondary}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
          >
            <HiOutlineRefresh /> Refresh Metrics
          </button>
        </div>
      )}

      {/* Top Quick Attendance Punch */}
      <div className={styles.card} style={{ marginBottom: '1.5rem', background: 'linear-gradient(to right, #ffffff, #f8fafc)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiOutlineClock style={{ color: '#2563eb', fontSize: '1.2rem' }} />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Daily Workforce Attendance
              </h2>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.825rem', color: '#64748b' }}>
              {stats?.myAttendanceToday?.checkIn
                ? `Logged in today at ${new Date(stats.myAttendanceToday.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'No check-in recorded for your profile today.'}
            </p>
          </div>

          <div>
            {!stats?.myAttendanceToday ? (
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={checkInLoading}
                onClick={() => handleQuickAttendance('checkin')}
              >
                <HiOutlineCheckCircle />
                <span>{checkInLoading ? 'Recording...' : 'Punch In (Check-in)'}</span>
              </button>
            ) : !stats.myAttendanceToday.checkOut ? (
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                disabled={checkInLoading}
                onClick={() => handleQuickAttendance('checkout')}
                style={{ borderColor: '#f59e0b', color: '#b45309' }}
              >
                <HiOutlineClock />
                <span>{checkInLoading ? 'Recording...' : 'Punch Out (Check-out)'}</span>
              </button>
            ) : (
              <span className={`${styles.badge} ${styles.badgeSuccess}`} style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}>
                <HiOutlineCheckCircle /> Shift Completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Active Staff */}
        <div className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Active Personnel
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0' }}>
                {metrics.activeEmployees}
              </div>
              <Link href="/portal/employees" style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                View Directory <HiOutlineArrowRight />
              </Link>
            </div>
            <div style={{ background: '#eff6ff', color: '#2563eb', padding: '0.75rem', borderRadius: '8px', fontSize: '1.4rem' }}>
              <HiOutlineUsers />
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Active Projects
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0' }}>
                {metrics.activeProjects}
              </div>
              <Link href="/portal/projects" style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                View Roadmap <HiOutlineArrowRight />
              </Link>
            </div>
            <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.75rem', borderRadius: '8px', fontSize: '1.4rem' }}>
              <HiOutlineClipboardList />
            </div>
          </div>
        </div>

        {/* Pending Leaves */}
        <div className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Pending Leaves
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0' }}>
                {metrics.pendingLeaves}
              </div>
              <Link href="/portal/leaves" style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                Review Requests <HiOutlineArrowRight />
              </Link>
            </div>
            <div style={{ background: '#fffbeb', color: '#d97706', padding: '0.75rem', borderRadius: '8px', fontSize: '1.4rem' }}>
              <HiOutlineCalendar />
            </div>
          </div>
        </div>

        {/* Total Tasks */}
        <div className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Total Tasks
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0' }}>
                {metrics.totalTasks}
              </div>
              <Link href="/portal/tasks" style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                Open Kanban Board <HiOutlineArrowRight />
              </Link>
            </div>
            <div style={{ background: '#faf5ff', color: '#9333ea', padding: '0.75rem', borderRadius: '8px', fontSize: '1.4rem' }}>
              <HiOutlineClipboardList />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Tasks by Status & Active Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Task Velocity */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Tasks Status Distribution</h2>
              <div className={styles.cardDescription}>Work items across pipeline stages</div>
            </div>
            <Link href="/portal/tasks" className={`${styles.btn} ${styles.btnSecondary}`} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
              Kanban Board
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { label: 'Backlog', key: 'BACKLOG', color: '#64748b' },
              { label: 'To Do', key: 'TODO', color: '#3b82f6' },
              { label: 'In Progress', key: 'IN_PROGRESS', color: '#f59e0b' },
              { label: 'In Review', key: 'IN_REVIEW', color: '#8b5cf6' },
              { label: 'Done', key: 'DONE', color: '#10b981' },
            ].map((st) => {
              const count = tasksByStatus[st.key] || 0
              const percentage = metrics.totalTasks > 0 ? Math.round((count / metrics.totalTasks) * 100) : 0
              return (
                <div key={st.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{st.label}</span>
                    <span style={{ color: '#64748b' }}>{count} ({percentage}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: st.color, borderRadius: '4px', transition: 'width 0.3s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Active Projects */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Active Enterprise Projects</h2>
              <div className={styles.cardDescription}>Real-time milestone progress</div>
            </div>
            <Link href="/portal/projects" className={`${styles.btn} ${styles.btnSecondary}`} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
              All Projects
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading projects...</div>
          ) : stats?.projects?.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No active projects.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats?.projects?.map((prj: any) => (
                <div key={prj.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
                      {prj.name}
                    </span>
                    <span className={`${styles.badge} ${prj.status === 'IN_PROGRESS' ? styles.badgeSuccess : styles.badgeInfo}`}>
                      {prj.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.3rem' }}>
                    <span>Lead: {prj.manager?.name || 'Unassigned'}</span>
                    <span>{prj.progress}% Completed</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${prj.progress}%`, height: '100%', background: '#2563eb', borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Two Column Layout: Department Distribution & Recent Audit Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Department Distribution */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Department Distribution</h2>
              <div className={styles.cardDescription}>Headcount per functional business unit</div>
            </div>
            <Link href="/portal/departments" className={`${styles.btn} ${styles.btnSecondary}`} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
              Org Chart
            </Link>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Department Name</th>
                  <th style={{ textAlign: 'right' }}>Headcount</th>
                </tr>
              </thead>
              <tbody>
                {stats?.departmentDistribution?.map((dept: any) => (
                  <tr key={dept.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2563eb' }}>
                        {dept.code}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{dept.name}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                      {dept.memberCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Trail */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Administrative Activity Audit</h2>
              <div className={styles.cardDescription}>Verified immutable change records</div>
            </div>
            <Link href="/portal/audit-logs" className={`${styles.btn} ${styles.btnSecondary}`} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
              Full Audit Trail
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats?.recentAuditLogs?.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No recorded audit events.</div>
            ) : (
              stats?.recentAuditLogs?.map((log: any) => (
                <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ background: '#eff6ff', color: '#2563eb', padding: '0.4rem', borderRadius: '6px', fontSize: '1rem', flexShrink: 0 }}>
                    <HiOutlineShieldCheck />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.825rem', color: '#0f172a' }}>
                        {log.action}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {log.user?.name || log.user?.email || 'System'} • {log.entityType} #{log.entityId || ''}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  )
}
