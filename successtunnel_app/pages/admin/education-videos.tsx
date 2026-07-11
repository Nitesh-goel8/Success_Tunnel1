import { useEffect, useState } from 'react'
import axios from 'axios'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { GetServerSideProps } from 'next'

type VideoForm = {
  id: string
  title: string
  slug: string
  excerpt: string
  description: string
  category: string
  duration: string
  thumbnailUrl: string
  videoUrl: string
  sortOrder: string
  isPublished: boolean
  isFeatured: boolean
  showOnHomePopup: boolean
}

const emptyForm: VideoForm = {
  id: '',
  title: '',
  slug: '',
  excerpt: '',
  description: '',
  category: 'Education',
  duration: '',
  thumbnailUrl: '',
  videoUrl: '',
  sortOrder: '0',
  isPublished: false,
  isFeatured: false,
  showOnHomePopup: true,
}

export default function AdminEducationVideos() {
  const [videos, setVideos] = useState<any[]>([])
  const [form, setForm] = useState<VideoForm>(emptyForm)
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('')

  const load = async () => {
    try {
      const response = await axios.get('/api/admin/education-videos')
      setVideos(response.data)
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
        await axios.put('/api/admin/education-videos', form)
        setMessage('Video updated successfully.')
      } else {
        await axios.post('/api/admin/education-videos', form)
        setMessage('Video created successfully.')
      }
      setForm(emptyForm)
      setEditing(false)
      load()
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.error || error.message}`)
    }
  }

  const edit = (video: any) => {
    setForm({
      id: String(video.id),
      title: video.title || '',
      slug: video.slug || '',
      excerpt: video.excerpt || '',
      description: video.description || '',
      category: video.category || 'Education',
      duration: video.duration || '',
      thumbnailUrl: video.thumbnailUrl || '',
      videoUrl: video.videoUrl || '',
      sortOrder: String(video.sortOrder ?? 0),
      isPublished: !!video.isPublished,
      isFeatured: !!video.isFeatured,
      showOnHomePopup: !!video.showOnHomePopup,
    })
    setEditing(true)
    setMessage('')
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this education video?')) return
    try {
      await axios.delete('/api/admin/education-videos', { data: { id } })
      load()
    } catch (error: any) {
      setMessage(`Error deleting video: ${error.response?.data?.error || error.message}`)
    }
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, checked, value } = event.target as HTMLInputElement
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div>
      <Nav />
      <main className="admin-shell">
        <div className="container">
          <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 22px' }}>
            <span className="eyebrow">Admin CMS</span>
            <h2>Education Videos</h2>
            <p>Add direct video files or direct URLs, publish them on the education page, and control the homepage promo popup.</p>
          </div>

          {message && (
            <div className="admin-card" style={{ marginBottom: 20, color: message.startsWith('Error') ? 'var(--accent-2)' : 'green', fontWeight: 600 }}>
              {message}
            </div>
          )}

          <div className="admin-card" style={{ marginBottom: 30 }}>
            <form className="admin-form" onSubmit={submit}>
              <h3 style={{ marginBottom: 12 }}>{editing ? 'Edit Video' : 'Add New Video'}</h3>
              <div className="form-grid">
                <Field label="Title" name="title" value={form.title} onChange={onChange} placeholder="e.g. GST Basics for Beginners" />
                <Field label="Slug" name="slug" value={form.slug} onChange={onChange} placeholder="gst-basics-beginners" />
                <Field label="Category" name="category" value={form.category} onChange={onChange} placeholder="Education" />
                <Field label="Duration" name="duration" value={form.duration} onChange={onChange} placeholder="12 min" />
                <Field label="Thumbnail URL" name="thumbnailUrl" value={form.thumbnailUrl} onChange={onChange} placeholder="/images/video-thumb.jpg" />
                <Field label="Video URL / Direct File Path" name="videoUrl" value={form.videoUrl} onChange={onChange} placeholder="/videos/gst-basics.mp4" />
              </div>
              <div className="field-group">
                <label className="field-label">Short Excerpt</label>
                <textarea className="form-textarea" name="excerpt" value={form.excerpt} onChange={onChange} placeholder="Short teaser shown in cards and popup." />
              </div>
              <div className="field-group">
                <label className="field-label">Description</label>
                <textarea className="form-textarea" name="description" value={form.description} onChange={onChange} placeholder="Full description shown on the detail page." />
              </div>
              <div className="form-grid">
                <Field label="Sort Order" name="sortOrder" value={form.sortOrder} onChange={onChange} placeholder="0" />
                <Checkbox label="Published" name="isPublished" checked={form.isPublished} onChange={onChange} />
                <Checkbox label="Featured" name="isFeatured" checked={form.isFeatured} onChange={onChange} />
                <Checkbox label="Show popup on home" name="showOnHomePopup" checked={form.showOnHomePopup} onChange={onChange} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary" type="submit" style={{ width: 'fit-content' }}>
                  {editing ? 'Save Changes' : 'Publish Video'}
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
            <h3 style={{ marginBottom: 18 }}>Video Library</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Popup</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map(video => (
                  <tr key={video.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{video.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{video.slug}</div>
                    </td>
                    <td>{video.category || 'Education'}</td>
                    <td>{video.isPublished ? 'Published' : 'Draft'}</td>
                    <td>{video.showOnHomePopup ? 'Yes' : 'No'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => edit(video)} type="button">
                          Edit
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', color: 'red' }} onClick={() => remove(video.id)} type="button">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {videos.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                      No videos added yet.
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
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder: string
}) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <input className="form-input" name={name} value={value} onChange={onChange} placeholder={placeholder} />
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
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
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
