import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import axios from 'axios'
import PortalShell from '../../../components/portal/PortalShell'
import styles from '../../../components/portal/Portal.module.css'
import {
  HiOutlineUserGroup,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineCash,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineOfficeBuilding,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineX,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineDocumentText,
  HiOutlineChatAlt,
  HiOutlineExternalLink,
  HiOutlineArrowRight,
  HiOutlineBadgeCheck,
} from 'react-icons/hi'

const PIPELINE_STAGES = [
  { id: 'NEW', label: 'New Inquiries', color: '#3b82f6', bg: '#eff6ff' },
  { id: 'CONTACTED', label: 'Contacted', color: '#6366f1', bg: '#eef2ff' },
  { id: 'QUALIFIED', label: 'Qualified', color: '#f59e0b', bg: '#fffbeb' },
  { id: 'PROPOSAL_SENT', label: 'Proposal Sent', color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'WON', label: 'Won / Converted', color: '#10b981', bg: '#ecfdf5' },
  { id: 'LOST', label: 'Archived / Lost', color: '#94a3b8', bg: '#f8fafc' },
]

export default function CRMModule() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'pipeline' | 'leads' | 'customers' | 'enquiries'>('pipeline')

  // Leads State
  const [leads, setLeads] = useState<any[]>([])
  const [pipelineStats, setPipelineStats] = useState<any[]>([])
  const [loadingLeads, setLoadingLeads] = useState(true)

  // Customers State
  const [customers, setCustomers] = useState<any[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)

  // Enquiries State
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [unreadEnquiries, setUnreadEnquiries] = useState(0)
  const [loadingEnquiries, setLoadingEnquiries] = useState(false)

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [sourceFilter, setSourceFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDemoOnly, setShowDemoOnly] = useState(false)

  // Modals & Drawers
  const [selectedLead, setSelectedLead] = useState<any | null>(null)
  const [loadingLeadDetail, setLoadingLeadDetail] = useState(false)
  const [showNewLeadModal, setShowNewLeadModal] = useState(false)
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false)

  // Lead Form
  const [leadForm, setLeadForm] = useState({
    title: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    company: '',
    source: 'WEBSITE_ENQUIRY',
    status: 'NEW',
    priority: 'MEDIUM',
    estimatedValue: 0,
    currency: 'INR',
    notes: '',
    isDemo: false,
  })

  // Customer Form
  const [customerForm, setCustomerForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    website: '',
    notes: '',
    isDemo: false,
  })

  // Activity Log Form
  const [activityForm, setActivityForm] = useState({
    type: 'CALL',
    summary: '',
    details: '',
    followUpDate: '',
  })
  const [savingActivity, setSavingActivity] = useState(false)
  const [actionError, setActionError] = useState('')

  // Check URL query parameters for initial state
  useEffect(() => {
    if (router.query.tab === 'customers') setActiveTab('customers')
    if (router.query.tab === 'enquiries') setActiveTab('enquiries')
    if (router.query.tab === 'leads') setActiveTab('leads')
    if (router.query.leadId) {
      loadSingleLead(Number(router.query.leadId))
    }
  }, [router.query])

  // Fetch Leads
  const loadLeads = useCallback(async () => {
    setLoadingLeads(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.set('status', statusFilter)
      if (priorityFilter !== 'ALL') params.set('priority', priorityFilter)
      if (sourceFilter !== 'ALL') params.set('source', sourceFilter)
      if (searchQuery.trim()) params.set('search', searchQuery.trim())
      if (showDemoOnly) params.set('isDemo', 'true')

      const res = await axios.get(`/api/portal/crm/leads?${params.toString()}`)
      setLeads(res.data.leads || [])
      setPipelineStats(res.data.pipelineStats || [])
    } catch (err: any) {
      console.error('Failed to load leads:', err)
    } finally {
      setLoadingLeads(false)
    }
  }, [statusFilter, priorityFilter, sourceFilter, searchQuery, showDemoOnly])

  // Fetch Customers
  const loadCustomers = useCallback(async () => {
    setLoadingCustomers(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.set('search', searchQuery.trim())
      if (showDemoOnly) params.set('isDemo', 'true')

      const res = await axios.get(`/api/portal/crm/customers?${params.toString()}`)
      setCustomers(res.data.customers || [])
    } catch (err: any) {
      console.error('Failed to load customers:', err)
    } finally {
      setLoadingCustomers(false)
    }
  }, [searchQuery, showDemoOnly])

  // Fetch Enquiries
  const loadEnquiries = useCallback(async () => {
    setLoadingEnquiries(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.set('search', searchQuery.trim())

      const res = await axios.get(`/api/portal/crm/enquiries?${params.toString()}`)
      setEnquiries(res.data.enquiries || [])
      setUnreadEnquiries(res.data.unreadCount || 0)
    } catch (err: any) {
      console.error('Failed to load enquiries:', err)
    } finally {
      setLoadingEnquiries(false)
    }
  }, [searchQuery])

  useEffect(() => {
    if (activeTab === 'pipeline' || activeTab === 'leads') {
      loadLeads()
    } else if (activeTab === 'customers') {
      loadCustomers()
    } else if (activeTab === 'enquiries') {
      loadEnquiries()
    }
  }, [activeTab, loadLeads, loadCustomers, loadEnquiries])

  // Initial load of enquiries to get unread badge
  useEffect(() => {
    axios.get('/api/portal/crm/enquiries?limit=1')
      .then((res) => setUnreadEnquiries(res.data.unreadCount || 0))
      .catch(() => {})
  }, [])

  // Single Lead Detail
  const loadSingleLead = async (id: number) => {
    setLoadingLeadDetail(true)
    try {
      const res = await axios.get(`/api/portal/crm/leads/${id}`)
      setSelectedLead(res.data)
    } catch (err: any) {
      console.error('Failed to load lead details:', err)
    } finally {
      setLoadingLeadDetail(false)
    }
  }

  // Update Lead Status / Convert to Customer
  const handleUpdateStatus = async (leadId: number, newStatus: string, convertToCustomer = false) => {
    try {
      const res = await axios.put(`/api/portal/crm/leads/${leadId}`, {
        status: newStatus,
        convertToCustomer,
      })
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(res.data.lead)
      }
      loadLeads()
    } catch (err: any) {
      setActionError(err.response?.data?.error || 'Failed to update stage')
    }
  }

  // Submit Activity Log
  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLead || !activityForm.summary.trim()) return

    setSavingActivity(true)
    setActionError('')
    try {
      await axios.post(`/api/portal/crm/leads/${selectedLead.id}/activities`, activityForm)
      setActivityForm({ type: 'CALL', summary: '', details: '', followUpDate: '' })
      loadSingleLead(selectedLead.id)
      loadLeads()
    } catch (err: any) {
      setActionError(err.response?.data?.error || 'Failed to save interaction')
    } finally {
      setSavingActivity(false)
    }
  }

  // Convert Enquiry to Lead
  const handleConvertEnquiry = async (enquiryId: number) => {
    try {
      const res = await axios.post('/api/portal/crm/enquiries', {
        enquiryId,
        action: 'CONVERT_TO_LEAD',
      })
      loadEnquiries()
      if (res.data.lead) {
        setSelectedLead(res.data.lead)
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to convert enquiry')
    }
  }

  // Create Lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionError('')
    try {
      const res = await axios.post('/api/portal/crm/leads', leadForm)
      setShowNewLeadModal(false)
      setLeadForm({
        title: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        company: '',
        source: 'DIRECT',
        status: 'NEW',
        priority: 'MEDIUM',
        estimatedValue: 0,
        currency: 'INR',
        notes: '',
        isDemo: false,
      })
      loadLeads()
      setSelectedLead(res.data)
    } catch (err: any) {
      setActionError(err.response?.data?.error || 'Failed to create lead')
    }
  }

  // Create Customer
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionError('')
    try {
      await axios.post('/api/portal/crm/customers', customerForm)
      setShowNewCustomerModal(false)
      setCustomerForm({
        name: '',
        company: '',
        email: '',
        phone: '',
        city: '',
        address: '',
        website: '',
        notes: '',
        isDemo: false,
      })
      loadCustomers()
    } catch (err: any) {
      setActionError(err.response?.data?.error || 'Failed to create customer')
    }
  }

  // Calculate Metrics
  const totalPipelineValue = leads
    .filter((l) => l.status !== 'LOST')
    .reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0)

  const activeLeadsCount = leads.filter(
    (l) => l.status === 'NEW' || l.status === 'CONTACTED' || l.status === 'QUALIFIED' || l.status === 'PROPOSAL_SENT'
  ).length

  const wonLeads = leads.filter((l) => l.status === 'WON')
  const wonValue = wonLeads.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0)

  const closedCount = wonLeads.length + leads.filter((l) => l.status === 'LOST').length
  const winRate = closedCount > 0 ? Math.round((wonLeads.length / closedCount) * 100) : 0

  return (
    <PortalShell
      title="CRM & Pipeline"
      breadcrumbs={[{ label: 'Sales & CRM', href: '/portal/crm' }, { label: 'Deals & Pipeline' }]}
    >
      <Head>
        <title>CRM & Pipeline — Success Tunnel ERP</title>
      </Head>

      {/* Top Banner & Title */}
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
              Customer Relationship & Deals Pipeline
            </h1>
            <span
              style={{
                fontSize: '0.75rem',
                background: '#e0e7ff',
                color: '#4338ca',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                fontWeight: 700,
              }}
            >
              ERP v2.4
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
            Unified enterprise pipeline tracking client inquiries, proposal negotiations, and customer accounts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowNewCustomerModal(true)}
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
            <HiOutlineOfficeBuilding /> + New Customer
          </button>
          <button
            onClick={() => setShowNewLeadModal(true)}
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
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <HiOutlinePlus /> + New Deal / Lead
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ background: '#ffffff', borderRadius: '8px', padding: '1.1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.825rem' }}>
            <span>Active Pipeline Value</span>
            <HiOutlineCash style={{ fontSize: '1.2rem', color: '#0284c7' }} />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem' }}>
            ₹{totalPipelineValue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.2rem' }}>
            {activeLeadsCount} active opportunities in funnel
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '8px', padding: '1.1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.825rem' }}>
            <span>Won Deals Revenue</span>
            <HiOutlineCheckCircle style={{ fontSize: '1.2rem', color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#10b981', marginTop: '0.35rem' }}>
            ₹{wonValue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.2rem' }}>
            {wonLeads.length} enterprise deals won
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '8px', padding: '1.1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.825rem' }}>
            <span>Win / Conversion Rate</span>
            <HiOutlineBadgeCheck style={{ fontSize: '1.2rem', color: '#8b5cf6' }} />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem' }}>
            {winRate}%
          </div>
          <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.2rem' }}>
            {closedCount} total closed opportunities
          </div>
        </div>

        <div
          onClick={() => setActiveTab('enquiries')}
          style={{
            background: unreadEnquiries > 0 ? '#eff6ff' : '#ffffff',
            borderRadius: '8px',
            padding: '1.1rem',
            border: unreadEnquiries > 0 ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.825rem' }}>
            <span>Website Inquiries</span>
            <HiOutlineMail style={{ fontSize: '1.2rem', color: unreadEnquiries > 0 ? '#2563eb' : '#64748b' }} />
          </div>
          <div
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: unreadEnquiries > 0 ? '#1d4ed8' : '#0f172a',
              marginTop: '0.35rem',
            }}
          >
            {unreadEnquiries} Unread
          </div>
          <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.2rem' }}>
            Click to view website lead stream
          </div>
        </div>
      </div>

      {/* Tabs Navigation & Filters Bar */}
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
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('pipeline')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: activeTab === 'pipeline' ? '#0f172a' : '#f1f5f9',
              color: activeTab === 'pipeline' ? '#ffffff' : '#475569',
            }}
          >
            Pipeline Kanban
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: activeTab === 'leads' ? '#0f172a' : '#f1f5f9',
              color: activeTab === 'leads' ? '#ffffff' : '#475569',
            }}
          >
            All Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: activeTab === 'customers' ? '#0f172a' : '#f1f5f9',
              color: activeTab === 'customers' ? '#ffffff' : '#475569',
            }}
          >
            Customer Directory
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: activeTab === 'enquiries' ? '#0f172a' : '#f1f5f9',
              color: activeTab === 'enquiries' ? '#ffffff' : '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            Website Enquiries
            {unreadEnquiries > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '10px',
                }}
              >
                {unreadEnquiries}
              </span>
            )}
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
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
              placeholder="Search by name, company, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.45rem 0.75rem 0.45rem 2.1rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.825rem',
                width: '220px',
              }}
            />
          </div>

          {(activeTab === 'pipeline' || activeTab === 'leads') && (
            <>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={{
                  padding: '0.45rem 0.6rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '0.825rem',
                  background: '#fff',
                }}
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                style={{
                  padding: '0.45rem 0.6rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '0.825rem',
                  background: '#fff',
                }}
              >
                <option value="ALL">All Sources</option>
                <option value="WEBSITE_ENQUIRY">Website Inquiries</option>
                <option value="REFERRAL">Referrals</option>
                <option value="DIRECT">Direct Engagement</option>
                <option value="PARTNER">Partner Channel</option>
              </select>
            </>
          )}

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              color: '#475569',
              cursor: 'pointer',
              marginLeft: '0.3rem',
            }}
          >
            <input
              type="checkbox"
              checked={showDemoOnly}
              onChange={(e) => setShowDemoOnly(e.target.checked)}
            />
            Demo only
          </label>
        </div>
      </div>

      {/* 1. PIPELINE KANBAN VIEW */}
      {activeTab === 'pipeline' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            alignItems: 'start',
            overflowX: 'auto',
            paddingBottom: '1rem',
          }}
        >
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.status === stage.id)
            const stageValue = stageLeads.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0)

            return (
              <div
                key={stage.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '400px',
                }}
              >
                {/* Stage Header */}
                <div
                  style={{
                    padding: '0.75rem 0.9rem',
                    borderBottom: '2px solid ' + stage.color,
                    background: '#ffffff',
                    borderTopLeftRadius: '7px',
                    borderTopRightRadius: '7px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>
                      {stage.label}
                    </span>
                    <span
                      style={{
                        background: stage.bg,
                        color: stage.color,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '12px',
                      }}
                    >
                      {stageLeads.length}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                    ₹{stageValue.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Stage Cards */}
                <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '0.85rem',
                        cursor: 'pointer',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                        transition: 'transform 0.1s, box-shadow 0.1s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.08)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)'
                      }}
                    >
                      {lead.isDemo && (
                        <div
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            color: '#ea580c',
                            background: '#ffedd5',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            display: 'inline-block',
                            marginBottom: '0.4rem',
                          }}
                        >
                          DEMO RECORD
                        </div>
                      )}

                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                        {lead.title}
                      </div>

                      <div style={{ fontSize: '0.775rem', color: '#475569', marginBottom: '0.5rem' }}>
                        {lead.company ? <strong>{lead.company} • </strong> : null}
                        {lead.contactName}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid #f1f5f9',
                          paddingTop: '0.5rem',
                          marginTop: '0.4rem',
                          fontSize: '0.75rem',
                        }}
                      >
                        <span style={{ fontWeight: 800, color: '#0284c7' }}>
                          ₹{(lead.estimatedValue || 0).toLocaleString('en-IN')}
                        </span>

                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            background:
                              lead.priority === 'HIGH'
                                ? '#fee2e2'
                                : lead.priority === 'MEDIUM'
                                ? '#fef3c7'
                                : '#f1f5f9',
                            color:
                              lead.priority === 'HIGH'
                                ? '#b91c1c'
                                : lead.priority === 'MEDIUM'
                                ? '#b45309'
                                : '#475569',
                          }}
                        >
                          {lead.priority}
                        </span>
                      </div>

                      {lead.nextFollowUp && (
                        <div
                          style={{
                            marginTop: '0.5rem',
                            fontSize: '0.7rem',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <HiOutlineClock /> Next:{' '}
                          {new Date(lead.nextFollowUp).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      )}
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div
                      style={{
                        padding: '1.5rem 0.5rem',
                        textAlign: 'center',
                        color: '#94a3b8',
                        fontSize: '0.8rem',
                        border: '1px dashed #cbd5e1',
                        borderRadius: '6px',
                      }}
                    >
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 2. ALL LEADS TABLE VIEW */}
      {activeTab === 'leads' && (
        <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Title & Company</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Contact</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Source</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Stage</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Value</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Priority</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Follow-up</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr
                    key={l.id}
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                    onClick={() => setSelectedLead(l)}
                  >
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: '#0284c7' }}>
                      {l.leadCode}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{l.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{l.company || 'Direct Contact'}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div>{l.contactName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{l.contactEmail}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#475569' }}>
                      {l.source}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          background:
                            l.status === 'WON'
                              ? '#dcfce7'
                              : l.status === 'NEW'
                              ? '#dbeafe'
                              : l.status === 'LOST'
                              ? '#f1f5f9'
                              : '#fef3c7',
                          color:
                            l.status === 'WON'
                              ? '#15803d'
                              : l.status === 'NEW'
                              ? '#1d4ed8'
                              : l.status === 'LOST'
                              ? '#64748b'
                              : '#b45309',
                        }}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                      ₹{(l.estimatedValue || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: l.priority === 'HIGH' ? '#fee2e2' : '#f1f5f9',
                          color: l.priority === 'HIGH' ? '#b91c1c' : '#475569',
                        }}
                      >
                        {l.priority}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#64748b' }}>
                      {l.nextFollowUp
                        ? new Date(l.nextFollowUp).toLocaleDateString('en-IN')
                        : '-'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedLead(l)
                        }}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          padding: '0.3rem 0.6rem',
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

                {leads.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
                      No deals or leads found matching query filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CUSTOMER DIRECTORY VIEW */}
      {activeTab === 'customers' && (
        <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Customer Code</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Account / Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Company</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Contact Details</th>
                  <th style={{ padding: '0.75rem 1rem' }}>City / Location</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Active Projects</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: '#0284c7' }}>
                      {c.customerCode}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                      {c.name}
                      {c.isDemo && (
                        <span
                          style={{
                            marginLeft: '0.4rem',
                            fontSize: '0.65rem',
                            background: '#ffedd5',
                            color: '#ea580c',
                            padding: '0.1rem 0.35rem',
                            borderRadius: '4px',
                          }}
                        >
                          DEMO
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                      {c.company || '-'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div>{c.email}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.phone || '-'}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                      {c.city || '-'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          background: '#f1f5f9',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      >
                        {c._count?.projects || 0} Projects
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          background: c.status === 'ACTIVE' ? '#dcfce7' : '#f1f5f9',
                          color: c.status === 'ACTIVE' ? '#15803d' : '#64748b',
                        }}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {customers.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
                      No customer accounts registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. WEBSITE ENQUIRIES VIEW */}
      {activeTab === 'enquiries' && (
        <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div
            style={{
              padding: '0.9rem 1.1rem',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                Website Inquiries Feed
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '0.5rem' }}>
                Directly connected to public website contact & consultation forms
              </span>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0284c7' }}>
              {enquiries.length} total captured
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
                  <th style={{ padding: '0.75rem 1rem' }}>ID & Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Sender</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Service Requested</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Message Snippet</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Workflow Action</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enq) => (
                  <tr key={enq.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>#{enq.id}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{enq.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{enq.email} • {enq.phone}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          background: '#f1f5f9',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          color: '#334155',
                        }}
                      >
                        {enq.service || 'General'}
                      </span>
                      {enq.city && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>{enq.city}</div>}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', maxWidth: '300px', color: '#475569', fontSize: '0.8rem' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {enq.message || '-'}
                      </div>
                      {enq.page && <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Source: {enq.page}</div>}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          background:
                            enq.status === 'CONVERTED_TO_LEAD'
                              ? '#dcfce7'
                              : enq.status === 'UNREAD'
                              ? '#fee2e2'
                              : '#f1f5f9',
                          color:
                            enq.status === 'CONVERTED_TO_LEAD'
                              ? '#15803d'
                              : enq.status === 'UNREAD'
                              ? '#b91c1c'
                              : '#64748b',
                        }}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      {enq.status !== 'CONVERTED_TO_LEAD' ? (
                        <button
                          onClick={() => handleConvertEnquiry(enq.id)}
                          style={{
                            background: '#0284c7',
                            border: 'none',
                            color: '#ffffff',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Convert to CRM Lead
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                          ✓ Ingested in CRM
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {enquiries.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
                      No incoming inquiries recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LEAD DETAILS DRAWER */}
      {selectedLead && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            maxWidth: '540px',
            background: '#ffffff',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* Drawer Header */}
          <div
            style={{
              padding: '1.25rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0284c7', fontSize: '0.85rem' }}>
                  {selectedLead.leadCode}
                </span>
                {selectedLead.isDemo && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      background: '#ffedd5',
                      color: '#ea580c',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      fontWeight: 800,
                    }}
                  >
                    DEMO DATA
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0.25rem 0 0 0' }}>
                {selectedLead.title}
              </h2>
            </div>
            <button
              onClick={() => setSelectedLead(null)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1.3rem',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              <HiOutlineX />
            </button>
          </div>

          {/* Drawer Content */}
          <div style={{ padding: '1.25rem', flex: 1 }}>
            {/* Stage Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>
                DEAL STAGE TRANSITION
              </label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {PIPELINE_STAGES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleUpdateStatus(selectedLead.id, s.id, s.id === 'WON')}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '4px',
                      border: '1px solid ' + (selectedLead.status === s.id ? s.color : '#cbd5e1'),
                      background: selectedLead.status === s.id ? s.color : '#ffffff',
                      color: selectedLead.status === s.id ? '#ffffff' : '#475569',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                background: '#f8fafc',
                padding: '0.9rem',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                fontSize: '0.825rem',
              }}
            >
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Estimated Value</span>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                  ₹{(selectedLead.estimatedValue || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Priority</span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{selectedLead.priority}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Contact Person</span>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>{selectedLead.contactName}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{selectedLead.contactEmail}</div>
                {selectedLead.contactPhone && (
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{selectedLead.contactPhone}</div>
                )}
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Company / Account</span>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>
                  {selectedLead.company || 'Not Specified'}
                </div>
                {selectedLead.customer && (
                  <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                    Linked: {selectedLead.customer.customerCode}
                  </div>
                )}
              </div>
            </div>

            {/* Notes / Requirement */}
            {selectedLead.notes && (
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>
                  INQUIRY / SCOPE NOTES
                </span>
                <div
                  style={{
                    background: '#f1f5f9',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: '#334155',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {selectedLead.notes}
                </div>
              </div>
            )}

            {/* Convert to Customer Button if not yet converted */}
            {!selectedLead.customerId && (
              <button
                onClick={() => handleUpdateStatus(selectedLead.id, selectedLead.status, true)}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  marginBottom: '1.5rem',
                }}
              >
                ✓ Promote & Create Customer Account
              </button>
            )}

            {/* Log Interaction / Follow-up Reminder Form */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.6rem' }}>
                Log Interaction & Next Steps
              </span>

              <form onSubmit={handleAddActivity} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem' }}>
                  <select
                    value={activityForm.type}
                    onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}
                    style={{
                      padding: '0.45rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                    }}
                  >
                    <option value="CALL">Phone Call</option>
                    <option value="EMAIL">Email Sent</option>
                    <option value="MEETING">Meeting</option>
                    <option value="NOTE">Internal Note</option>
                    <option value="PROPOSAL">Proposal</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Brief summary (e.g., Discussed cloud pricing)..."
                    value={activityForm.summary}
                    onChange={(e) => setActivityForm({ ...activityForm, summary: e.target.value })}
                    required
                    style={{
                      padding: '0.45rem 0.6rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', color: '#64748b' }}>Next Follow-up Date</label>
                    <input
                      type="date"
                      value={activityForm.followUpDate}
                      onChange={(e) => setActivityForm({ ...activityForm, followUpDate: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.4rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                      type="submit"
                      disabled={savingActivity}
                      style={{
                        width: '100%',
                        padding: '0.48rem',
                        background: '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      {savingActivity ? 'Saving...' : '+ Log Interaction'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Activity History Timeline */}
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.75rem' }}>
                Activity & Touchpoint Ledger
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedLead.activities && selectedLead.activities.length > 0 ? (
                  selectedLead.activities.map((act: any) => (
                    <div
                      key={act.id}
                      style={{
                        borderLeft: '2px solid #0284c7',
                        paddingLeft: '0.75rem',
                        fontSize: '0.8rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.7rem' }}>
                        <span>
                          <strong>{act.type}</strong> {act.user ? `by ${act.user.name || act.user.email}` : ''}
                        </span>
                        <span>{new Date(act.createdAt).toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.2rem' }}>
                        {act.summary}
                      </div>
                      {act.details && (
                        <div style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.15rem' }}>
                          {act.details}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>No activity history recorded yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW LEAD MODAL */}
      {showNewLeadModal && (
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
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Create New Deal / Lead</h3>
              <button
                onClick={() => setShowNewLeadModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                <HiOutlineX />
              </button>
            </div>

            {actionError && (
              <div
                style={{
                  background: '#fee2e2',
                  color: '#b91c1c',
                  padding: '0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  marginBottom: '1rem',
                }}
              >
                {actionError}
              </div>
            )}

            <form onSubmit={handleCreateLead} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Deal / Requirement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Cloud ERP Implementation"
                  value={leadForm.title}
                  onChange={(e) => setLeadForm({ ...leadForm, title: e.target.value })}
                  style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={leadForm.contactName}
                    onChange={(e) => setLeadForm({ ...leadForm, contactName: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Company / Org</label>
                  <input
                    type="text"
                    placeholder="Company name"
                    value={leadForm.company}
                    onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={leadForm.contactEmail}
                    onChange={(e) => setLeadForm({ ...leadForm, contactEmail: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={leadForm.contactPhone}
                    onChange={(e) => setLeadForm({ ...leadForm, contactPhone: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Estimated Value (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={leadForm.estimatedValue}
                    onChange={(e) => setLeadForm({ ...leadForm, estimatedValue: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Priority</label>
                  <select
                    value={leadForm.priority}
                    onChange={(e) => setLeadForm({ ...leadForm, priority: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  style={{
                    padding: '0.5rem 0.9rem',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW CUSTOMER MODAL */}
      {showNewCustomerModal && (
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
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Create Customer Account</h3>
              <button
                onClick={() => setShowNewCustomerModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                <HiOutlineX />
              </button>
            </div>

            {actionError && (
              <div
                style={{
                  background: '#fee2e2',
                  color: '#b91c1c',
                  padding: '0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  marginBottom: '1rem',
                }}
              >
                {actionError}
              </div>
            )}

            <form onSubmit={handleCreateCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Primary Contact Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Primary representative name"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Company / Account Name</label>
                <input
                  type="text"
                  placeholder="Registered enterprise name"
                  value={customerForm.company}
                  onChange={(e) => setCustomerForm({ ...customerForm, company: e.target.value })}
                  style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Account Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="billing@company.com"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>City</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={customerForm.city}
                    onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Website</label>
                  <input
                    type="text"
                    placeholder="https://company.com"
                    value={customerForm.website}
                    onChange={(e) => setCustomerForm({ ...customerForm, website: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowNewCustomerModal(false)}
                  style={{
                    padding: '0.5rem 0.9rem',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalShell>
  )
}
