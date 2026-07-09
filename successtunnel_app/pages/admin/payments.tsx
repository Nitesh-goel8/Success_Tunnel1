import { useEffect, useState } from 'react'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import axios from 'axios'
import { GetServerSideProps } from 'next'

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async (statusFilter = '') => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/admin/payments${statusFilter ? `?status=${statusFilter}` : ''}`)
      setPayments(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(filter)
  }, [filter])

  const handleFilterChange = (status: string) => {
    setFilter(status)
  }

  const exportCsv = () => {
    window.location.href = `/api/admin/payments?export=csv${filter ? `&status=${filter}` : ''}`
  }

  return (
    <div>
      <Nav />
      <main className="admin-shell">
        <div className="container">
          <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 22px' }}>
            <span className="eyebrow">Admin CMS</span>
            <h2>Rental Space Payments</h2>
            <p>Monitor transactions and token deposits processed via the Razorpay gateway.</p>
          </div>

          <div className="admin-card" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`btn ${filter === '' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px', fontSize: '0.88rem', borderRadius: '10px' }}
                onClick={() => handleFilterChange('')}
                type="button"
              >
                All Transactions
              </button>
              <button
                className={`btn ${filter === 'paid' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px', fontSize: '0.88rem', borderRadius: '10px' }}
                onClick={() => handleFilterChange('paid')}
                type="button"
              >
                Paid
              </button>
              <button
                className={`btn ${filter === 'created' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px', fontSize: '0.88rem', borderRadius: '10px' }}
                onClick={() => handleFilterChange('created')}
                type="button"
              >
                Created
              </button>
              <button
                className={`btn ${filter === 'failed' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px', fontSize: '0.88rem', borderRadius: '10px' }}
                onClick={() => handleFilterChange('failed')}
                type="button"
              >
                Failed
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.88rem', borderRadius: '10px' }}
                onClick={exportCsv}
                type="button"
              >
                Export CSV
              </button>
              <button
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.88rem', borderRadius: '10px' }}
                onClick={() => load(filter)}
                type="button"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="admin-card" style={{ overflowX: 'auto' }}>
            {loading ? (
              <p>Loading transactions...</p>
            ) : (
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--line)', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>ID</th>
                    <th style={{ padding: '12px' }}>Customer Details</th>
                    <th style={{ padding: '12px' }}>Rental Asset</th>
                    <th style={{ padding: '12px' }}>Order / Payment IDs</th>
                    <th style={{ padding: '12px' }}>Amount (INR)</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Date</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--line)', fontSize: '0.92rem' }}>
                      <td style={{ padding: '16px 12px' }}>{item.id}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{item.customerName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{item.customerEmail}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{item.customerPhone}</div>
                      </td>
                      <td style={{ padding: '16px 12px', fontWeight: 500 }}>{item.rentalTitle}</td>
                      <td style={{ padding: '16px 12px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        <div>Order: {item.orderId}</div>
                        {item.paymentId && <div style={{ color: 'green' }}>PayId: {item.paymentId}</div>}
                      </td>
                      <td style={{ padding: '16px 12px', fontWeight: 700, color: 'var(--primary)' }}>
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background:
                              item.status === 'paid' || item.status === 'captured'
                                ? 'rgba(16, 185, 129, 0.12)'
                                : item.status === 'failed'
                                ? 'rgba(239, 68, 68, 0.12)'
                                : 'rgba(245, 158, 11, 0.12)',
                            color:
                              item.status === 'paid' || item.status === 'captured'
                                ? '#059669'
                                : item.status === 'failed'
                                ? '#dc2626'
                                : '#d97706'
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', color: 'var(--muted)' }}>
                        {new Date(item.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        {item.status === 'captured' || item.status === 'paid' ? (
                          <a
                            href={`/client/invoice?paymentId=${item.paymentId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none', fontSize: '0.85rem' }}
                          >
                            Invoice 🖨️
                          </a>
                        ) : (
                          <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)' }}>
                        No payment records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { getTokenFromReq, verifyToken } = await import('../../lib/auth')
  const token = getTokenFromReq(req as any)
  const payload = verifyToken(token as string)
  if (!payload) return { redirect: { destination: '/admin/login', permanent: false } }
  return { props: {} }
}
