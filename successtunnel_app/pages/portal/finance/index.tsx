import React, { useState, useEffect, useCallback } from 'react'
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
  HiOutlineDocumentText,
  HiOutlineCreditCard,
  HiOutlineDownload,
  HiOutlineFilter,
  HiOutlineSearch,
  HiOutlineOfficeBuilding,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from 'react-icons/hi'

export default function FinanceModule() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'expenses' | 'statement'>('invoices')

  // Financial Summary State
  const [summary, setSummary] = useState<any>({
    receivedRevenue: 0,
    invoicedReceivables: 0,
    outstandingReceivables: 0,
    approvedExpenses: 0,
    netCashFlow: 0,
  })
  const [monthlyData, setMonthlyData] = useState<any>({})
  const [expensesByCategory, setExpensesByCategory] = useState<any>({})
  const [loadingSummary, setLoadingSummary] = useState(true)

  // Invoices State
  const [invoices, setInvoices] = useState<any[]>([])
  const [loadingInvoices, setLoadingInvoices] = useState(false)
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('ALL')
  const [searchInvoice, setSearchInvoice] = useState('')

  // Payments State
  const [payments, setPayments] = useState<any[]>([])
  const [loadingPayments, setLoadingPayments] = useState(false)
  const [searchPayment, setSearchPayment] = useState('')

  // Expenses State
  const [expenses, setExpenses] = useState<any[]>([])
  const [loadingExpenses, setLoadingExpenses] = useState(false)
  const [expenseFilter, setExpenseFilter] = useState('ALL')

  // Metadata
  const [customers, setCustomers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [showDemoOnly, setShowDemoOnly] = useState(false)

  // Modals
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false)
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false)
  const [showSubmitExpenseModal, setShowSubmitExpenseModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [actionError, setActionError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Create Invoice Form State
  const [invoiceForm, setInvoiceForm] = useState({
    customerId: '',
    projectId: '',
    dueDate: '',
    taxRate: 18,
    currency: 'INR',
    notes: '',
    terms: 'Payment due within 30 days of invoice date. 18% GST applicable.',
    items: [{ description: 'Corporate Strategic Consultancy & Implementation', quantity: 1, unitPrice: 50000 }],
    isDemo: false,
  })

  // Record Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    invoiceId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'BANK_TRANSFER',
    transactionReference: '',
    notes: '',
    isDemo: false,
  })

  // Expense Form State
  const [expenseForm, setExpenseForm] = useState({
    category: 'TRAVEL',
    amount: '',
    currency: 'INR',
    description: '',
    projectId: '',
    receiptUrl: '',
    isDemo: false,
  })

  // Fetch Financial Summary
  const loadSummary = useCallback(async () => {
    setLoadingSummary(true)
    try {
      const res = await axios.get('/api/portal/finance/summary')
      setSummary(res.data.summary || {})
      setMonthlyData(res.data.monthlyData || {})
      setExpensesByCategory(res.data.expensesByCategory || {})
    } catch (err) {
      console.error('Failed to load financial summary:', err)
    } finally {
      setLoadingSummary(false)
    }
  }, [])

  // Fetch Invoices
  const loadInvoices = useCallback(async () => {
    setLoadingInvoices(true)
    try {
      const params = new URLSearchParams()
      if (invoiceStatusFilter !== 'ALL') params.set('status', invoiceStatusFilter)
      if (searchInvoice.trim()) params.set('search', searchInvoice.trim())
      if (showDemoOnly) params.set('isDemo', 'true')

      const res = await axios.get(`/api/portal/finance/invoices?${params.toString()}`)
      setInvoices(res.data.invoices || [])
    } catch (err) {
      console.error('Failed to load invoices:', err)
    } finally {
      setLoadingInvoices(false)
    }
  }, [invoiceStatusFilter, searchInvoice, showDemoOnly])

  // Fetch Payments
  const loadPayments = useCallback(async () => {
    setLoadingPayments(true)
    try {
      const params = new URLSearchParams()
      if (searchPayment.trim()) params.set('search', searchPayment.trim())
      if (showDemoOnly) params.set('isDemo', 'true')

      const res = await axios.get(`/api/portal/finance/payments?${params.toString()}`)
      setPayments(res.data.payments || [])
    } catch (err) {
      console.error('Failed to load payments:', err)
    } finally {
      setLoadingPayments(false)
    }
  }, [searchPayment, showDemoOnly])

  // Fetch Expenses
  const loadExpenses = useCallback(async () => {
    setLoadingExpenses(true)
    try {
      const res = await axios.get('/api/portal/finance')
      setExpenses(res.data || [])
    } catch (err) {
      console.error('Failed to load expenses:', err)
    } finally {
      setLoadingExpenses(false)
    }
  }, [])

  // Initial Load Metadata
  useEffect(() => {
    loadSummary()
    async function loadMeta() {
      try {
        const [custRes, prjRes] = await Promise.all([
          axios.get('/api/portal/crm/customers?limit=100'),
          axios.get('/api/portal/projects'),
        ])
        setCustomers(custRes.data.customers || [])
        setProjects(prjRes.data || [])
      } catch (err) {
        console.error('Failed to load metadata', err)
      }
    }
    loadMeta()
  }, [loadSummary])

  useEffect(() => {
    if (activeTab === 'invoices') loadInvoices()
    else if (activeTab === 'payments') loadPayments()
    else if (activeTab === 'expenses') loadExpenses()
    else if (activeTab === 'statement') loadSummary()
  }, [activeTab, loadInvoices, loadPayments, loadExpenses, loadSummary])

  // Invoice Line Items calculation
  const calculatedSubtotal = invoiceForm.items.reduce(
    (acc, it) => acc + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
    0
  )
  const calculatedTax = Math.round(((calculatedSubtotal * invoiceForm.taxRate) / 100) * 100) / 100
  const calculatedTotal = calculatedSubtotal + calculatedTax

  // Submit Invoice
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionError('')
    setIsSubmitting(true)
    try {
      await axios.post('/api/portal/finance/invoices', invoiceForm)
      setShowCreateInvoiceModal(false)
      loadInvoices()
      loadSummary()
    } catch (err: any) {
      setActionError(err.response?.data?.error || 'Failed to issue invoice')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit Payment
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionError('')
    setIsSubmitting(true)
    try {
      await axios.post('/api/portal/finance/payments', paymentForm)
      setShowRecordPaymentModal(false)
      setPaymentForm({
        invoiceId: '',
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'BANK_TRANSFER',
        transactionReference: '',
        notes: '',
        isDemo: false,
      })
      loadPayments()
      loadInvoices()
      loadSummary()
    } catch (err: any) {
      setActionError(err.response?.data?.error || 'Failed to record payment')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit Expense
  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionError('')
    setIsSubmitting(true)
    try {
      await axios.post('/api/portal/finance', expenseForm)
      setShowSubmitExpenseModal(false)
      setExpenseForm({
        category: 'TRAVEL',
        amount: '',
        currency: 'INR',
        description: '',
        projectId: '',
        receiptUrl: '',
        isDemo: false,
      })
      loadExpenses()
      loadSummary()
    } catch (err: any) {
      setActionError(err.response?.data?.error || 'Failed to submit expense')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Review Expense (Approve/Reject/Reimburse)
  const handleReviewExpense = async (status: string) => {
    if (!selectedExpense) return
    setIsSubmitting(true)
    try {
      await axios.put(`/api/portal/finance/${selectedExpense.id}`, {
        status,
        reviewNotes,
      })
      setSelectedExpense(null)
      setReviewNotes('')
      loadExpenses()
      loadSummary()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update expense status')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PortalShell
      title="Finance & Cash Flow"
      breadcrumbs={[{ label: 'Finance & Insights', href: '/portal/finance' }, { label: 'Invoices & Ledger' }]}
    >
      <Head>
        <title>Finance & Invoices — Success Tunnel ERP</title>
      </Head>

      {/* Top Banner & Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Enterprise Finance & Invoicing Suite
            </h1>
            <span
              style={{
                fontSize: '0.75rem',
                background: '#e0f2fe',
                color: '#0369a1',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                fontWeight: 700,
              }}
            >
              Strict Cash Verification
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
            Compliant accounts receivable, verified payment receipts, and operating expense management.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowSubmitExpenseModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              padding: '0.55rem 0.9rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <HiOutlinePlus /> Expense Claim
          </button>
          <button
            onClick={() => setShowRecordPaymentModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#047857',
              border: 'none',
              padding: '0.55rem 0.9rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <HiOutlineCreditCard /> Record Payment
          </button>
          <button
            onClick={() => setShowCreateInvoiceModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#0284c7',
              border: 'none',
              padding: '0.55rem 1rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <HiOutlineDocumentText /> Issue Invoice
          </button>
        </div>
      </div>

      {/* KPI Cards — Strict Invariant: Revenue strictly equals verified completed payments */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ background: '#ffffff', borderRadius: '8px', padding: '1.1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.825rem' }}>
            <span>Verified Received Revenue</span>
            <HiOutlineCheckCircle style={{ fontSize: '1.2rem', color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#10b981', marginTop: '0.35rem' }}>
            ₹{(summary.receivedRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            Actual realized cash receipts in bank
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '8px', padding: '1.1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.825rem' }}>
            <span>Invoiced Receivables</span>
            <HiOutlineDocumentText style={{ fontSize: '1.2rem', color: '#0284c7' }} />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem' }}>
            ₹{(summary.invoicedReceivables || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            Total billed contract receivables
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '8px', padding: '1.1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.825rem' }}>
            <span>Outstanding Pending</span>
            <HiOutlineExclamationCircle style={{ fontSize: '1.2rem', color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.35rem' }}>
            ₹{(summary.outstandingReceivables || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            Unpaid client balances (Not counted in revenue)
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '8px', padding: '1.1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.825rem' }}>
            <span>Approved Expenses</span>
            <HiOutlineCash style={{ fontSize: '1.2rem', color: '#ef4444' }} />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ef4444', marginTop: '0.35rem' }}>
            ₹{(summary.approvedExpenses || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            Total staff claims approved & reimbursed
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '8px', padding: '1.1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.825rem' }}>
            <span>Net Operating Cash Flow</span>
            <HiOutlineReceiptTax style={{ fontSize: '1.2rem', color: '#6366f1' }} />
          </div>
          <div
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: summary.netCashFlow >= 0 ? '#0f172a' : '#b91c1c',
              marginTop: '0.35rem',
            }}
          >
            ₹{(summary.netCashFlow || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            Verified Revenue minus Approved Outflows
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('invoices')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: activeTab === 'invoices' ? '#0f172a' : '#f1f5f9',
              color: activeTab === 'invoices' ? '#ffffff' : '#475569',
            }}
          >
            Invoices ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: activeTab === 'payments' ? '#0f172a' : '#f1f5f9',
              color: activeTab === 'payments' ? '#ffffff' : '#475569',
            }}
          >
            Received Payments ({payments.length})
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: activeTab === 'expenses' ? '#0f172a' : '#f1f5f9',
              color: activeTab === 'expenses' ? '#ffffff' : '#475569',
            }}
          >
            Expense Claims ({expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('statement')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: activeTab === 'statement' ? '#0f172a' : '#f1f5f9',
              color: activeTab === 'statement' ? '#ffffff' : '#475569',
            }}
          >
            Cash Flow Statement
          </button>
        </div>

        {/* Filters & Export */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {activeTab === 'invoices' && (
            <>
              <div style={{ position: 'relative' }}>
                <HiOutlineSearch
                  style={{
                    position: 'absolute',
                    left: '0.7rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchInvoice}
                  onChange={(e) => setSearchInvoice(e.target.value)}
                  style={{
                    padding: '0.45rem 0.75rem 0.45rem 2.1rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.825rem',
                    width: '180px',
                  }}
                />
              </div>

              <select
                value={invoiceStatusFilter}
                onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                style={{
                  padding: '0.45rem 0.6rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '0.825rem',
                  background: '#fff',
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="ISSUED">Issued</option>
                <option value="PAID">Paid</option>
                <option value="PARTIALLY_PAID">Partially Paid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="DRAFT">Draft</option>
              </select>

              <a
                href="/api/portal/reports?export=csv&module=invoices"
                download
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: '#334155',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                <HiOutlineDownload /> Export Invoices CSV
              </a>
            </>
          )}

          {activeTab === 'payments' && (
            <a
              href="/api/portal/reports?export=csv&module=payments"
              download
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                padding: '0.45rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: '#334155',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <HiOutlineDownload /> Export Payments CSV
            </a>
          )}
        </div>
      </div>

      {/* 1. INVOICES TAB */}
      {activeTab === 'invoices' && (
        <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Invoice #</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Customer / Client</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Project</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Issue Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Due Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Total (incl. GST)</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Paid Amount</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Pending Balance</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: '#0284c7' }}>
                      {inv.invoiceNumber}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{inv.customer?.company || inv.customer?.name || 'Direct Client'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{inv.customer?.email}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.8rem' }}>
                      {inv.project?.name || '-'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(inv.issueDate).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(inv.dueDate).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#0f172a' }}>
                      ₹{inv.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#10b981' }}>
                      ₹{inv.paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: inv.remainingBalance > 0 ? '#b45309' : '#64748b' }}>
                      ₹{inv.remainingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          background:
                            inv.status === 'PAID'
                              ? '#dcfce7'
                              : inv.status === 'PARTIALLY_PAID'
                              ? '#fef3c7'
                              : inv.status === 'OVERDUE'
                              ? '#fee2e2'
                              : '#f1f5f9',
                          color:
                            inv.status === 'PAID'
                              ? '#15803d'
                              : inv.status === 'PARTIALLY_PAID'
                              ? '#b45309'
                              : inv.status === 'OVERDUE'
                              ? '#b91c1c'
                              : '#475569',
                        }}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}

                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={10} style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
                      No invoices found. Click &ldquo;+ Issue Invoice&rdquo; to create a new billing record.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. PAYMENTS TAB */}
      {activeTab === 'payments' && (
        <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Payment #</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Linked Invoice</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Customer / Account</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Amount Received</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Payment Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Method</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Transaction Ref / UTR</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: '#0284c7' }}>
                      {p.paymentNumber}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', color: '#475569' }}>
                      {p.invoice?.invoiceNumber || '-'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                      {p.customer?.company || p.customer?.name || '-'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#10b981' }}>
                      ₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(p.paymentDate).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#475569' }}>
                      {p.paymentMethod}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748b' }}>
                      {p.transactionReference || '-'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          background: p.status === 'COMPLETED' ? '#dcfce7' : '#fef3c7',
                          color: p.status === 'COMPLETED' ? '#15803d' : '#b45309',
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {payments.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
                      No received payment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. EXPENSES TAB */}
      {activeTab === 'expenses' && (
        <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Employee</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Description</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Project Allocation</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{exp.user?.name || 'Staff'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{exp.user?.email}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          background: '#f1f5f9',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      >
                        {exp.category}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#0f172a' }}>
                      ₹{exp.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(exp.expenseDate || exp.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', maxWidth: '250px', color: '#475569', fontSize: '0.8rem' }}>
                      {exp.description}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#64748b' }}>
                      {exp.project?.name || 'General Operations'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          background:
                            exp.status === 'REIMBURSED' || exp.status === 'APPROVED'
                              ? '#dcfce7'
                              : exp.status === 'REJECTED'
                              ? '#fee2e2'
                              : '#fef3c7',
                          color:
                            exp.status === 'REIMBURSED' || exp.status === 'APPROVED'
                              ? '#15803d'
                              : exp.status === 'REJECTED'
                              ? '#b91c1c'
                              : '#b45309',
                        }}
                      >
                        {exp.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedExpense(exp)}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. STATEMENT TAB */}
      {activeTab === 'statement' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Monthly Comparison */}
          <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0' }}>
              Quarterly Cash Flow Breakdown (Realized Revenue vs Operating Expenses)
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Period</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Invoiced (Receivables)</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Verified Cash Revenue</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Operating Expenses</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Net Operating Flow</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(monthlyData).map((m) => {
                    const row = monthlyData[m]
                    const net = row.revenue - row.expenses
                    return (
                      <tr key={m} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{m}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                          ₹{(row.invoiced || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#10b981' }}>
                          ₹{(row.revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#ef4444' }}>
                          ₹{(row.expenses || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td
                          style={{
                            padding: '0.75rem 1rem',
                            fontWeight: 800,
                            color: net >= 0 ? '#0f172a' : '#b91c1c',
                          }}
                        >
                          ₹{net.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expenses by Category */}
          <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0' }}>
              Expense Distribution by Category
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {Object.keys(expensesByCategory).map((cat) => (
                <div
                  key={cat}
                  style={{
                    background: '#f8fafc',
                    padding: '0.9rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{cat}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
                    ₹{expensesByCategory[cat].toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {showCreateInvoiceModal && (
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
              maxWidth: '600px',
              width: '100%',
              padding: '1.5rem',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Issue Client Invoice</h3>
              <button
                onClick={() => setShowCreateInvoiceModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                <HiOutlineX />
              </button>
            </div>

            {actionError && (
              <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.6rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {actionError}
              </div>
            )}

            <form onSubmit={handleCreateInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Customer Account *</label>
                  <select
                    required
                    value={invoiceForm.customerId}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, customerId: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  >
                    <option value="">Select Customer</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.company ? `(${c.company})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Project Association</label>
                  <select
                    value={invoiceForm.projectId}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, projectId: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  >
                    <option value="">Select Project (Optional)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.projectCode} - {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Due Date *</label>
                <input
                  type="date"
                  required
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                  style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                />
              </div>

              {/* Line items */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.4rem' }}>
                  Line Items
                </label>
                {invoiceForm.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 30px', gap: '0.4rem', marginBottom: '0.4rem' }}>
                    <input
                      type="text"
                      placeholder="Service description"
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...invoiceForm.items]
                        newItems[idx].description = e.target.value
                        setInvoiceForm({ ...invoiceForm, items: newItems })
                      }}
                      style={{ padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.8rem' }}
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...invoiceForm.items]
                        newItems[idx].quantity = parseInt(e.target.value) || 1
                        setInvoiceForm({ ...invoiceForm, items: newItems })
                      }}
                      style={{ padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.8rem' }}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Price (₹)"
                      value={item.unitPrice}
                      onChange={(e) => {
                        const newItems = [...invoiceForm.items]
                        newItems[idx].unitPrice = parseFloat(e.target.value) || 0
                        setInvoiceForm({ ...invoiceForm, items: newItems })
                      }}
                      style={{ padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.8rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (invoiceForm.items.length > 1) {
                          setInvoiceForm({ ...invoiceForm, items: invoiceForm.items.filter((_, i) => i !== idx) })
                        }
                      }}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <HiOutlineX />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setInvoiceForm({
                      ...invoiceForm,
                      items: [...invoiceForm.items, { description: '', quantity: 1, unitPrice: 0 }],
                    })
                  }
                  style={{
                    padding: '0.3rem 0.6rem',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  + Add Item
                </button>
              </div>

              {/* Total Calculation Display */}
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', fontSize: '0.825rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>Subtotal:</span>
                  <strong>₹{calculatedSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>GST ({invoiceForm.taxRate}%):</span>
                  <strong>₹{calculatedTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #cbd5e1',
                    paddingTop: '0.4rem',
                    fontSize: '0.95rem',
                    color: '#0f172a',
                  }}
                >
                  <strong>Total Payable:</strong>
                  <strong style={{ color: '#0284c7' }}>
                    ₹{calculatedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateInvoiceModal(false)}
                  style={{ padding: '0.5rem 0.9rem', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '0.5rem 1.1rem',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isSubmitting ? 'Issuing...' : 'Issue Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {showRecordPaymentModal && (
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
              maxWidth: '500px',
              width: '100%',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Record Received Payment</h3>
              <button
                onClick={() => setShowRecordPaymentModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                <HiOutlineX />
              </button>
            </div>

            {actionError && (
              <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.6rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {actionError}
              </div>
            )}

            <form onSubmit={handleRecordPayment} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Apply against Invoice *</label>
                <select
                  required
                  value={paymentForm.invoiceId}
                  onChange={(e) => {
                    const inv = invoices.find((i) => i.id === parseInt(e.target.value))
                    setPaymentForm({
                      ...paymentForm,
                      invoiceId: e.target.value,
                      amount: inv ? String(inv.remainingBalance) : paymentForm.amount,
                    })
                  }}
                  style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                >
                  <option value="">Select Invoice</option>
                  {invoices
                    .filter((inv) => inv.status !== 'PAID' && inv.status !== 'VOID')
                    .map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoiceNumber} — {inv.customer?.name} (Pending: ₹{inv.remainingBalance})
                      </option>
                    ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Payment Date *</label>
                  <input
                    type="date"
                    required
                    value={paymentForm.paymentDate}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Payment Method</label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  >
                    <option value="BANK_TRANSFER">Bank Wire / RTGS</option>
                    <option value="UPI">UPI Transfer</option>
                    <option value="CHEQUE">Cheque Clearance</option>
                    <option value="CARD">Corporate Card</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Transaction Reference / UTR</label>
                  <input
                    type="text"
                    placeholder="e.g. UTR102938475"
                    value={paymentForm.transactionReference}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transactionReference: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.8rem' }}>
                <button
                  type="button"
                  onClick={() => setShowRecordPaymentModal(false)}
                  style={{ padding: '0.5rem 0.9rem', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '0.5rem 1.1rem',
                    background: '#047857',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isSubmitting ? 'Recording...' : 'Confirm Received Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMIT EXPENSE MODAL */}
      {showSubmitExpenseModal && (
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
          <div style={{ background: '#ffffff', borderRadius: '8px', maxWidth: '480px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Submit Expense Claim</h3>
              <button
                onClick={() => setShowSubmitExpenseModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                <HiOutlineX />
              </button>
            </div>

            <form onSubmit={handleSubmitExpense} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Category *</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  >
                    <option value="TRAVEL">Travel & Transport</option>
                    <option value="SOFTWARE">Software & Cloud</option>
                    <option value="HARDWARE">Hardware & Peripherals</option>
                    <option value="OFFICE_SUPPLIES">Office Supplies</option>
                    <option value="TRAINING">Training & Courses</option>
                    <option value="CLIENT_ENTERTAINMENT">Client Entertainment</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Description *</label>
                <textarea
                  required
                  rows={2}
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Project Allocation (Optional)</label>
                <select
                  value={expenseForm.projectId}
                  onChange={(e) => setExpenseForm({ ...expenseForm, projectId: e.target.value })}
                  style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                >
                  <option value="">General Overhead</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.projectCode} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.8rem' }}>
                <button
                  type="button"
                  onClick={() => setShowSubmitExpenseModal(false)}
                  style={{ padding: '0.5rem 0.9rem', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '0.5rem 1.1rem',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW EXPENSE MODAL */}
      {selectedExpense && (
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
          <div style={{ background: '#ffffff', borderRadius: '8px', maxWidth: '480px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Review Expense Claim</h3>
              <button
                onClick={() => setSelectedExpense(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                <HiOutlineX />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '6px', fontSize: '0.825rem', marginBottom: '1rem' }}>
              <div><strong>Employee:</strong> {selectedExpense.user?.name} ({selectedExpense.user?.email})</div>
              <div><strong>Amount:</strong> ₹{selectedExpense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              <div><strong>Category:</strong> {selectedExpense.category}</div>
              <div><strong>Description:</strong> {selectedExpense.description}</div>
              {selectedExpense.reviewNotes && <div><strong>Previous Review:</strong> {selectedExpense.reviewNotes}</div>}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Finance Decision Notes</label>
              <textarea
                rows={2}
                placeholder="Audit notes or transaction batch reference..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleReviewExpense('REJECTED')}
                style={{ padding: '0.5rem 0.9rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => handleReviewExpense('APPROVED')}
                style={{ padding: '0.5rem 0.9rem', background: '#e0e7ff', color: '#4338ca', border: 'none', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => handleReviewExpense('REIMBURSED')}
                style={{ padding: '0.5rem 0.9rem', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}
              >
                Reimburse & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  )
}
