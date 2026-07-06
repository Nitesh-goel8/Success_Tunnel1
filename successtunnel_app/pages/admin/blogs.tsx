import { useEffect, useState } from 'react'
import axios from 'axios'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [form, setForm] = useState({ id: '', title: '', slug: '', excerpt: '', content: '', featuredImage: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')

  const load = async () => {
    try {
      const response = await axios.get('/api/admin/blogs')
      setBlogs(response.data)
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
        await axios.put('/api/admin/blogs', form)
        setMessage('Blog post updated successfully!')
      } else {
        await axios.post('/api/admin/blogs', form)
        setMessage('Blog post created successfully!')
      }
      setForm({ id: '', title: '', slug: '', excerpt: '', content: '', featuredImage: '' })
      setIsEditing(false)
      load()
    } catch (error: any) {
      setMessage('Error: ' + (error.response?.data?.error || error.message))
    }
  }

  const startEdit = (blog: any) => {
    setForm({
      id: blog.id.toString(),
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      featuredImage: blog.featuredImage || ''
    })
    setIsEditing(true)
    setMessage('')
  }

  const cancelEdit = () => {
    setForm({ id: '', title: '', slug: '', excerpt: '', content: '', featuredImage: '' })
    setIsEditing(false)
    setMessage('')
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this blog post?')) return
    try {
      await axios.delete('/api/admin/blogs', { data: { id } })
      load()
    } catch (error: any) {
      alert('Error deleting post: ' + (error.response?.data?.error || error.message))
    }
  }

  return (
    <div>
      <Nav />
      <main className="admin-shell">
        <div className="container">
          <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 22px' }}>
            <span className="eyebrow">Admin CMS</span>
            <h2>Manage Blog Posts</h2>
            <p>Write, update, or remove articles from the strategic insights blog.</p>
          </div>

          {message && (
            <div className="admin-card" style={{ marginBottom: 20, color: message.startsWith('Error') ? 'var(--accent-2)' : 'green', fontWeight: 600 }}>
              {message}
            </div>
          )}

          <div className="admin-card" style={{ marginBottom: 30 }}>
            <form className="admin-form" onSubmit={handleSubmit}>
              <h3 style={{ marginBottom: 12 }}>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
              
              <div className="form-grid">
                <div className="field-group">
                  <label className="field-label">Title</label>
                  <input 
                    className="form-input" 
                    value={form.title} 
                    onChange={e => setForm({ ...form, title: e.target.value })} 
                    placeholder="e.g. Navigating Corporate Taxes" 
                    required 
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Slug</label>
                  <input 
                    className="form-input" 
                    value={form.slug} 
                    onChange={e => setForm({ ...form, slug: e.target.value })} 
                    placeholder="e.g. corporate-tax-navigation" 
                    required 
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Featured Image URL</label>
                <input 
                  className="form-input" 
                  value={form.featuredImage} 
                  onChange={e => setForm({ ...form, featuredImage: e.target.value })} 
                  placeholder="https://images.unsplash.com/... or /images/..." 
                />
              </div>

              <div className="field-group">
                <label className="field-label">Excerpt / Short Description</label>
                <textarea 
                  className="form-textarea" 
                  style={{ minHeight: '60px' }}
                  value={form.excerpt} 
                  onChange={e => setForm({ ...form, excerpt: e.target.value })} 
                  placeholder="Provide a brief 1-2 sentence overview of the article." 
                />
              </div>

              <div className="field-group">
                <label className="field-label">Article Body Content (HTML or Markdown compatible)</label>
                <textarea 
                  className="form-textarea" 
                  style={{ minHeight: '220px' }}
                  value={form.content} 
                  onChange={e => setForm({ ...form, content: e.target.value })} 
                  placeholder="Write the full body of the blog post here..." 
                  required 
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary" type="submit" style={{ width: 'fit-content' }}>
                  {isEditing ? 'Save Changes' : 'Publish Post'}
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
            <h3 style={{ marginBottom: 18 }}>Published Articles</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Published Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(blog => (
                  <tr key={blog.id}>
                    <td>{blog.title}</td>
                    <td><code>{blog.slug}</code></td>
                    <td>{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Draft'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => startEdit(blog)} type="button">
                          Edit
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', color: 'red' }} onClick={() => remove(blog.id)} type="button">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                      No blog posts published yet.
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
