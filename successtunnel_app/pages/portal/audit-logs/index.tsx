import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import axios from 'axios'
import PortalShell from '../../../components/portal/PortalShell'
import styles from '../../../components/portal/Portal.module.css'
import {
  HiOutlineShieldCheck,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineRefresh,
} from 'react-icons/hi'

export default function AuditTrailModule() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [entityType, setEntityType] = useState('ALL')
  const [search, setSearch] = useState('')

  const loadLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '15')
      if (entityType && entityType !== 'ALL') params.set('entityType', entityType)
      if (search.trim()) params.set('search', search.trim())

      const res = await axios.get(`/api/portal/audit-logs?${params.toString()}`)
      setLogs(res.data.data)
      setTotalPages(res.data.pagination.totalPages)
      setTotalCount(res.data.pagination.total)
    } catch (err) {
      console.error('Failed to load audit logs', err)
    } finally {
      setLoading(false)
    }
  }, [page, entityType, search])

  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  return (
    <PortalShell title="Immutable Audit Trail" breadcrumbs={[{ label: 'Audit Trail' }]}>
      <Head>
        <title>Audit Logs — Success Tunnel ERP</title>
      </Head>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
            System Activity & Compliance Audit Trail
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            {totalCount} immutable event records tracking authentication, personnel updates, and status transitions.
          </p>
        </div>

        <button onClick={loadLogs} className={`${styles.btn} ${styles.btnSecondary}`}>
          <HiOutlineRefresh /> Refresh Logs
        </button>
      </div>

      {/* Filter Bar */}
      <div className={styles.card} style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <HiOutlineSearch style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by action, details or actor..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className={styles.input}
              style={{ paddingLeft: '2.2rem' }}
            />
          </div>

          <div style={{ flex: '0 1 200px' }}>
            <select
              value={entityType}
              onChange={(e) => {
                setEntityType(e.target.value)
                setPage(1)
              }}
              className={styles.select}
            >
              <option value="ALL">All Entity Modules</option>
              <option value="Auth">Authentication & Access</option>
              <option value="Employee">Employee Directory</option>
              <option value="Department">Departments & Org</option>
              <option value="Project">Projects</option>
              <option value="Task">Tasks</option>
              <option value="Attendance">Attendance Logs</option>
              <option value="Leave">Leave Requests</option>
              <option value="Expense">Expense Management</option>
              <option value="Document">HR Documents</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Module</th>
              <th>Actor</th>
              <th>Details & Metadata</th>
              <th>IP Origin</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  Loading audit logs...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  No audit logs found matching criteria.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td>
                    <span style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      background: '#f1f5f9',
                      color: '#0f172a',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeInfo}`}>
                      {log.entityType}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {log.user?.name || log.user?.email || 'System Operation'}
                    </div>
                    {log.user?.role && (
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                        {log.user.role.replace('_', ' ')}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#334155', maxWidth: '300px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.details}>
                      {log.details || '—'}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b' }}>
                    {log.ipAddress || '127.0.0.1'}
                  </td>
                </tr>
              ))
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
    </PortalShell>
  )
}
