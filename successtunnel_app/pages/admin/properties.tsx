import { useEffect, useState } from 'react'
import axios from 'axios'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

export default function AdminProperties() {
  const [list, setList] = useState<any[]>([])
  const [form, setForm] = useState({
    id: '',
    title: '',
    slug: '',
    type: 'Residential',
    city: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    images: '[]'
  })
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')

  const load = async () => {
    try {
      const response = await axios.get('/api/properties')
      setList(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setMessage('')
    try {
      if (isEditing) {
        await axios.put('/api/admin/properties', form)
        setMessage('Property updated successfully!')
      } else {
        await axios.post('/api/admin/properties', form)
        setMessage('Property created successfully!')
      }
      setForm({
        id: '',
        title: '',
        slug: '',
        type: 'Residential',
        city: '',
        price: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        description: '',
        images: '[]'
      })
      setIsEditing(false)
      load()
    } catch (error: any) {
      setMessage('Error: ' + (error.response?.data?.error || error.message))
    }
  }

  const startEdit = (property: any) => {
    setForm({
      id: property.id.toString(),
      title: property.title || '',
      slug: property.slug || '',
      type: property.type || 'Residential',
      city: property.city || '',
      price: property.price?.toString() || '',
      area: property.area || '',
      bedrooms: property.bedrooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '',
      description: property.description || '',
      images: property.images || '[]'
    })
    setIsEditing(true)
    setMessage('')
  }

  const cancelEdit = () => {
    setForm({
      id: '',
      title: '',
      slug: '',
      type: 'Residential',
      city: '',
      price: '',
      area: '',
      bedrooms: '',
      bathrooms: '',
      description: '',
      images: '[]'
    })
    setIsEditing(false)
    setMessage('')
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this property?')) return
    try {
      await axios.delete('/api/admin/properties', { data: { id } })
      load()
    } catch (error: any) {
      alert('Error deleting property: ' + (error.response?.data?.error || error.message))
    }
  }

  return (
    <div>
      <Nav />
      <main className="admin-shell">
        <div className="container">
          <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 22px' }}>
            <span className="eyebrow">Admin CMS</span>
            <h2>Manage Properties</h2>
            <p>Add, edit, or remove listings and details from the real estate portal.</p>
          </div>

          {message && (
            <div className="admin-card" style={{ marginBottom: 20, color: message.startsWith('Error') ? 'var(--accent-2)' : 'green', fontWeight: 600 }}>
              {message}
            </div>
          )}

          <div className="admin-card" style={{ marginBottom: 30 }}>
            <form className="admin-form" onSubmit={handleSubmit}>
              <h3 style={{ marginBottom: 12 }}>{isEditing ? 'Edit Property Listing' : 'Add New Property'}</h3>

              <div className="form-grid">
                <div className="field-group">
                  <label className="field-label">Title</label>
                  <input
                    className="form-input"
                    value={form.title}
                    onChange={event => setForm({ ...form, title: event.target.value })}
                    placeholder="Title"
                    required
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Slug</label>
                  <input
                    className="form-input"
                    value={form.slug}
                    onChange={event => setForm({ ...form, slug: event.target.value })}
                    placeholder="Slug"
                    required
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="field-group">
                  <label className="field-label">Type</label>
                  <select
                    className="form-select"
                    value={form.type}
                    onChange={event => setForm({ ...form, type: event.target.value })}
                  >
                    <option value="Residential">Residential Space</option>
                    <option value="Commercial">Commercial Space</option>
                    <option value="Rental">Rental Space</option>
                    <option value="Land">Land / Plot</option>
                  </select>
                </div>
                <div className="field-group">
                  <label className="field-label">City</label>
                  <input
                    className="form-input"
                    value={form.city}
                    onChange={event => setForm({ ...form, city: event.target.value })}
                    placeholder="City"
                    required
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="field-group">
                  <label className="field-label">Price (INR)</label>
                  <input
                    className="form-input"
                    type="number"
                    step="any"
                    value={form.price}
                    onChange={event => setForm({ ...form, price: event.target.value })}
                    placeholder="Price"
                    required
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Area (e.g. 1500 sq ft)</label>
                  <input
                    className="form-input"
                    value={form.area}
                    onChange={event => setForm({ ...form, area: event.target.value })}
                    placeholder="Area"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="field-group">
                  <label className="field-label">Bedrooms</label>
                  <input
                    className="form-input"
                    type="number"
                    value={form.bedrooms}
                    onChange={event => setForm({ ...form, bedrooms: event.target.value })}
                    placeholder="Bedrooms"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Bathrooms</label>
                  <input
                    className="form-input"
                    type="number"
                    value={form.bathrooms}
                    onChange={event => setForm({ ...form, bathrooms: event.target.value })}
                    placeholder="Bathrooms"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Description / Property Details</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '80px' }}
                  value={form.description}
                  onChange={event => setForm({ ...form, description: event.target.value })}
                  placeholder="Detailed property specifications, amenities, location advantages..."
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary" type="submit" style={{ width: 'fit-content' }}>
                  {isEditing ? 'Save Changes' : 'Create Property'}
                </button>
                {isEditing && (
                  <button className="btn btn-secondary" type="button" onClick={cancelEdit}>
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="admin-card">
            <h3 style={{ marginBottom: 18 }}>Current Listings</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>City</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(property => (
                  <tr key={property.id}>
                    <td style={{ fontWeight: 600 }}>{property.title}</td>
                    <td><span className="eyebrow" style={{ textTransform: 'uppercase', padding: '4px 8px', fontSize: '0.7rem' }}>{property.type}</span></td>
                    <td>{property.city}</td>
                    <td>₹{parseFloat(property.price).toLocaleString('en-IN')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => startEdit(property)} type="button">
                          Edit
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', color: 'red' }} onClick={() => remove(property.id)} type="button">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                      No properties found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
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
