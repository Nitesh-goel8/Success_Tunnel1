import { useEffect, useState } from 'react'
import axios from 'axios'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { GetServerSideProps } from 'next'
import { EDUCATION_CONTENT_TYPES } from '../../lib/educationContent'

type FormState = {
  id: string
  title: string
  slug: string
  contentType: string
  category: string
  excerpt: string
  body: string
  thumbnailUrl: string
  assetUrl: string
  externalUrl: string
  ctaLabel: string
  sortOrder: string
  isPublished: boolean
  isFeatured: boolean
  showOnHomePopup: boolean
}

const emptyForm: FormState = {
  id: '',
  title: '',
  slug: '',
  contentType: 'Course',
  category: 'Education',
  excerpt: '',
  body: '',
  thumbnailUrl: '',
  assetUrl: '',
  externalUrl: '',
  ctaLabel: '',
  sortOrder: '0',
  isPublished: false,
  isFeatured: false,
  showOnHomePopup: true,
}

export default function AdminEducation() {
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('')

  const load = async () => {
    try {
      const response = await axios.get('/api/admin/education')
      setItems(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')
    try {
      if (editing) {
        await axios.put('/api/admin/education', form)
        setMessage('Education content updated successfully.')
      } else {
        await axios.post('/api/admin/education', form)
        setMessage('Education content created successfully.')
      }
      setForm(emptyForm)
      setEditing(false)
      load()
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.error || error.message}`)
    }
  }

  const edit = (item: any) => {
    setForm({
      id: String(item.id),
      title: item.title || '',
      slug: item.slug || '',
      contentType: item.contentType || 'Course',
      category: item.category || 'Education',
      excerpt: item.excerpt || '',
      body: item.body || '',
      thumbnailUrl: item.thumbnailUrl || '',
      assetUrl: item.assetUrl || '',
      externalUrl: item.externalUrl || '',
      ctaLabel: item.ctaLabel || '',
      sortOrder: String(item.sortOrder ?? 0),
      isPublished: !!item.isPublished,
      isFeatured: !!item.isFeatured,
      showOnHomePopup: !!item.showOnHomePopup,
    })
    setEditing(true)
    setMessage('')
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this education item?')) return
    try {
      await axios.delete('/api/admin/education', { data: { id } })
      load()
    } catch (error: any) {
      setMessage(`Error deleting item: ${error.response?.data?.error || error.message}`)
    }
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = event.target as HTMLInputElement
    setForm(prev => ({
      ...prev,
      [target.name]: target.type === 'checkbox' ? target.checked : target.value
    }))
  }

  return (
    <div>
      <Nav />
      <main className="admin-shell">
        <div className="container">
          <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 22px' }}>
            <span className="eyebrow">Admin CMS</span>
            <h2>Education Hub</h2>
            <p>Manage short learning items, notes, courses, videos, downloads, and tools from one place.</p>
          </div>

          {message && (
            <div className="admin-card" style={{ marginBottom: 20, color: message.startsWith('Error') ? 'var(--accent-2)' : 'green', fontWeight: 600 }}>
              {message}
            </div>
          )}

          <div className="admin-card" style={{ marginBottom: 30 }}>
            <form className="admin-form" onSubmit={submit}>
              <h3 style={{ marginBottom: 12 }}>{editing ? 'Edit Education Content' : 'Add Education Content'}</h3>
              <div className="form-grid">
                <Field label="Title" name="title" value={form.title} onChange={onChange} placeholder="e.g. GST Basics for Beginners" />
                <Field label="Slug" name="slug" value={form.slug} onChange={onChange} placeholder="gst-basics-beginners" />
                <SelectField label="Content Type" name="contentType" value={form.contentType} onChange={onChange} options={[...EDUCATION_CONTENT_TYPES]} />
                <Field label="Category" name="category" value={form.category} onChange={onChange} placeholder="Taxation" />
                <Field label="Thumbnail URL" name="thumbnailUrl" value={form.thumbnailUrl} onChange={onChange} placeholder="/images/education-thumb.jpg" />
                <Field label="Asset URL" name="assetUrl" value={form.assetUrl} onChange={onChange} placeholder="/videos/sample.mp4 or /pdfs/sample.pdf" />
              </div>
              <p style={{ marginTop: 6, marginBottom: 16, color: 'var(--muted)', fontSize: '0.9rem' }}>
                Thumbnail is optional, but it makes every item look much friendlier on the public page.
              </p>

              <div className="field-group">
                <label className="field-label">Excerpt</label>
                <textarea className="form-textarea" name="excerpt" value={form.excerpt} onChange={onChange} placeholder="Short teaser shown in cards and popup." />
              </div>

              <div className="field-group">
                <label className="field-label">Body</label>
                <textarea className="form-textarea" name="body" value={form.body} onChange={onChange} placeholder="Main content for notes, guides, course descriptions, or tool instructions." />
              </div>

              <div className="form-grid">
                <Field label="CTA Label" name="ctaLabel" value={form.ctaLabel} onChange={onChange} placeholder="Watch now / Read note / Use tool" />
                <Field label="External URL" name="externalUrl" value={form.externalUrl} onChange={onChange} placeholder="/resources/calculators or https://..." />
                <Field label="Sort Order" name="sortOrder" value={form.sortOrder} onChange={onChange} placeholder="0" />
                <Checkbox label="Published" name="isPublished" checked={form.isPublished} onChange={onChange} />
                <Checkbox label="Featured" name="isFeatured" checked={form.isFeatured} onChange={onChange} />
                <Checkbox label="Show popup on home" name="showOnHomePopup" checked={form.showOnHomePopup} onChange={onChange} />
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="btn btn-primary" type="submit" style={{ width: 'fit-content' }}>
                  {editing ? 'Save Changes' : 'Publish Content'}
                </button>
                {editing && (
                  <button className="btn btn-secondary" type="button" onClick={() => { setForm(emptyForm); setEditing(false) }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="admin-card">
            <h3 style={{ marginBottom: 18 }}>Education Library</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Thumb</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Popup</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{item.slug}</div>
                    </td>
                    <td>
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--line)' }}
                        />
                      ) : (
                        <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>None</span>
                      )}
                    </td>
                    <td>{item.contentType}</td>
                    <td>{item.isPublished ? 'Published' : 'Draft'}</td>
                    <td>{item.showOnHomePopup ? 'Yes' : 'No'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => edit(item)} type="button">
                          Edit
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', color: 'red' }} onClick={() => remove(item.id)} type="button">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                      No education content added yet.
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

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string
  name: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  placeholder: string
}) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <input className="form-input" name={name} value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  )
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string
  name: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  options: string[]
}) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <select className="form-input" name={name} value={value} onChange={onChange}>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}

function Checkbox({
  label,
  name,
  checked,
  onChange,
}: {
  label: string
  name: string
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}) {
  return (
    <label className="field-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 22 }}>
      <input type="checkbox" name={name} checked={checked} onChange={onChange as any} />
      <span className="field-label" style={{ margin: 0 }}>{label}</span>
    </label>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { getTokenFromReq, verifyToken } = await import('../../lib/auth')
  const token = getTokenFromReq(req as any)
  const payload = verifyToken(token as string)
  if (!payload) return { redirect: { destination: '/admin/login', permanent: false } }
  return { props: {} }
}
