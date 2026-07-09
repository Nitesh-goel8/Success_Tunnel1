import { useEffect, useState } from 'react'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import axios from 'axios'
import { getTokenFromReq, verifyToken } from '../../lib/auth'
import { HiOutlineUserGroup, HiOutlineBookOpen, HiOutlineLocationMarker, HiOutlineCreditCard, HiOutlineCog, HiOutlineMail } from 'react-icons/hi'

export default function Admin() {
  const [stats, setStats] = useState<{
    totalEnquiries: number
    totalServices: number
    totalProperties: number
    totalBlogs: number
    revenueTimeline: Array<{ label: string; value: number }>
    enquiryCategories: Array<{ label: string; value: number }>
  }>({
    totalEnquiries: 0,
    totalServices: 0,
    totalProperties: 0,
    totalBlogs: 0,
    revenueTimeline: [],
    enquiryCategories: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await axios.get('/api/admin/stats')
        setStats(response.data)
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div>
      <Nav />
      <main className="admin-shell">
        <div className="container">
          <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 28px' }}>
            <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700 }}>
              ADMIN CONSOLE V2
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '12px' }}>
              Dashboard Overview
            </h2>
            <p style={{ color: 'var(--muted)' }}>Real-time site management tools and activity counters.</p>
          </div>

          {/* Stats Bar */}
          <div className="admin-stats-grid-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div className="admin-stat-summary-card" style={{ background: 'linear-gradient(135deg, #0b3a86, #165df5)', color: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 10px 25px rgba(22, 93, 245, 0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.85 }}>Total Leads</span>
                <HiOutlineMail size={24} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '12px', fontFamily: "'Sora', sans-serif" }}>
                {loading ? '...' : stats.totalEnquiries}
              </div>
            </div>

            <div className="admin-stat-summary-card" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '18px', padding: '24px', boxShadow: 'var(--shadow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--muted)' }}>Services Offered</span>
                <HiOutlineBookOpen size={24} style={{ color: 'var(--accent)' }} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '12px', color: 'var(--primary)', fontFamily: "'Sora', sans-serif" }}>
                {loading ? '...' : stats.totalServices}
              </div>
            </div>

            <div className="admin-stat-summary-card" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '18px', padding: '24px', boxShadow: 'var(--shadow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--muted)' }}>Active Properties</span>
                <HiOutlineLocationMarker size={24} style={{ color: 'var(--accent)' }} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '12px', color: 'var(--primary)', fontFamily: "'Sora', sans-serif" }}>
                {loading ? '...' : stats.totalProperties}
              </div>
            </div>

            <div className="admin-stat-summary-card" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '18px', padding: '24px', boxShadow: 'var(--shadow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--muted)' }}>Articles Published</span>
                <HiOutlineUserGroup size={24} style={{ color: 'var(--accent)' }} />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '12px', color: 'var(--primary)', fontFamily: "'Sora', sans-serif" }}>
                {loading ? '...' : stats.totalBlogs}
              </div>
            </div>
          </div>

          {/* Visual Reports & Analytics Section */}
          {!loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              
              {/* Chart 1: Revenue Timeline (Area Chart) */}
              <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow)' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px' }}>Revenue Timeline</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '24px' }}>Captured payments trend (last 6 months)</p>
                
                <div style={{ position: 'relative', height: '180px' }}>
                  {stats.revenueTimeline && stats.revenueTimeline.length > 0 ? (() => {
                    const maxVal = Math.max(...stats.revenueTimeline.map(d => d.value), 1000)
                    const points = stats.revenueTimeline.map((d, i) => {
                      const x = (i / (stats.revenueTimeline.length - 1)) * 400 + 50
                      const y = 140 - (d.value / maxVal) * 100
                      return `${x},${y}`
                    }).join(' ')

                    const fillPoints = `${50},140 ${points} ${450},140`

                    return (
                      <svg viewBox="0 0 500 180" style={{ width: '100%', height: '100%' }}>
                        {/* Grid lines */}
                        <line x1="50" y1="40" x2="450" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="50" y1="90" x2="450" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="50" y1="140" x2="450" y2="140" stroke="#cbd5e1" strokeWidth="1.5" />

                        {/* Area Fill */}
                        <polygon points={fillPoints} fill="rgba(22, 93, 245, 0.08)" />

                        {/* Trend line */}
                        <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Dots & Tooltip labels */}
                        {stats.revenueTimeline.map((d, i) => {
                          const x = (i / (stats.revenueTimeline.length - 1)) * 400 + 50
                          const y = 140 - (d.value / maxVal) * 100
                          return (
                            <g key={i}>
                              <circle cx={x} cy={y} r="5" fill="#fff" stroke="var(--accent)" strokeWidth="2.5" />
                              <text x={x} y={y - 12} textAnchor="middle" style={{ fontSize: '9px', fontWeight: 700, fill: 'var(--primary)' }}>
                                ₹{d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : d.value}
                              </text>
                              <text x={x} y="158" textAnchor="middle" style={{ fontSize: '10px', fill: 'var(--muted)', fontWeight: 600 }}>
                                {d.label}
                              </text>
                            </g>
                          )
                        })}
                      </svg>
                    )
                  })() : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)' }}>
                      No payment data available.
                    </div>
                  )}
                </div>
              </div>

              {/* Chart 2: Leads by Category (Horizontal Bar Chart) */}
              <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow)' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px' }}>Lead Distribution</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '20px' }}>Enquiries categorized by service requested</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stats.enquiryCategories && stats.enquiryCategories.length > 0 ? (() => {
                    const maxLeads = Math.max(...stats.enquiryCategories.map(c => c.value), 1)
                    return stats.enquiryCategories.map((c, i) => {
                      const pct = (c.value / maxLeads) * 100
                      return (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 30px', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.label}
                          </span>
                          <div style={{ background: '#f1f5f9', height: '10px', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0b3a86, #165df5)', height: '100%', borderRadius: '999px', transition: 'width 0.6s ease' }} />
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textAlign: 'right' }}>
                            {c.value}
                          </span>
                        </div>
                      )
                    })
                  })() : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: 'var(--muted)' }}>
                      No leads data available.
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <Link href="/admin/enquiries" className="admin-card" style={{ padding: '28px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '20px', transition: 'all 0.2s' }}>
              <div className="service-card-kicker" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Leads</div>
              <h3 style={{ marginTop: 12, color: 'var(--primary)', fontWeight: 800 }}>Manage Enquiries</h3>
              <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: '0.92rem' }}>Review incoming customer inquiries, export to CSV and search leads.</p>
            </Link>

            <Link href="/admin/payments" className="admin-card" style={{ padding: '28px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '20px', transition: 'all 0.2s' }}>
              <div className="service-card-kicker" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Finance</div>
              <h3 style={{ marginTop: 12, color: 'var(--primary)', fontWeight: 800 }}>Track Payments</h3>
              <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: '0.92rem' }}>View, sort and audit Razorpay token payments for rental spaces.</p>
            </Link>

            <Link href="/admin/services" className="admin-card" style={{ padding: '28px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '20px', transition: 'all 0.2s' }}>
              <div className="service-card-kicker" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Content</div>
              <h3 style={{ marginTop: 12, color: 'var(--primary)', fontWeight: 800 }}>Manage Services</h3>
              <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: '0.92rem' }}>Update core service offerings, add subservices, tax brackets, and details.</p>
            </Link>

            <Link href="/admin/properties" className="admin-card" style={{ padding: '28px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '20px', transition: 'all 0.2s' }}>
              <div className="service-card-kicker" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Listings</div>
              <h3 style={{ marginTop: 12, color: 'var(--primary)', fontWeight: 800 }}>Manage Properties</h3>
              <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: '0.92rem' }}>Add, remove or update listings and detailed commercial assets.</p>
            </Link>

            <Link href="/admin/blogs" className="admin-card" style={{ padding: '28px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '20px', transition: 'all 0.2s' }}>
              <div className="service-card-kicker" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Publications</div>
              <h3 style={{ marginTop: 12, color: 'var(--primary)', fontWeight: 800 }}>Manage Blogs</h3>
              <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: '0.92rem' }}>Publish new advisory insights, restructure guides and articles.</p>
            </Link>

            <Link href="/admin/settings" className="admin-card" style={{ padding: '28px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '20px', transition: 'all 0.2s' }}>
              <div className="service-card-kicker" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>System</div>
              <h3 style={{ marginTop: 12, color: 'var(--primary)', fontWeight: 800 }}>Site Settings</h3>
              <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: '0.92rem' }}>Modify contact details, social links, working hours, and Razorpay toggle.</p>
            </Link>
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
