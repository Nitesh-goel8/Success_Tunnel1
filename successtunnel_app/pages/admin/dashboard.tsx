import { useCallback, useEffect, useMemo, useState } from 'react'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import axios from 'axios'
import { getTokenFromReq, verifyToken } from '../../lib/auth'
import {
  HiOutlineBookOpen,
  HiOutlineClock,
  HiOutlineCreditCard,
  HiOutlineExternalLink,
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
  HiOutlineCollection,
  HiOutlineChartBar,
  HiOutlineLightningBolt,
  HiOutlineLink,
  HiOutlineClipboardList,
} from 'react-icons/hi'

type DashboardStats = {
  totalEnquiries: number
  totalServices: number
  totalProperties: number
  totalBlogs: number
  totalEducationContent: number
  totalUsers: number
  revenueTimeline: Array<{ label: string; value: number }>
  enquiryCategories: Array<{ label: string; value: number }>
  topServices: Array<{ label: string; value: number }>
  recentEnquiries: Array<{
    id: number
    name: string
    email: string
    phone: string
    city?: string | null
    service?: string | null
    page?: string | null
    createdAt: string
  }>
  recentPayments: Array<{
    id: number
    customerName: string
    rentalTitle: string
    amount: number
    currency: string
    status: string
    createdAt: string
  }>
  recentPosts: Array<{
    id: number
    title: string
    slug: string
    excerpt?: string | null
    publishedAt?: string | null
  }>
  recentProperties: Array<{
    id: number
    title: string
    slug: string
    city: string
    type: string
    price: number
    createdAt: string
  }>
  recentServices: Array<{
    id: number
    title: string
    slug: string
    excerpt?: string | null
    createdAt: string
  }>
  lastSyncAt?: string
}

const quickActions = [
  {
    title: 'Manage Enquiries',
    description: 'Review leads, export data, and follow up quickly.',
    href: '/admin/enquiries',
    icon: HiOutlineMail,
  },
  {
    title: 'Publish Blog',
    description: 'Create a new article or refine an existing draft.',
    href: '/admin/blogs',
    icon: HiOutlineBookOpen,
  },
  {
    title: 'Add Property',
    description: 'Create or edit listings and commercial opportunities.',
    href: '/admin/properties',
    icon: HiOutlineLocationMarker,
  },
  {
    title: 'Update Services',
    description: 'Maintain core offerings and subservice structure.',
    href: '/admin/services',
    icon: HiOutlineClipboardList,
  },
  {
    title: 'Education CMS',
    description: 'Manage learning content, PDFs, courses, and videos.',
    href: '/admin/education',
    icon: HiOutlineCollection,
  },
  {
    title: 'System Settings',
    description: 'Edit brand, contact, and integration settings.',
    href: '/admin/settings',
    icon: HiOutlineCreditCard,
  },
]

const moduleLinks = [
  { label: 'Website', href: '/', icon: HiOutlineExternalLink },
  { label: 'Services', href: '/services', icon: HiOutlineClipboardList },
  { label: 'Properties', href: '/properties', icon: HiOutlineLocationMarker },
  { label: 'Blog', href: '/blog', icon: HiOutlineBookOpen },
  { label: 'Education', href: '/education', icon: HiOutlineCollection },
  { label: 'Resources', href: '/resources', icon: HiOutlineViewGrid },
]

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = false,
}: {
  label: string
  value: string | number
  hint: string
  icon: any
  accent?: boolean
}) {
  return (
    <div
      className="admin-card"
      style={{
        padding: '22px 24px',
        background: accent ? 'linear-gradient(135deg, #0b3a86, #165df5)' : 'var(--surface)',
        color: accent ? '#fff' : 'inherit',
        border: accent ? 'none' : '1px solid var(--line)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, opacity: accent ? 0.85 : 0.68, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {label}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.08, marginTop: 10, fontFamily: "'Sora', sans-serif" }}>
            {value}
          </div>
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            display: 'grid',
            placeItems: 'center',
            background: accent ? 'rgba(255,255,255,.14)' : 'rgba(22,93,245,.08)',
            color: accent ? '#fff' : 'var(--accent)',
            flexShrink: 0,
          }}
        >
          <Icon size={22} />
        </div>
      </div>
      <div style={{ marginTop: 14, fontSize: '0.9rem', opacity: accent ? 0.88 : 0.75, lineHeight: 1.5 }}>
        {hint}
      </div>
    </div>
  )
}

export default function Admin() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEnquiries: 0,
    totalServices: 0,
    totalProperties: 0,
    totalBlogs: 0,
    totalEducationContent: 0,
    totalUsers: 0,
    revenueTimeline: [],
    enquiryCategories: [],
    topServices: [],
    recentEnquiries: [],
    recentPayments: [],
    recentPosts: [],
    recentProperties: [],
    recentServices: [],
    lastSyncAt: undefined,
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const fetchStats = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true)
    else setLoading(true)

    try {
      const response = await axios.get('/api/admin/stats')
      setStats(response.data)
      setLastUpdated(new Date().toLocaleString())
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = window.setInterval(() => fetchStats(true), 120000)
    return () => window.clearInterval(interval)
  }, [fetchStats])

  const visibleQuickActions = useMemo(
    () =>
      quickActions.filter(action =>
        [action.title, action.description, action.href].join(' ').toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  )

  const activeLeads = stats.recentEnquiries.length
  const recentRevenue = stats.revenueTimeline.reduce((sum, point) => sum + point.value, 0)
  const topService = stats.topServices.find(item => item.value > 0)?.label || 'Not enough data yet'

  return (
    <div>
      <Nav />
      <main className="admin-shell">
        <div className="container">
          <div
            className="admin-card"
            style={{
              marginBottom: 28,
              padding: '28px',
              background: 'linear-gradient(135deg, #081b3a 0%, #0b3a86 45%, #165df5 100%)',
              color: '#fff',
              border: 'none',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at top right, rgba(255,255,255,.18), transparent 28%), radial-gradient(circle at bottom left, rgba(255,255,255,.12), transparent 25%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{ maxWidth: 760 }}>
                  <span
                    className="eyebrow"
                    style={{
                      color: '#fff',
                      background: 'rgba(255,255,255,.14)',
                      padding: '5px 12px',
                      borderRadius: 999,
                      border: '1px solid rgba(255,255,255,.18)',
                    }}
                  >
                    ADMIN COMMAND CENTER
                  </span>
                  <h1 style={{ margin: '14px 0 10px', fontSize: 'clamp(2.1rem, 4vw, 3.5rem)', lineHeight: 1.02, letterSpacing: '-.05em', fontWeight: 900, color: '#fff', textShadow: '0 2px 14px rgba(0,0,0,0.18)' }}>
                    Run the site from one premium workspace.
                  </h1>
                  <div style={{ height: 8 }} />
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => fetchStats(true)}
                    className="btn btn-secondary"
                    style={{ background: 'rgba(255,255,255,.12)', color: '#fff', borderColor: 'rgba(255,255,255,.22)' }}
                  >
                    <HiOutlineRefresh />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </button>
                  <Link href="/" className="btn btn-secondary" style={{ background: 'rgba(255,255,255,.12)', color: '#fff', borderColor: 'rgba(255,255,255,.22)' }}>
                    <HiOutlineExternalLink />
                    View site
                  </Link>
                  <Link href="/admin/settings" className="btn btn-primary" style={{ background: '#fff', color: 'var(--primary)' }}>
                    <HiOutlineLink />
                    Open settings
                  </Link>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 14,
                  marginTop: 6,
                }}
              >
                <div style={{ padding: '14px 16px', borderRadius: 18, background: 'rgba(255,255,255,.11)', border: '1px solid rgba(255,255,255,.15)' }}>
                  <div style={{ fontSize: '.82rem', opacity: .85, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <HiOutlineClock />
                    Last sync
                  </div>
                  <div style={{ marginTop: 8, fontSize: '1rem', fontWeight: 700 }}>{lastUpdated || 'Loading…'}</div>
                </div>
                <div style={{ padding: '14px 16px', borderRadius: 18, background: 'rgba(255,255,255,.11)', border: '1px solid rgba(255,255,255,.15)' }}>
                  <div style={{ fontSize: '.82rem', opacity: .85, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>Top service</div>
                  <div style={{ marginTop: 8, fontSize: '1rem', fontWeight: 700 }}>{loading ? '...' : topService}</div>
                </div>
                <div style={{ padding: '14px 16px', borderRadius: 18, background: 'rgba(255,255,255,.11)', border: '1px solid rgba(255,255,255,.15)' }}>
                  <div style={{ fontSize: '.82rem', opacity: .85, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>Monthly revenue</div>
                  <div style={{ marginTop: 8, fontSize: '1rem', fontWeight: 700 }}>₹{recentRevenue.toLocaleString('en-IN')}</div>
                </div>
                <div style={{ padding: '14px 16px', borderRadius: 18, background: 'rgba(255,255,255,.11)', border: '1px solid rgba(255,255,255,.15)' }}>
                  <div style={{ fontSize: '.82rem', opacity: .85, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>Active leads</div>
                  <div style={{ marginTop: 8, fontSize: '1rem', fontWeight: 700 }}>{activeLeads}</div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 18,
              marginBottom: 28,
            }}
          >
            <StatCard label="Total Leads" value={loading ? '...' : stats.totalEnquiries} hint="Incoming enquiries captured by the site." icon={HiOutlineMail} accent />
            <StatCard label="Services" value={loading ? '...' : stats.totalServices} hint="Core offers and subservice coverage." icon={HiOutlineBookOpen} />
            <StatCard label="Properties" value={loading ? '...' : stats.totalProperties} hint="Published real estate and rental listings." icon={HiOutlineLocationMarker} />
            <StatCard label="Blogs" value={loading ? '...' : stats.totalBlogs} hint="Editorial and advisory content published." icon={HiOutlineUserGroup} />
            <StatCard label="Education" value={loading ? '...' : stats.totalEducationContent} hint="Notes, videos, PDFs, and learning content." icon={HiOutlineCollection} />
            <StatCard label="Team Users" value={loading ? '...' : stats.totalUsers} hint="Admin users currently available in the system." icon={HiOutlineCreditCard} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 28 }}>
            <div className="admin-card" style={{ padding: 26 }}>
              <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 18px' }}>
                <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <HiOutlineChartBar />
                  Performance
                </span>
                <h2 style={{ fontSize: '1.45rem', marginTop: 10 }}>Revenue and lead intelligence</h2>
                <p>Use the charts to spot patterns in payments and enquiry flow.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 20, padding: 20 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}>Revenue Timeline</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 16 }}>Captured payments trend over the last six months.</p>
                  <div style={{ position: 'relative', height: 190 }}>
                    {stats.revenueTimeline.length > 0 ? (
                      (() => {
                        const maxVal = Math.max(...stats.revenueTimeline.map(point => point.value), 1000)
                        const points = stats.revenueTimeline
                          .map((point, index) => {
                            const x = (index / (stats.revenueTimeline.length - 1)) * 400 + 50
                            const y = 140 - (point.value / maxVal) * 100
                            return `${x},${y}`
                          })
                          .join(' ')

                        const fillPoints = `${50},140 ${points} ${450},140`

                        return (
                          <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%' }}>
                            <line x1="50" y1="40" x2="450" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="50" y1="90" x2="450" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="50" y1="140" x2="450" y2="140" stroke="#cbd5e1" strokeWidth="1.5" />
                            <polygon points={fillPoints} fill="rgba(22, 93, 245, 0.08)" />
                            <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            {stats.revenueTimeline.map((point, index) => {
                              const x = (index / (stats.revenueTimeline.length - 1)) * 400 + 50
                              const y = 140 - (point.value / maxVal) * 100
                              return (
                                <g key={index}>
                                  <circle cx={x} cy={y} r="5" fill="#fff" stroke="var(--accent)" strokeWidth="2.5" />
                                  <text x={x} y={y - 12} textAnchor="middle" style={{ fontSize: '9px', fontWeight: 700, fill: 'var(--primary)' }}>
                                    ₹{point.value >= 1000 ? `${(point.value / 1000).toFixed(1)}k` : point.value}
                                  </text>
                                  <text x={x} y="158" textAnchor="middle" style={{ fontSize: '10px', fill: 'var(--muted)', fontWeight: 600 }}>
                                    {point.label}
                                  </text>
                                </g>
                              )
                            })}
                          </svg>
                        )
                      })()
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)' }}>
                        No payment data available.
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 20, padding: 20 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}>Lead Distribution</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 16 }}>Enquiries categorized by service requested.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {stats.enquiryCategories.length > 0 ? (
                      stats.enquiryCategories.map(category => {
                        const maxLeads = Math.max(...stats.enquiryCategories.map(item => item.value), 1)
                        const pct = (category.value / maxLeads) * 100
                        return (
                          <div key={category.label} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 30px', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {category.label}
                            </span>
                            <div style={{ background: '#f1f5f9', height: '10px', borderRadius: '999px', overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0b3a86, #165df5)', height: '100%', borderRadius: '999px' }} />
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textAlign: 'right' }}>{category.value}</span>
                          </div>
                        )
                      })
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120, color: 'var(--muted)' }}>
                        No leads data available.
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 18, padding: 16, borderRadius: 16, background: 'rgba(22,93,245,.06)', border: '1px solid rgba(22,93,245,.12)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, color: 'var(--primary)', fontWeight: 800 }}>
                      <HiOutlineLightningBolt />
                      Top categories
                    </div>
                    <div style={{ display: 'grid', gap: 8 }}>
                      {stats.topServices.filter(item => item.value > 0).slice(0, 3).map(item => (
                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                          <span>{item.label}</span>
                          <strong>{item.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 24 }}>
              <div className="admin-card" style={{ padding: 24 }}>
                <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 18px' }}>
                  <span className="eyebrow">Search</span>
                  <h2 style={{ fontSize: '1.2rem', marginTop: 10 }}>Quick action finder</h2>
                  <p>Search tools and shortcuts in one place.</p>
                </div>
                <div style={{ position: 'relative' }}>
                  <HiOutlineSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search admin tools..."
                    style={{
                      width: '100%',
                      padding: '13px 16px 13px 42px',
                      borderRadius: 14,
                      border: '1px solid var(--line)',
                      background: 'var(--surface)',
                      fontFamily: 'inherit',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
                  {moduleLinks.map(link => {
                    const Icon = link.icon
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '10px 14px',
                          borderRadius: 999,
                          border: '1px solid var(--line)',
                          textDecoration: 'none',
                          color: 'var(--primary)',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          background: 'var(--surface)',
                        }}
                      >
                        <Icon size={16} />
                        {link.label}
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className="admin-card" style={{ padding: 24 }}>
                <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 18px' }}>
                  <span className="eyebrow">Quick actions</span>
                  <h2 style={{ fontSize: '1.2rem', marginTop: 10 }}>Launch common tasks</h2>
                  <p>Jump straight into the most-used admin workflows.</p>
                </div>

                <div style={{ display: 'grid', gap: 14 }}>
                  {visibleQuickActions.map(action => {
                    const Icon = action.icon
                    return (
                      <Link
                        key={action.title}
                        href={action.href}
                        className="admin-card"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          textDecoration: 'none',
                          padding: 16,
                          borderRadius: 18,
                          boxShadow: 'none',
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 14,
                            display: 'grid',
                            placeItems: 'center',
                            background: 'rgba(22,93,245,.08)',
                            color: 'var(--accent)',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={20} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{action.title}</div>
                          <div style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{action.description}</div>
                        </div>
                      </Link>
                    )
                  })}
                  {visibleQuickActions.length === 0 && (
                    <div style={{ color: 'var(--muted)', fontSize: '0.92rem', textAlign: 'center', padding: '10px 0' }}>
                      No tools match your search.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
            <div className="admin-card" style={{ padding: 24 }}>
              <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 18px' }}>
                <span className="eyebrow">Activity</span>
                <h2 style={{ fontSize: '1.2rem', marginTop: 10 }}>Recent enquiries</h2>
                <p>The latest leads arriving from the public site.</p>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                {stats.recentEnquiries.length > 0 ? (
                  stats.recentEnquiries.map(enquiry => (
                    <div
                      key={enquiry.id}
                      style={{
                        padding: 16,
                        borderRadius: 16,
                        border: '1px solid var(--line)',
                        background: 'var(--surface)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{enquiry.name}</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: 4 }}>
                            {enquiry.service || 'General enquiry'} {enquiry.city ? `• ${enquiry.city}` : ''}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 8 }}>
                            {enquiry.email} · {enquiry.phone}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--muted)' }}>
                          {new Date(enquiry.createdAt).toLocaleDateString()}
                          <div style={{ marginTop: 4, padding: '4px 8px', borderRadius: 999, background: 'rgba(22,93,245,.08)', color: 'var(--accent)', fontWeight: 700 }}>
                            {enquiry.page || 'site'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>No enquiries yet.</div>
                )}
              </div>
            </div>

            <div className="admin-card" style={{ padding: 24 }}>
              <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 18px' }}>
                <span className="eyebrow">Ledger</span>
                <h2 style={{ fontSize: '1.2rem', marginTop: 10 }}>Recent payments</h2>
                <p>Track the latest booking and rental payment activity.</p>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                {stats.recentPayments.length > 0 ? (
                  stats.recentPayments.map(payment => (
                    <div
                      key={payment.id}
                      style={{
                        padding: 16,
                        borderRadius: 16,
                        border: '1px solid var(--line)',
                        background: 'var(--surface)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{payment.customerName}</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: 4 }}>
                            {payment.rentalTitle}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 8 }}>
                            {payment.status.toUpperCase()} · {new Date(payment.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1.05rem' }}>
                            ₹{payment.amount.toLocaleString('en-IN')}
                          </div>
                          <div style={{ marginTop: 8, padding: '4px 8px', borderRadius: 999, background: 'rgba(22,93,245,.08)', color: 'var(--accent)', fontWeight: 700, fontSize: '0.78rem' }}>
                            {payment.currency}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>No payments recorded yet.</div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 28 }}>
            <div className="admin-card" style={{ padding: 24 }}>
              <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 18px' }}>
                <span className="eyebrow">Content queue</span>
                <h2 style={{ fontSize: '1.2rem', marginTop: 10 }}>Recent posts</h2>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {stats.recentPosts.length > 0 ? stats.recentPosts.map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit', padding: 14, borderRadius: 14, border: '1px solid var(--line)', background: 'var(--surface)' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{post.title}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 6 }}>{post.excerpt || 'Blog post draft or published article.'}</div>
                  </Link>
                )) : <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '12px 0' }}>No blog posts yet.</div>}
              </div>
            </div>

            <div className="admin-card" style={{ padding: 24 }}>
              <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 18px' }}>
                <span className="eyebrow">Listings</span>
                <h2 style={{ fontSize: '1.2rem', marginTop: 10 }}>Recent properties</h2>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {stats.recentProperties.length > 0 ? stats.recentProperties.map(property => (
                  <Link key={property.id} href={`/properties/${property.slug}`} style={{ textDecoration: 'none', color: 'inherit', padding: 14, borderRadius: 14, border: '1px solid var(--line)', background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{property.title}</div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 6 }}>{property.type} · {property.city}</div>
                      </div>
                      <strong style={{ color: 'var(--primary)' }}>₹{property.price.toLocaleString('en-IN')}</strong>
                    </div>
                  </Link>
                )) : <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '12px 0' }}>No properties yet.</div>}
              </div>
            </div>

            <div className="admin-card" style={{ padding: 24 }}>
              <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 18px' }}>
                <span className="eyebrow">Modules</span>
                <h2 style={{ fontSize: '1.2rem', marginTop: 10 }}>Module shortcuts</h2>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {moduleLinks.map(module => {
                  const Icon = module.icon
                  return (
                    <Link key={module.label} href={module.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '13px 14px', borderRadius: 14, border: '1px solid var(--line)', textDecoration: 'none', color: 'var(--primary)', background: 'var(--surface)', fontWeight: 700 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Icon size={18} style={{ color: 'var(--accent)' }} />
                        {module.label}
                      </span>
                      <HiOutlineExternalLink size={16} style={{ color: 'var(--muted)' }} />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24 }}>
            <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 18px' }}>
              <span className="eyebrow">Workflow</span>
              <h2 style={{ fontSize: '1.2rem', marginTop: 10 }}>Action plan for the day</h2>
              <p>Use this as a practical checklist when you log in.</p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 14,
              }}
            >
              {[
                { step: '1', title: 'Review new enquiries', text: 'Start with the newest leads and identify anything urgent.' },
                { step: '2', title: 'Publish content', text: 'Move one article, listing, or education item closer to launch.' },
                { step: '3', title: 'Check revenue', text: 'Confirm payment status and any booking activity.' },
                { step: '4', title: 'Update settings', text: 'Keep contact, branding, and integrations current.' },
              ].map(item => (
                <div key={item.step} style={{ padding: 18, borderRadius: 16, background: 'linear-gradient(180deg, rgba(22,93,245,.05), rgba(22,93,245,.02))', border: '1px solid rgba(22,93,245,.12)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, display: 'grid', placeItems: 'center', background: 'rgba(22,93,245,.1)', color: 'var(--accent)', fontWeight: 800, marginBottom: 12 }}>
                    {item.step}
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{item.title}</div>
                  <p style={{ margin: '10px 0 0', color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = getTokenFromReq(req as any)
  const payload = verifyToken(token as string)
  if (!payload) return { redirect: { destination: '/admin/login', permanent: false } }
  return { props: {} }
}
