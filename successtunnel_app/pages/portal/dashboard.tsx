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
  HiOutlineCurrencyRupee,
  HiOutlineMail,
  HiOutlineFolder,
  HiOutlineExclamationCircle,
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
    projectsByStatus: {},
    pendingLeaves: 0,
    pendingExpenses: 0,
    pendingApprovals: 0,
    openEnquiries: 0,
    totalTasks: 0,
    tasksByStatus: {},
    finance: {
      totalInvoiced: 0,
      receivedPayments: 0,
      approvedExpenses: 0,
    },
  }

  const tasksByStatus = metrics.tasksByStatus || {}
  const projectsByStatus = metrics.projectsByStatus || {}
  const finance = metrics.finance || { totalInvoiced: 0, receivedPayments: 0, approvedExpenses: 0 }

  return (
    <PortalShell title="Executive Overview" breadcrumbs={[{ label: 'Dashboard' }]}>
      <Head>
        <title>ERP Dashboard — Success Tunnel</title>
      </Head>
{/* Source Meta Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.8rem', color: '#64748b' }}>
        <div>
          <strong>Data Source:</strong> {stats?.dataSource || 'Success Tunnel ERP Database'} • <strong>Reporting Period:</strong> {stats?.reportingPeriod || 'Current YTD'}
        </div>
        {stats?.generatedAt && (
          <div>Last synced: {new Date(stats.generatedAt).toLocaleTimeString()}</div>
        )}
      </div>

      {/* Top Quick Attendance Punch */}
      <div className={styles.card} style={{ marginBottom: '1.5rem', background: 'linear-gradient(to right, #ffffff, #f8fafc)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiOutlineClock style={{ color: '#2563eb', fontSize: '1.2rem' }} />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Workforce Time & Attendance
              </h2>
              <span style={{ fontSize: '0.7rem', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '0.1rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                Shift: 9:00 AM – 5:00 PM
              </span>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.825rem', color: '#64748b' }}>
              {stats?.myAttendanceToday?.checkIn
                ? `Logged in today at ${new Date(stats.myAttendanceToday.checkIn).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true })}`
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

      
      {/* Executive Work Hierarchy & Role Card */}
      <div className={styles.card} style={{
        marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        border: '1px solid #334155',
        borderRadius: '10px',
        padding: '1.25rem 1.5rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: '#ffffff',
            }}>
              NG
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#3b82f6', color: '#ffffff', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                  SWE TRAINEE
                </span>
                <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.15)', color: '#e2e8f0', padding: '0.1rem 0.45rem', borderRadius: '4px', fontFamily: 'monospace' }}>
                  ST-ENG-102
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, background: '#10b981', color: '#ffffff', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                  SUPER ADMIN
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.2rem 0 0.1rem 0', color: '#ffffff' }}>
                Nitesh Goel — Engineering & Technology (ENG)
              </h3>
              <p style={{ margin: 0, fontSize: '0.825rem', color: '#93c5fd' }}>
                Software Engineering Trainee (SWE Trainee) • Core Platform Pod • Mentored by Abhishek Kumar (VP & Head) • Reporting to Rohit Verma (Engineering Lead)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link
              href="/portal/engineering?tab=hierarchy"
              className={styles.btn}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.825rem',
                padding: '0.45rem 0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>View Engineering Work Hierarchy</span>
              <HiOutlineArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards Grid (6 cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
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

        {/* Pending Approvals */}
        <div className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Pending Approvals
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: metrics.pendingApprovals > 0 ? '#b45309' : '#0f172a', margin: '0.35rem 0' }}>
                {metrics.pendingApprovals}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {metrics.pendingLeaves} leaves • {metrics.pendingExpenses} expenses
              </div>
            </div>
            <div style={{ background: '#fffbeb', color: '#d97706', padding: '0.75rem', borderRadius: '8px', fontSize: '1.4rem' }}>
              <HiOutlineCalendar />
            </div>
          </div>
        </div>

        {/* Open CRM Enquiries */}
        <div className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Open Enquiries
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0' }}>
                {metrics.openEnquiries}
              </div>
              <Link href="/portal/crm" style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                CRM Pipeline <HiOutlineArrowRight />
              </Link>
            </div>
            <div style={{ background: '#ecfeff', color: '#0891b2', padding: '0.75rem', borderRadius: '8px', fontSize: '1.4rem' }}>
              <HiOutlineMail />
            </div>
          </div>
        </div>

        {/* Invoiced vs Received Revenue */}
        <div className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Received Revenue
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', margin: '0.35rem 0' }}>
                ₹{Number(finance.receivedPayments).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                ₹{Number(finance.totalInvoiced).toLocaleString('en-IN', { maximumFractionDigits: 0 })} billed (AR)
              </div>
            </div>
            <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.75rem', borderRadius: '8px', fontSize: '1.4rem' }}>
              <HiOutlineCurrencyRupee />
            </div>
          </div>
        </div>

        {/* Approved Expenses */}
        <div className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Approved Expenses
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e11d48', margin: '0.35rem 0' }}>
                ₹{Number(finance.approvedExpenses).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <Link href="/portal/finance" style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                Finance Ledger <HiOutlineArrowRight />
              </Link>
            </div>
            <div style={{ background: '#fff1f2', color: '#e11d48', padding: '0.75rem', borderRadius: '8px', fontSize: '1.4rem' }}>
              <HiOutlineCurrencyRupee />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Tasks Pipeline & Projects Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Task Velocity */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Tasks Status Distribution ({metrics.totalTasks} Total)</h2>
              <div className={styles.cardDescription}>Work items across development stages</div>
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
              { label: 'Blocked', key: 'BLOCKED', color: '#ef4444' },
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

        {/* Projects Breakdown */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Projects by Lifecycle Status</h2>
              <div className={styles.cardDescription}>Active deliverables and completion stages</div>
            </div>
            <Link href="/portal/projects" className={`${styles.btn} ${styles.btnSecondary}`} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
              All Projects
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Planned', key: 'PLANNED', count: projectsByStatus.PLANNED || 0, color: '#3b82f6', bg: '#eff6ff' },
              { label: 'In Progress', key: 'IN_PROGRESS', count: projectsByStatus.IN_PROGRESS || 0, color: '#f59e0b', bg: '#fffbeb' },
              { label: 'Completed', key: 'COMPLETED', count: projectsByStatus.COMPLETED || 0, color: '#10b981', bg: '#f0fdf4' },
              { label: 'On Hold', key: 'ON_HOLD', count: projectsByStatus.ON_HOLD || 0, color: '#64748b', bg: '#f1f5f9' },
            ].map((p) => (
              <div key={p.key} style={{ background: p.bg, border: `1px solid ${p.color}33`, padding: '0.75rem 1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{p.label}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: p.color, marginTop: '0.2rem' }}>{p.count}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>
            Active Projects In Flight
          </div>

          {loading ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>Loading projects...</div>
          ) : stats?.projects?.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>No active projects.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats?.projects?.map((prj: any) => (
                <div key={prj.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>
                      {prj.name}
                    </span>
                    <span className={`${styles.badge} ${prj.status === 'IN_PROGRESS' ? styles.badgeSuccess : styles.badgeInfo}`}>
                      {prj.progress}% done
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${prj.progress}%`, height: '100%', background: '#2563eb', borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Two Column Layout: Upcoming Deadlines & Recent Audit Trail */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Upcoming Deadlines */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Upcoming Task Deadlines</h2>
              <div className={styles.cardDescription}>Immediate deliverables requiring completion</div>
            </div>
            <Link href="/portal/tasks" className={`${styles.btn} ${styles.btnSecondary}`} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
              Task Board
            </Link>
          </div>

          {stats?.upcomingDeadlines?.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
              No upcoming task deadlines scheduled.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats?.upcomingDeadlines?.map((task: any) => {
                const dueDate = new Date(task.dueDate)
                const isOverdue = dueDate.getTime() < Date.now()
                return (
                  <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: '#f8fafc', borderRadius: '6px', borderLeft: isOverdue ? '3px solid #ef4444' : '3px solid #3b82f6' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>
                        {task.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {task.project?.name || 'Project'} • Assignee: {task.assignee?.name || 'Unassigned'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isOverdue ? '#ef4444' : '#2563eb' }}>
                        {dueDate.toISOString().split('T')[0]}
                      </div>
                      <span className={`${styles.badge} ${task.priority === 'CRITICAL' || task.priority === 'HIGH' ? styles.badgeDanger : styles.badgeInfo}`} style={{ fontSize: '0.65rem' }}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
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
