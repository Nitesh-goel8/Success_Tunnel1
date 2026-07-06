import { useEffect, useState } from 'react'
import axios from 'axios'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([])
  const [form, setForm] = useState({ id: '', title: '', slug: '', excerpt: '', content: '', icon: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [activeServiceId, setActiveServiceId] = useState<number | null>(null)

  // Subservice form state
  const [subForm, setSubForm] = useState({ title: '', slug: '', content: '' })
  const [subserviceMessage, setSubserviceMessage] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    try {
      const response = await axios.get('/api/admin/services')
      setServices(response.data)
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
        await axios.put('/api/admin/services', form)
        setMessage('Service updated successfully!')
      } else {
        await axios.post('/api/admin/services', form)
        setMessage('Service created successfully!')
      }
      setForm({ id: '', title: '', slug: '', excerpt: '', content: '', icon: '' })
      setIsEditing(false)
      load()
    } catch (error: any) {
      setMessage('Error: ' + (error.response?.data?.error || error.message))
    }
  }

  const startEdit = (service: any) => {
    setForm({
      id: service.id.toString(),
      title: service.title || '',
      slug: service.slug || '',
      excerpt: service.excerpt || '',
      content: service.content || '',
      icon: service.icon || ''
    })
    setIsEditing(true)
    setMessage('')
  }

  const cancelEdit = () => {
    setForm({ id: '', title: '', slug: '', excerpt: '', content: '', icon: '' })
    setIsEditing(false)
    setMessage('')
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this service and all its subservices?')) return
    try {
      await axios.delete('/api/admin/services', { data: { id } })
      load()
    } catch (error: any) {
      alert('Error deleting service: ' + (error.response?.data?.error || error.message))
    }
  }

  // Subservice Actions
  const handleAddSubservice = async (e: any, serviceId: number) => {
    e.preventDefault()
    setSubserviceMessage('')
    try {
      await axios.post('/api/admin/services', { ...subForm, serviceId })
      setSubForm({ title: '', slug: '', content: '' })
      setSubserviceMessage('Subservice added successfully!')
      load()
    } catch (error: any) {
      setSubserviceMessage('Error: ' + (error.response?.data?.error || error.message))
    }
  }

  const handleDeleteSubservice = async (subserviceId: number) => {
    if (!confirm('Delete this subservice?')) return
    try {
      await axios.delete('/api/admin/services', { data: { subserviceId } })
      load()
    } catch (error: any) {
      alert('Error deleting subservice: ' + (error.response?.data?.error || error.message))
    }
  }

  return (
    <div>
      <Nav />
      <main className="admin-shell">
        <div className="container">
          <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 22px' }}>
            <span className="eyebrow">Admin CMS</span>
            <h2>Manage Services &amp; Subservices</h2>
            <p>Create core service offerings and link subservices (e.g. Income Tax under Consultancy).</p>
          </div>

          {message && (
            <div className="admin-card" style={{ marginBottom: 20, color: message.startsWith('Error') ? 'var(--accent-2)' : 'green', fontWeight: 600 }}>
              {message}
            </div>
          )}

          <div className="admin-card" style={{ marginBottom: 30 }}>
            <form className="admin-form" onSubmit={handleSubmit}>
              <h3 style={{ marginBottom: 12 }}>{isEditing ? 'Edit Service' : 'Create New Service'}</h3>

              <div className="form-grid">
                <div className="field-group">
                  <label className="field-label">Title</label>
                  <input
                    className="form-input"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Consultancy"
                    required
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Slug</label>
                  <input
                    className="form-input"
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    placeholder="e.g. consultancy"
                    required
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="field-group">
                  <label className="field-label">Icon (Emoji or Icon Name)</label>
                  <input
                    className="form-input"
                    value={form.icon}
                    onChange={e => setForm({ ...form, icon: e.target.value })}
                    placeholder="e.g. 💼"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Excerpt / Short Description</label>
                  <input
                    className="form-input"
                    value={form.excerpt}
                    onChange={e => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="Brief description for grid cards"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Detailed Content (Optional)</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '100px' }}
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Extended content details for individual pages..."
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary" type="submit" style={{ width: 'fit-content' }}>
                  {isEditing ? 'Save Changes' : 'Create Service'}
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
            <h3 style={{ marginBottom: 18 }}>Existing Core Services</h3>
            <table className="admin-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Subservices</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(service => (
                  <>
                    <tr key={service.id} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td style={{ fontSize: '1.5rem', padding: '14px 16px' }}>{service.icon || '💼'}</td>
                      <td style={{ fontWeight: 600, padding: '14px 16px' }}>{service.title}</td>
                      <td style={{ padding: '14px 16px' }}><code>{service.slug}</code></td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          onClick={() => {
                            setActiveServiceId(activeServiceId === service.id ? null : service.id)
                            setSubserviceMessage('')
                          }}
                          type="button"
                        >
                          {service.subservices?.length || 0} Subservices {activeServiceId === service.id ? '▲' : '▼'}
                        </button>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => startEdit(service)} type="button">
                            Edit
                          </button>
                          <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', color: 'red' }} onClick={() => remove(service.id)} type="button">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>

                    {activeServiceId === service.id && (
                      <tr key={`sub-${service.id}`}>
                        <td colSpan={5} style={{ background: '#f8fafc', padding: '24px', borderBottom: '2px solid var(--line)' }}>
                          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                            <h4 style={{ margin: '0 0 16px', color: 'var(--primary)' }}>Manage Subservices for {service.title}</h4>

                            {subserviceMessage && (
                              <div style={{ marginBottom: 12, color: subserviceMessage.startsWith('Error') ? 'red' : 'green', fontWeight: 600, fontSize: '0.9rem' }}>
                                {subserviceMessage}
                              </div>
                            )}

                            {/* Subservices List */}
                            <div style={{ marginBottom: 20 }}>
                              <h5 style={{ margin: '0 0 8px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)' }}>Current Subservices</h5>
                              <table style={{ width: '100%', background: '#fff', border: '1px solid var(--line)', borderRadius: '8px', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr style={{ borderBottom: '1px solid var(--line)', background: '#f1f5f9', textAlign: 'left', fontSize: '0.85rem' }}>
                                    <th style={{ padding: '8px 12px' }}>Title</th>
                                    <th style={{ padding: '8px 12px' }}>Slug</th>
                                    <th style={{ padding: '8px 12px' }}>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {service.subservices?.map((sub: any) => (
                                    <tr key={sub.id} style={{ borderBottom: '1px solid var(--line)', fontSize: '0.9rem' }}>
                                      <td style={{ padding: '8px 12px', fontWeight: 600 }}>{sub.title}</td>
                                      <td style={{ padding: '8px 12px' }}><code>{sub.slug}</code></td>
                                      <td style={{ padding: '8px 12px' }}>
                                        <button
                                          style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer', fontWeight: 600 }}
                                          onClick={() => handleDeleteSubservice(sub.id)}
                                          type="button"
                                        >
                                          Delete
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                  {(!service.subservices || service.subservices.length === 0) && (
                                    <tr>
                                      <td colSpan={3} style={{ textAlign: 'center', padding: '12px', color: 'var(--muted)', fontSize: '0.88rem' }}>
                                        No subservices linked yet.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {/* Add Subservice Form */}
                            <form onSubmit={(e) => handleAddSubservice(e, service.id)} style={{ display: 'flex', flexDirection: 'column', gap: 10, background: '#fff', padding: 16, border: '1px solid var(--line)', borderRadius: 12 }}>
                              <h5 style={{ margin: '0 0 4px', fontSize: '0.9rem', color: 'var(--primary)' }}>Add New Subservice</h5>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <input
                                  className="form-input"
                                  style={{ padding: '10px 12px', borderRadius: 8, fontSize: '0.9rem' }}
                                  value={subForm.title}
                                  onChange={e => setSubForm({ ...subForm, title: e.target.value })}
                                  placeholder="Subservice Title (e.g. GST)"
                                  required
                                />
                                <input
                                  className="form-input"
                                  style={{ padding: '10px 12px', borderRadius: 8, fontSize: '0.9rem' }}
                                  value={subForm.slug}
                                  onChange={e => setSubForm({ ...subForm, slug: e.target.value })}
                                  placeholder="Slug (e.g. gst)"
                                  required
                                />
                              </div>
                              <input
                                className="form-input"
                                style={{ padding: '10px 12px', borderRadius: 8, fontSize: '0.9rem' }}
                                value={subForm.content}
                                onChange={e => setSubForm({ ...subForm, content: e.target.value })}
                                placeholder="Short description / details"
                              />
                              <button className="btn btn-primary" type="submit" style={{ width: 'fit-content', padding: '8px 18px', fontSize: '0.9rem', borderRadius: 8 }}>
                                Add Subservice
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
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
