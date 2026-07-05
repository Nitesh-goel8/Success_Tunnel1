import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([])
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '' })

  const load = async () => {
    const response = await axios.get('/api/admin/services')
    setServices(response.data)
  }

  useEffect(() => {
    load()
  }, [])

  const create = async (event: any) => {
    event.preventDefault()
    await axios.post('/api/admin/services', form)
    setForm({ title: '', slug: '', excerpt: '' })
    load()
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this service?')) return
    await axios.delete('/api/admin/services', { data: { id } })
    load()
  }

  return (
    <div className="admin-shell">
      <div className="container">
        <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 22px' }}>
          <span className="eyebrow">Admin</span>
          <h2>Manage Services</h2>
        </div>

        <div className="admin-card" style={{ marginBottom: 20 }}>
          <form className="admin-form" onSubmit={create}>
            <input className="form-input" value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="Title" required />
            <input className="form-input" value={form.slug} onChange={event => setForm({ ...form, slug: event.target.value })} placeholder="Slug" required />
            <textarea className="form-textarea" value={form.excerpt} onChange={event => setForm({ ...form, excerpt: event.target.value })} placeholder="Excerpt" />
            <button className="btn btn-primary" type="submit" style={{ width: 'fit-content' }}>
              Create service
            </button>
          </form>
        </div>

        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id}>
                  <td>{service.title}</td>
                  <td>{service.slug}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => remove(service.id)} type="button">
                      Delete
                    </button>
                  </td>
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
