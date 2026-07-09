import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

export default function ClientLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (router.query.registered) {
      setSuccess('Registration successful! Please sign in with your credentials.')
    }
  }, [router.query])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const res = await fetch('/api/client/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')

      router.push('/client/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Nav />
      <main style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', padding: '40px 20px' }}>
        <div style={{ background: '#fff', border: '1px solid var(--line)', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SuccessTunnel Client Portal</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: 'var(--primary)' }}>Welcome Back</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '6px' }}>Sign in to manage your enquiries and track payment receipts.</p>
          </div>

          {success && (
            <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #d1fae5', padding: '12px', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '20px', textAlign: 'center', fontWeight: 600 }}>
              🎉 {success}
            </div>
          )}

          {error && (
            <div style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fee2e2', padding: '12px', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '20px', textAlign: 'center', fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.88rem' }}>Email Address</label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--line)', outline: 'none', transition: 'all 0.2s' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.88rem' }}>Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--line)', outline: 'none', transition: 'all 0.2s' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #0b3a86, #165df5)',
                color: '#fff',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginTop: '10px',
                boxShadow: '0 8px 20px rgba(22, 93, 245, 0.15)',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--muted)' }}>
            New customer?{' '}
            <Link href="/client/signup" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
              Create Account
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
