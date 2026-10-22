import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import axios from 'axios'
import PortalShell from '../../../components/portal/PortalShell'
import styles from '../../../components/portal/Portal.module.css'
import {
  HiOutlineCalendar,
  HiOutlinePlus,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineClock,
  HiOutlineRefresh,
} from 'react-icons/hi'

export default function LeaveManagement() {
  const [policies, setPolicies] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Apply Modal
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [leaveType, setLeaveType] = useState('ANNUAL')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Review Modal
  const [reviewRequest, setReviewRequest] = useState<any>(null)
  const [reviewReason, setReviewReason] = useState('')
  const [reviewing, setReviewing] = useState(false)

  const loadLeaves = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/portal/leaves')
      setPolicies(res.data.policies)
      setRequests(res.data.requests)
    } catch (err) {
      console.error('Failed to load leaves', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeaves()
  }, [])

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await axios.post('/api/portal/leaves', {
        leaveType,
        startDate,
        endDate,
        reason,
      })
      setShowApplyModal(false)
      setReason('')
      setStartDate('')
      setEndDate('')
      loadLeaves()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit leave request')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReview = async (status: 'APPROVED' | 'REJECTED') => {
    if (!reviewRequest) return
    setReviewing(true)

    try {
      await axios.put(`/api/portal/leaves/${reviewRequest.id}`, {
        status,
        reviewReason,
      })
      setReviewRequest(null)
      setReviewReason('')
      loadLeaves()
    } catch (err: any) {
      alert(err.response?.data?.error || `Failed to ${status.toLowerCase()} leave request`)
    } finally {
      setReviewing(false)
    }
  }

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'APPROVED':
        return styles.badgeSuccess
      case 'REJECTED':
        return styles.badgeDanger
      case 'PENDING':
        return styles.badgeWarning
      default:
        return styles.badgeNeutral
    }
  }

  return (
    <PortalShell title="Leave Management" breadcrumbs={[{ label: 'Leaves & Holidays' }]}>
      <Head>
        <title>Leave Management — Success Tunnel ERP</title>
      </Head>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
            Leave Management & Entitlements
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Submit time-off requests, monitor verified entitlements, and execute administrative reviews.
          </p>
        </div>

        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setShowApplyModal(true)}>
          <HiOutlinePlus style={{ fontSize: '1.1rem' }} />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balances Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {policies.map((p) => (
          <div key={p.id} className={styles.card} style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                {p.title}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Quota: {p.totalDaysPerYear}d
              </span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
              {p.remainingDays} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>days left</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              {p.usedDays} days utilized this year
            </div>
          </div>
        ))}
      </div>

      {/* Leave Requests Table */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Leave Requests History & Approvals</h2>
            <div className={styles.cardDescription}>Track submitted applications and reviewer feedback</div>
          </div>
          <button onClick={loadLeaves} className={`${styles.btn} ${styles.btnSecondary}`} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
            <HiOutlineRefresh /> Refresh
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Total Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Reviewer Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    Loading leave requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    No leave requests on record.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{r.user?.name || 'User'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.user?.department?.name || ''}</div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                        {r.leaveType}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.825rem' }}>
                      {new Date(r.startDate).toLocaleDateString()} &rarr; {new Date(r.endDate).toLocaleDateString()}
                    </td>
                    <td style={{ fontWeight: 600 }}>{r.totalDays} day(s)</td>
                    <td style={{ fontSize: '0.825rem', color: '#475569', maxWidth: '240px' }}>
                      {r.reason}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${getStatusBadge(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {r.reviewReason || (r.reviewedBy ? `Reviewed by ${r.reviewedBy.name}` : '—')}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {r.status === 'PENDING' && (
                        <button
                          className={`${styles.btn} ${styles.btnSecondary}`}
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                          onClick={() => setReviewRequest(r)}
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Submit Leave Application
              </h2>
              <button className={styles.collapseBtn} onClick={() => setShowApplyModal(false)}>
                <HiOutlineX style={{ fontSize: '1.2rem' }} />
              </button>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleApply}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Leave Type *</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className={styles.select}
                >
                  <option value="ANNUAL">Annual Paid Leave</option>
                  <option value="SICK">Medical / Sick Leave</option>
                  <option value="CASUAL">Casual Leave</option>
                  <option value="UNPAID">Leave Without Pay (LWP)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Reason for Request *</label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={styles.textarea}
                  placeholder="State the purpose of time off and any coverage arrangements..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewRequest && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Review Leave Application
              </h2>
              <button className={styles.collapseBtn} onClick={() => setReviewRequest(null)}>
                <HiOutlineX style={{ fontSize: '1.2rem' }} />
              </button>
            </div>

            <div style={{ marginBottom: '1rem', background: '#f8fafc', padding: '0.85rem', borderRadius: '6px', fontSize: '0.85rem' }}>
              <div>Applicant: <strong style={{ color: '#0f172a' }}>{reviewRequest.user?.name}</strong></div>
              <div>Type: <strong>{reviewRequest.leaveType}</strong> ({reviewRequest.totalDays} days)</div>
              <div>Dates: {new Date(reviewRequest.startDate).toLocaleDateString()} &rarr; {new Date(reviewRequest.endDate).toLocaleDateString()}</div>
              <div style={{ marginTop: '0.35rem' }}>Reason: <em>&ldquo;{reviewRequest.reason}&rdquo;</em></div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Approval / Rejection Remarks</label>
              <textarea
                rows={2}
                value={reviewReason}
                onChange={(e) => setReviewReason(e.target.value)}
                className={styles.textarea}
                placeholder="Optional notes or condition for approval/rejection..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                disabled={reviewing}
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={() => handleReview('REJECTED')}
              >
                Reject Request
              </button>
              <button
                type="button"
                disabled={reviewing}
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => handleReview('APPROVED')}
              >
                Approve Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  )
}
