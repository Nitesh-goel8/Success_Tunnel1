import { GetServerSideProps } from 'next'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

interface Enquiry {
  id: number
  name: string
  email: string
  phone: string
  city: string | null
  service: string | null
  message: string | null
  createdAt: string
}

interface RentalPayment {
  id: number
  orderId: string
  paymentId: string | null
  customerName: string
  customerEmail: string
  customerPhone: string
  rentalTitle: string
  amount: number
  currency: string
  status: string
  createdAt: string
}

interface ClientUser {
  name: string
  email: string
  createdAt: string
}

interface DashboardProps {
  initialUser: ClientUser
}

export default function ClientDashboard({ initialUser }: DashboardProps) {
  const router = useRouter()
  const [data, setData] = useState<{ user: ClientUser; enquiries: Enquiry[]; payments: RentalPayment[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'payments' | 'enquiries'>('payments')

  useEffect(() => {
    async function fetchPortalData() {
      try {
        const res = await axios.get('/api/client/portal-data')
        setData(res.data)
      } catch (err) {
        console.error('Failed to load portal data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPortalData()
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post('/api/client/logout')
      router.push('/client/login')
    } catch (err) {
      console.error('Logout error', err)
    }
  }

  if (loading) {
    return (
      <div>
        <Nav />
        <main style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--accent)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <h3 style={{ fontWeight: 700, color: 'var(--primary)' }}>Loading Client Dashboard...</h3>
          </div>
        </main>
        <Footer />
        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div>
      <Nav />
      <main className="admin-shell" style={{ background: '#f8fafc', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700 }}>
                CUSTOMER PORTAL
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '12px' }}>
                Hello, {data?.user?.name || initialUser.name}!
              </h2>
              <p style={{ color: 'var(--muted)', marginTop: '4px' }}>Manage bookings, invoices, and enquiries from one workspace.</p>
            </div>
            
            <button
              onClick={handleLogout}
              style={{ background: 'transparent', border: '1px solid #fee2e2', color: '#dc2626', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              Sign Out
            </button>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '18px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--muted)', fontWeight: 600 }}>Active Space Bookings</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '8px', color: 'var(--accent)', fontFamily: "'Sora', sans-serif" }}>
                {data?.payments.filter(p => p.status === 'captured').length || 0}
              </div>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '18px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--muted)', fontWeight: 600 }}>Submitted Enquiries</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '8px', color: 'var(--primary)', fontFamily: "'Sora', sans-serif" }}>
                {data?.enquiries.length || 0}
              </div>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '18px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--muted)', fontWeight: 600 }}>Need more spaces?</span>
              <Link href="/services/rental-space" style={{ display: 'inline-block', marginTop: '12px', background: 'linear-gradient(135deg, #0b3a86, #165df5)', color: '#fff', textAlign: 'center', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
                + Book Rental Space
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '14px', borderBottom: '1px solid var(--line)', marginBottom: '28px', paddingBottom: '12px' }}>
            <button
              onClick={() => setActiveTab('payments')}
              style={{
                background: 'transparent',
                border: 'none',
                color: activeTab === 'payments' ? 'var(--accent)' : 'var(--muted)',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                padding: '8px 16px',
                borderBottom: activeTab === 'payments' ? '3px solid var(--accent)' : '3px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              💼 Space Bookings &amp; Payments
            </button>
            <button
              onClick={() => setActiveTab('enquiries')}
              style={{
                background: 'transparent',
                border: 'none',
                color: activeTab === 'enquiries' ? 'var(--accent)' : 'var(--muted)',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                padding: '8px 16px',
                borderBottom: activeTab === 'enquiries' ? '3px solid var(--accent)' : '3px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              ✉️ Submitted Enquiries
            </button>
          </div>

          {/* TAB CONTENT: PAYMENTS */}
          {activeTab === 'payments' && (
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              {data?.payments && data.payments.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--line)' }}>
                        <th style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--primary)' }}>Date</th>
                        <th style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--primary)' }}>Space / Service</th>
                        <th style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--primary)' }}>Order ID</th>
                        <th style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--primary)' }}>Amount</th>
                        <th style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--primary)' }}>Status</th>
                        <th style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--primary)' }}>Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.payments.map((payment) => (
                        <tr key={payment.id} style={{ borderBottom: '1px solid var(--line)', transition: 'background 0.2s' }}>
                          <td style={{ padding: '18px 24px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                            {new Date(payment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--primary)' }}>
                            {payment.rentalTitle}
                          </td>
                          <td style={{ padding: '18px 24px', color: 'var(--muted)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                            {payment.orderId}
                          </td>
                          <td style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--primary)' }}>
                            ₹{payment.amount.toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '18px 24px' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '999px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              background: payment.status === 'captured' ? '#e6fffa' : payment.status === 'failed' ? '#fde8e8' : '#fef3c7',
                              color: payment.status === 'captured' ? '#008767' : payment.status === 'failed' ? '#9b1c1c' : '#92400e'
                            }}>
                              {payment.status === 'captured' ? 'Success' : payment.status}
                            </span>
                          </td>
                          <td style={{ padding: '18px 24px' }}>
                            {payment.status === 'captured' ? (
                              <Link
                                href={`/client/invoice?paymentId=${payment.paymentId}`}
                                target="_blank"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}
                              >
                                View Invoice 🖨️
                              </Link>
                            ) : (
                              <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>N/A</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏬</div>
                  <h3>No bookings found</h3>
                  <p style={{ marginTop: '8px' }}>Your space rental payments and bookings will appear here.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              {data?.enquiries && data.enquiries.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--line)' }}>
                        <th style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--primary)' }}>Date</th>
                        <th style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--primary)' }}>Requested Service</th>
                        <th style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--primary)' }}>Context Message</th>
                        <th style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--primary)' }}>Region</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.enquiries.map((enquiry) => (
                        <tr key={enquiry.id} style={{ borderBottom: '1px solid var(--line)' }}>
                          <td style={{ padding: '18px 24px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                            {new Date(enquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--primary)' }}>
                            {enquiry.service || 'General Enquiry'}
                          </td>
                          <td style={{ padding: '18px 24px', color: 'var(--muted)', fontSize: '0.92rem', maxWidth: '350px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {enquiry.message || '—'}
                          </td>
                          <td style={{ padding: '18px 24px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                            {enquiry.city || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✉️</div>
                  <h3>No enquiries submitted</h3>
                  <p style={{ marginTop: '8px' }}>Send us an enquiry from our Contact page or service cards, and it will be recorded here.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookie = req.headers.cookie || ''
  const match = cookie.split(';').map(s => s.trim()).find(s => s.startsWith('st_client_auth='))
  
  if (!match) {
    return { redirect: { destination: '/client/login', permanent: false } }
  }

  const token = match.split('=')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any
    return {
      props: {
        initialUser: {
          name: payload.name || 'Valued Client',
          email: payload.email,
        }
      }
    }
  } catch (err) {
    return { redirect: { destination: '/client/login', permanent: false } }
  }
}
