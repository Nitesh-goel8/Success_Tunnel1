import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import axios from 'axios'
import PortalShell from '../../../components/portal/PortalShell'
import styles from '../../../components/portal/Portal.module.css'
import {
  HiOutlineDocumentReport,
  HiOutlineDownload,
  HiOutlineRefresh,
  HiOutlineClock,
  HiOutlineSparkles,
} from 'react-icons/hi'

export default function ReportsModule() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadReports = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/portal/reports')
      setData(res.data)
    } catch (err) {
      console.error('Failed to load reports', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  const triggerExport = (moduleName: string) => {
    window.location.href = `/api/portal/reports?export=csv&module=${moduleName}`
  }

  return (
    <PortalShell title="Executive Reports & Analytics" breadcrumbs={[{ label: 'Reports & Analytics' }]}>
      <Head>
        <title>Reports & Analytics — Success Tunnel ERP</title>
      </Head>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
            Executive Reports & Operational Analytics
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Verified database-aggregated operational metrics and compliance summaries.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => triggerExport('employees')}
          >
            <HiOutlineDownload /> Export Staff CSV
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => triggerExport('tasks')}
          >
            <HiOutlineDownload /> Export Tasks CSV
          </button>
          <button
            onClick={loadReports}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            <HiOutlineRefresh /> Regenerate
          </button>
        </div>
      </div>

      {data?.generatedAt && (
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <HiOutlineClock />
          <span>Report compilation snapshot: {new Date(data.generatedAt).toLocaleString()}</span>
        </div>
      )}

      {loading ? (
        <div className={styles.card} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          Compiling operational analytics...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Department Headcount Breakdown */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>Departmental Staffing Distribution</h2>
                <div className={styles.cardDescription}>Headcount ratio across functional business verticals</div>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Department Code</th>
                    <th>Business Unit</th>
                    <th style={{ textAlign: 'right' }}>Active Members</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.departments?.map((d: any) => (
                    <tr key={d.code}>
                      <td><span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2563eb' }}>{d.code}</span></td>
                      <td style={{ fontWeight: 600 }}>{d.name}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>{d.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Two-Column Grid: Task Breakdown & Project Delivery */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {/* Task Status */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Task Pipeline Status</h2>
                  <div className={styles.cardDescription}>Distribution of work items across stages</div>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Status Stage</th>
                      <th style={{ textAlign: 'right' }}>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.taskDistribution?.map((t: any) => (
                      <tr key={t.status}>
                        <td>
                          <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                            {t.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>{t.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Leave Distributions */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Leave Request Workflow Status</h2>
                  <div className={styles.cardDescription}>Audit of employee applications</div>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Approval Status</th>
                      <th style={{ textAlign: 'right' }}>Requests</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.leaveDistribution?.map((l: any) => (
                      <tr key={l.status}>
                        <td>
                          <span className={`${styles.badge} ${l.status === 'APPROVED' ? styles.badgeSuccess : l.status === 'PENDING' ? styles.badgeWarning : styles.badgeDanger}`}>
                            {l.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>{l.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Project Progress Tracker */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>Project Roadmap & Execution Progress</h2>
                <div className={styles.cardDescription}>Task-derived delivery percentages</div>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Status</th>
                    <th>Allocated Budget</th>
                    <th style={{ textAlign: 'right' }}>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.projects?.map((p: any) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td>
                        <span className={`${styles.badge} ${p.status === 'IN_PROGRESS' ? styles.badgeSuccess : styles.badgeInfo}`}>
                          {p.status}
                        </span>
                      </td>
                      <td>INR {p.budget?.toLocaleString() || 0}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 700, color: '#2563eb' }}>{p.progress}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  )
}
