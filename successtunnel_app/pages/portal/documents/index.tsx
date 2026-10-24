import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import axios from 'axios'
import PortalShell from '../../../components/portal/PortalShell'
import styles from '../../../components/portal/Portal.module.css'
import {
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineLockClosed,
  HiOutlineX,
  HiOutlineSparkles,
} from 'react-icons/hi'

export default function DocumentRepository() {
  const [documents, setDocuments] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [search, setSearch] = useState('')

  // Upload Modal
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('POLICY')
  const [fileUrl, setFileUrl] = useState('/docs/demo/corporate_policy_document.pdf')
  const [fileSize, setFileSize] = useState('1.5 MB')
  const [fileType, setFileType] = useState('application/pdf')
  const [version, setVersion] = useState('v1.0')
  const [isConfidential, setIsConfidential] = useState(false)
  const [targetUserId, setTargetUserId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadDocuments = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory && selectedCategory !== 'ALL') params.set('category', selectedCategory)
      if (search.trim()) params.set('search', search.trim())

      const res = await axios.get(`/api/portal/documents?${params.toString()}`)
      setDocuments(res.data)
    } catch (err) {
      console.error('Failed to load documents', err)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, search])

  useEffect(() => {
    loadDocuments()
    async function loadStaff() {
      try {
        const res = await axios.get('/api/portal/employees?limit=50')
        setEmployees(res.data.data || [])
      } catch (err) {
        console.error('Failed to load employees for documents', err)
      }
    }
    loadStaff()
  }, [loadDocuments])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await axios.post('/api/portal/documents', {
        title,
        category,
        fileUrl,
        fileSize,
        fileType,
        version,
        isConfidential,
        userId: targetUserId ? parseInt(targetUserId, 10) : null,
      })
      setShowUploadModal(false)
      setTitle('')
      setTargetUserId('')
      loadDocuments()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload document record')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownload = (doc: any) => {
    alert(`Secure document verification passed for "${doc.title}". In production this opens the presigned storage link (${doc.fileUrl}).`)
  }

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'POLICY':
        return styles.badgeInfo
      case 'AGREEMENT':
        return styles.badgeSuccess
      case 'ONBOARDING':
        return styles.badgeWarning
      default:
        return styles.badgeNeutral
    }
  }

  return (
    <PortalShell title="HR Document Center" breadcrumbs={[{ label: 'Documents & Compliance' }]}>
      <Head>
        <title>HR Documents — Success Tunnel ERP</title>
      </Head>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
            HR Documents & Compliance Repository
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Centralized repository for corporate policies, offer letters, NDAs, and onboarding assets.
          </p>
        </div>

        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setShowUploadModal(true)}>
          <HiOutlinePlus style={{ fontSize: '1.1rem' }} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className={styles.card} style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <HiOutlineSearch style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search documents by title or file format..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.input}
              style={{ paddingLeft: '2.2rem' }}
            />
          </div>

          <div style={{ flex: '0 1 220px' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.select}
            >
              <option value="ALL">All Categories</option>
              <option value="POLICY">Policies & Standard Operating Procedures</option>
              <option value="AGREEMENT">Agreements & NDAs</option>
              <option value="ONBOARDING">Onboarding & Induction Checklists</option>
              <option value="OFFER_LETTER">Offer Letters & Contracts</option>
              <option value="TRAINING">Training Manuals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document Records Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Document Title</th>
              <th>Category</th>
              <th>Version</th>
              <th>File Size</th>
              <th>Confidentiality</th>
              <th>Uploaded By</th>
              <th>Published Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  Loading document repository...
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  No documents found matching the filter.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <HiOutlineDocumentText style={{ color: '#2563eb', fontSize: '1.2rem', flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{doc.title}</span>
                      {doc.isDemo && (
                        <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#92400e', padding: '0.1rem 0.35rem', borderRadius: '3px', fontWeight: 700 }}>
                          DEMO
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${getCategoryBadge(doc.category)}`}>
                      {doc.category}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.8rem' }}>
                    {doc.version}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {doc.fileSize || '1.0 MB'}
                  </td>
                  <td>
                    {doc.isConfidential ? (
                      <span className={`${styles.badge} ${styles.badgeWarning}`}>
                        <HiOutlineLockClosed /> Confidential
                      </span>
                    ) : (
                      <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                        Public / Internal
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>
                    {doc.uploader?.name || 'HR Admin'}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                      onClick={() => handleDownload(doc)}
                    >
                      <HiOutlineDownload /> Access
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Register Organizational Document
              </h2>
              <button className={styles.collapseBtn} onClick={() => setShowUploadModal(false)}>
                <HiOutlineX style={{ fontSize: '1.2rem' }} />
              </button>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleUpload}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Document Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.input}
                  placeholder="e.g. Employee Travel and Expense Policy 2026"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Document Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={styles.select}
                  >
                    <option value="POLICY">Policy & Standard Procedures</option>
                    <option value="AGREEMENT">Non-Disclosure & Agreements</option>
                    <option value="ONBOARDING">Onboarding Checklist</option>
                    <option value="OFFER_LETTER">Offer Letter</option>
                    <option value="TRAINING">Training Material</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Version Identifier</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className={styles.input}
                    placeholder="v1.0"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Storage Reference / Storage Path *</label>
                <input
                  type="text"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className={styles.input}
                  placeholder="/docs/policies/policy_2026.pdf"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Simulated File Size</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    className={styles.input}
                    placeholder="1.2 MB"
                  />
                </div>

                <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={isConfidential}
                      onChange={(e) => setIsConfidential(e.target.checked)}
                    />
                    <span>Mark as Confidential</span>
                  </label>
                </div>
              </div>

              {isConfidential && employees.length > 0 && (
                <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
                  <label className={styles.label}>Associated Employee (Access restricted to this employee & HR)</label>
                  <select
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                    className={styles.select}
                  >
                    <option value="">Company-Wide Confidential Policy</option>
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  {submitting ? 'Registering...' : 'Publish Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalShell>
  )
}
