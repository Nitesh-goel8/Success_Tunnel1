import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import axios from 'axios'
import PortalShell from '../../../components/portal/PortalShell'
import styles from '../../../components/portal/Portal.module.css'
import {
  HiOutlineCash,
  HiOutlinePlus,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineReceiptTax,
  HiOutlineRefresh,
} from 'react-icons/hi'

export default function FinanceModule() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Submit Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [category, setCategory] = useState('TRAVEL')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState('')
  const [receiptUrl, setReceiptUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Review Modal
  const [selectedExpense, setSelectedExpense] = useState<any>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [reviewing, setReviewing] = useState(false)

  const loadExpenses = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/portal/finance')
      setExpenses(res.data)
    } catch (err) {
      console.error('Failed to load expenses', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExpenses()
  }, [])

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await axios.get('/api/portal/projects')
        setProjects(res.data)
      } catch (err) {
        console.error('Failed to load projects', err)
      }
    }
    loadProjects()
  }, [])

  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await axios.post('/api/portal/finance', {
        category,
        amount,
        currency,
        description,
        projectId: projectId ? parseInt(projectId) : null,
        receiptUrl,
      })
      setShowSubmitModal(false)
      setDescription('')
      setAmount('')
      setReceiptUrl('')
      loadExpenses()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit expense claim')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReview = async (status: 'APPROVED' | 'REJECTED' | 'REIMBURSED') => {
    if (!selectedExpense) return
    setReviewing(true)

    try {
      await axios.put(`/api/portal/finance/${selectedExpense.id}`, {
        status,
        reviewNotes,
      })
      setSelectedExpense(null)
      setReviewNotes('')
      loadExpenses()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update expense claim')
    } finally {
      setReviewing(false)
    }
  }

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'APPROVED':
      case 'REIMBURSED':
        return styles.badgeSuccess
      case 'REJECTED':
        return styles.badgeDanger
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return styles.badgeWarning
      default:
        return styles.badgeNeutral
    }
  }

  const totalSubmitted = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalApproved = expenses
    .filter((e) => e.status === 'APPROVED' || e.status === 'REIMBURSED')
    .reduce((sum, e) => sum + e.amount, 0)

  return (
    <PortalShell title="Finance & Expenses" breadcrumbs={[{ label: 'Expenses' }]}>
      <Head>
        <title>Expenses & Finance — Success Tunnel ERP</title>
      </Head>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
            Expense Reimbursements & Financial Ledger
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            File corporate expenditure claims, attach receipts, and execute approval workflows.
          </p>
        </div>

        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setShowSubmitModal(true)}>
          <HiOutlinePlus style={{ fontSize: '1.1rem' }} />
          <span>File Expense Claim</span>
        </button>
      </div>

      {/* Finance KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className={styles.card} style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Total Claims Filed
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0' }}>
            INR {totalSubmitted.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{expenses.length} claims on record</div>
        </div>

        <div className={styles.card} style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Authorized & Reimbursed
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a', margin: '0.25rem 0' }}>
            INR {totalApproved.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Cleared by Finance Controller</div>
        </div>

        <div className={styles.card} style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Pending Authorization
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706', margin: '0.25rem 0' }}>
            INR {(totalSubmitted - totalApproved).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Awaiting review</div>
        </div>
      </div>

      {/* Expense Claims Table */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Expense Claims Register</h2>
            <div className={styles.cardDescription}>Audit trail of project and operational expenditures</div>
          </div>
          <button onClick={loadExpenses} className={`${styles.btn} ${styles.btnSecondary}`} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
            <HiOutlineRefresh /> Refresh
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Claimant</th>
                <th>Category</th>
                <th>Description</th>
                <th>Associated Project</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Submitted Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    Loading expenses...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    No expense claims recorded. Click &quot;File Expense Claim&quot; to begin.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{exp.user?.name || 'Staff'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{exp.user?.department?.name || ''}</div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                        {exp.category}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.825rem', color: '#334155', maxWidth: '240px' }}>
                      {exp.description}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#475569' }}>
                      {exp.project?.name || 'General Overhead'}
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>
                      {exp.currency} {exp.amount.toLocaleString()}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${getStatusBadge(exp.status)}`}>
                        {exp.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(exp.expenseDate || exp.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {exp.status === 'SUBMITTED' && (
                        <button
                          className={`${styles.btn} ${styles.btnSecondary}`}
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                          onClick={() => setSelectedExpense(exp)}
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

      {/* File Claim Modal */}
      {showSubmitModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                File Expense Reimbursement
              </h2>
              <button className={styles.collapseBtn} onClick={() => setShowSubmitModal(false)}>
                <HiOutlineX style={{ fontSize: '1.2rem' }} />
              </button>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitExpense}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={styles.select}
                  >
                    <option value="TRAVEL">Travel & Lodging</option>
                    <option value="SOFTWARE">Software & Cloud Subscriptions</option>
                    <option value="HARDWARE">Hardware & Peripherals</option>
                    <option value="OFFICE_SUPPLIES">Office Supplies & Stationery</option>
                    <option value="CLIENT_ENTERTAINMENT">Client Advisory Meetings</option>
                    <option value="TRAINING">Professional Certifications</option>
                    <option value="OTHER">Other Operational Expense</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Amount (INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={styles.input}
                    placeholder="e.g. 4500"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Associated Project (Optional)</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className={styles.select}
                >
                  <option value="">General Organizational Overhead</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description & Business Justification *</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.textarea}
                  placeholder="Detail the business context and requirement for this expenditure..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Receipt Attachment Reference URL</label>
                <input
                  type="text"
                  value={receiptUrl}
                  onChange={(e) => setReceiptUrl(e.target.value)}
                  className={styles.input}
                  placeholder="/receipts/2026/travel_invoice_01.pdf"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => setShowSubmitModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  {submitting ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedExpense && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Finance Authorization Review
              </h2>
              <button className={styles.collapseBtn} onClick={() => setSelectedExpense(null)}>
                <HiOutlineX style={{ fontSize: '1.2rem' }} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <div>Claimant: <strong style={{ color: '#0f172a' }}>{selectedExpense.user?.name}</strong></div>
              <div>Category: <strong>{selectedExpense.category}</strong></div>
              <div>Amount: <strong style={{ color: '#0f172a' }}>{selectedExpense.currency} {selectedExpense.amount}</strong></div>
              <div style={{ marginTop: '0.25rem' }}>Description: <em>&ldquo;{selectedExpense.description}&rdquo;</em></div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Audit & Review Notes</label>
              <textarea
                rows={2}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className={styles.textarea}
                placeholder="Optional notes or budget code reference..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                disabled={reviewing}
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={() => handleReview('REJECTED')}
              >
                Reject Claim
              </button>
              <button
                type="button"
                disabled={reviewing}
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => handleReview('APPROVED')}
              >
                Approve & Authorize
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  )
}
