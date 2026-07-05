import { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminProperties() {
  const [list, setList] = useState<any[]>([])
  const [form, setForm] = useState({ title: '', slug: '', type: 'Residential', city: '', price: '' })

  const load = async () => {
    const response = await axios.get('/api/properties')
    setList(response.data)
  }

  useEffect(() => {
    load()
  }, [])

  const create = async (event: any) => {
    event.preventDefault()
    await axios.post('/api/admin/properties', form)
    setForm({ title: '', slug: '', type: 'Residential', city: '', price: '' })
    load()
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this property?')) return
    await axios.delete('/api/admin/properties', { data: { id } })
    load()
  }

  return (
    <div className="admin-shell">
      <div className="container">
        <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 22px' }}>
          <span className="eyebrow">Admin</span>
          <h2>Manage Properties</h2>
        </div>

        <div className="admin-card" style={{ marginBottom: 20 }}>
          <form className="admin-form" onSubmit={create}>
            <input className="form-input" value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="Title" required />
            <input className="form-input" value={form.slug} onChange={event => setForm({ ...form, slug: event.target.value })} placeholder="Slug" required />
            <div className="form-grid">
              <input className="form-input" value={form.type} onChange={event => setForm({ ...form, type: event.target.value })} placeholder="Type" />
              <input className="form-input" value={form.city} onChange={event => setForm({ ...form, city: event.target.value })} placeholder="City" />
            </div>
            <input className="form-input" value={form.price} onChange={event => setForm({ ...form, price: event.target.value })} placeholder="Price" />
            <button className="btn btn-primary" type="submit" style={{ width: 'fit-content' }}>
              Create property
            </button>
          </form>
        </div>

        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>City</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map(property => (
                <tr key={property.id}>
                  <td>{property.title}</td>
                  <td>{property.city}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => remove(property.id)} type="button">
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
