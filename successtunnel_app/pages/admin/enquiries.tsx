import { useEffect, useState } from 'react'
import axios from 'axios'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { GetServerSideProps } from 'next'

export default function AdminEnquiries() {
  const [list, setList] = useState<any[]>([])
  const [filteredList, setFilteredList] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [serviceFilter, setServiceFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/admin/enquiries')
      setList(response.data)
      setFilteredList(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    let result = list

    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter(item => 
        (item.name || '').toLowerCase().includes(query) ||
        (item.email || '').toLowerCase().includes(query) ||
        (item.phone || '').toLowerCase().includes(query) ||
        (item.city || '').toLowerCase().includes(query) ||
        (item.message || '').toLowerCase().includes(query)
      )
    }

    if (serviceFilter) {
      result = result.filter(item => 
        (item.service || '').toLowerCase() === serviceFilter.toLowerCase()
      )
    }

    setFilteredList(result)
  }, [search, serviceFilter, list])

  const exportCsv = () => {
    window.location.href = '/api/admin/enquiries?export=csv'
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) return
    try {
      await axios.delete('/api/admin/enquiries', { data: { id } })
      load()
    } catch (err: any) {
      alert('Error deleting enquiry: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <div>
      <Nav />
      <main className="admin-shell">
        <div className="container">
          <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 22px' }}>
            <span className="eyebrow">Admin CMS</span>
            <h2>Customer Enquiries / Leads</h2>
            <p>Review and follow up with leads captured across all landing page enquiry forms.</p>
          </div>

          <div className="admin-card" style={{ marginBottom: 20, display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1, maxWidth: '600px' }}>
              <input
                type="text"
                className="form-input"
                style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '0.9rem', flex: 1, minWidth: '180px' }}
                placeholder="Search by name, email, phone, message..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              
              <select
                className="form-input"
                style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '0.9rem', width: '180px' }}
                value={serviceFilter}
                onChange={e => setServiceFilter(e.target.value)}
              >
                <option value="">All Services</option>
                <option value="consultancy">Consultancy</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="investment">Investment</option>
                <option value="real-estate">Real Estate</option>
                <option value="rental-space">Rental Space</option>
              </select>
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
                onClick={load}
                type="button"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="admin-card" style={{ overflowX: 'auto' }}>
            {loading ? (
              <p>Loading enquiries...</p>
            ) : (
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--line)', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>ID</th>
                    <th style={{ padding: '12px' }}>Customer Contact</th>
                    <th style={{ padding: '12px' }}>Requested Service</th>
                    <th style={{ padding: '12px' }}>Message Details</th>
                    <th style={{ padding: '12px' }}>Form Page</th>
                    <th style={{ padding: '12px' }}>Date</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--line)', fontSize: '0.92rem' }}>
                      <td style={{ padding: '16px 12px' }}>{item.id}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{item.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{item.email}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{item.phone}</div>
                        {item.city && <div style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>City: {item.city}</div>}
                      </td>
                      <td style={{ padding: '16px 12px', fontWeight: 600, color: 'var(--accent)', textTransform: 'capitalize' }}>
                        {item.service || 'General'}
                      </td>
                      <td style={{ padding: '16px 12px', maxWidth: '300px', wordBreak: 'break-word', color: 'var(--text)', fontSize: '0.88rem' }}>
                        {item.message || <span style={{ fontStyle: 'italic', color: 'var(--muted)' }}>No message</span>}
                      </td>
                      <td style={{ padding: '16px 12px', fontSize: '0.8rem', color: 'var(--muted)' }}>
                        {item.page || 'Unknown'}
                      </td>
                      <td style={{ padding: '16px 12px', color: 'var(--muted)', fontSize: '0.82rem' }}>
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'red', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}
                          onClick={() => handleDelete(item.id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredList.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)' }}>
                        No enquiries matching criteria.
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
