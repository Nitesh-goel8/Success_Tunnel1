import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const submit = async (event: any) => {
      event.preventDefault()
      try {
        await axios.post('/api/admin/login', { email, password })
      router.push('/admin/dashboard')
    } catch (error) {
      alert('Login failed')
    }
  }

  return (
    <div className="admin-shell">
      <div className="container" style={{ display: 'grid', placeItems: 'center', minHeight: '72vh' }}>
        <form onSubmit={submit} className="form-card" style={{ width: 'min(100%, 420px)' }}>
          <div className="eyebrow">Admin access</div>
          <h2 style={{ margin: '14px 0 0', fontSize: '2rem', letterSpacing: '-.04em' }}>Sign in</h2>
          <p style={{ marginTop: 10, color: 'var(--muted)' }}>Use your admin credentials to manage the site.</p>

          <div className="form-grid" style={{ marginTop: 20 }}>
            <div className="field-group field-full">
              <label className="field-label" htmlFor="admin-email">
                Email
              </label>
              <input
                id="admin-email"
                className="form-input"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="field-group field-full">
              <label className="field-label" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                className="form-input"
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Password"
                type="password"
                required
              />
            </div>
          </div>

          <button className="btn btn-primary" type="submit" style={{ marginTop: 18 }}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
