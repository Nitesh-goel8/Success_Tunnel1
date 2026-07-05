import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminEnquiries() {
  const [list, setList] = useState<any[]>([])

  const load = async () => {
    const response = await axios.get('/api/admin/enquiries')
    setList(response.data)
  }

  useEffect(() => {
    load()
  }, [])

  const exportCsv = () => {
    window.location.href = '/api/admin/enquiries?export=csv'
  }

  return (
    <div className="admin-shell">
      <div className="container">
        <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 22px' }}>
          <span className="eyebrow">Admin</span>
          <h2>View Enquiries</h2>
        </div>

        <div className="admin-card" style={{ marginBottom: 20 }}>
          <button className="btn btn-primary" onClick={exportCsv} type="button">
            Export CSV
          </button>
        </div>

        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {list.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.service}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ req }: { req: any }) => {
  const { getTokenFromReq, verifyToken } = await import('../../lib/auth')
  const token = getTokenFromReq(req)
  const payload = verifyToken(token)
  if (!payload) return { redirect: { destination: '/admin/login', permanent: false } }
  return { props: {} }
}
