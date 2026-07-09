import { useEffect, useState } from 'react'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import Link from 'next/link'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteTagline: 'A Fastest Way to Big Success',
    contactEmail: 'successtunnel.in@gmail.com',
    contactPhone1: '+91 89507 71205',
    contactPhone2: '+91 72061 89559',
    officeAddress: 'First Floor, Sudarshan Tower, Tau Devi Lal Complex, Behind Hive Hotel, Panipat 132103, Haryana, India',
    whatsappNumber: '+918950771205',
    workingHours: 'Mon – Sat: 10:00 AM – 6:00 PM',
    razorpayKeyId: '',
    razorpayKeySecret: ''
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await axios.get('/api/admin/settings')
        const data = response.data
        setSettings(prev => ({
          ...prev,
          ...data
        }))
      } catch (err) {
        console.error('Failed to load settings', err)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      await axios.post('/api/admin/settings', settings)
      setMessage('Settings updated successfully!')
    } catch (err: any) {
      setMessage('Error updating settings: ' + (err.response?.data?.error || err.message))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return (
      <div>
        <Nav />
        <main className="admin-shell">
          <div className="container">
            <p>Loading settings...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Nav />
      <main className="admin-shell">
        <div className="container">
          <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 28px' }}>
            <span className="eyebrow">System Config</span>
            <h2>Site Settings</h2>
            <p>Manage site-wide details, contact parameters, business hours, and payment configurations.</p>
          </div>

          {message && (
            <div className="admin-card" style={{ marginBottom: 20, color: message.startsWith('Error') ? 'red' : 'green', fontWeight: 600 }}>
              {message}
            </div>
          )}

          <div className="admin-card">
            <form className="admin-form" onSubmit={handleSubmit}>
              <h3 style={{ marginBottom: 20 }}>Edit Configuration</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                {/* Brand & Meta Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ margin: '0 0 8px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px', color: 'var(--primary)' }}>General Info</h4>
                  <div className="field-group">
                    <label className="field-label">Site Tagline / Headline</label>
                    <input
                      type="text"
                      name="siteTagline"
                      value={settings.siteTagline}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g. A Fastest Way to Big Success"
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">WhatsApp Contact Number (with country code)</label>
                    <input
                      type="text"
                      name="whatsappNumber"
                      value={settings.whatsappNumber}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g. +918950771205"
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Working Hours Description</label>
                    <input
                      type="text"
                      name="workingHours"
                      value={settings.workingHours}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g. Mon – Sat: 10:00 AM – 6:00 PM"
                    />
                  </div>
                </div>

                {/* Contact Coordinates */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ margin: '0 0 8px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px', color: 'var(--primary)' }}>Contact Details</h4>
                  <div className="field-group">
                    <label className="field-label">Primary Support Email</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={settings.contactEmail}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g. support@successtunnel.in"
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Primary Contact Phone</label>
                    <input
                      type="text"
                      name="contactPhone1"
                      value={settings.contactPhone1}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g. +91 89507 71205"
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Secondary Contact Phone</label>
                    <input
                      type="text"
                      name="contactPhone2"
                      value={settings.contactPhone2}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g. +91 72061 89559"
                    />
                  </div>
                </div>
              </div>

              <div className="field-group" style={{ marginBottom: '24px' }}>
                <label className="field-label">Office Address (Physical Location)</label>
                <textarea
                  name="officeAddress"
                  value={settings.officeAddress}
                  onChange={handleInputChange}
                  className="form-textarea"
                  style={{ minHeight: '80px' }}
                  placeholder="Full office address..."
                />
              </div>

              <h4 style={{ margin: '32px 0 8px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px', color: 'var(--primary)' }}>Razorpay Credentials (Rental space payment gateway)</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: '0 0 20px 0' }}>
                Provide API credentials from your Razorpay Merchant dashboard. Use test credentials (e.g. starting with rzp_test_) for sandbox verification.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <div className="field-group">
                  <label className="field-label">Razorpay Key ID</label>
                  <input
                    type="text"
                    name="razorpayKeyId"
                    value={settings.razorpayKeyId}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="rzp_test_..."
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Razorpay Key Secret</label>
                  <input
                    type="password"
                    name="razorpayKeySecret"
                    value={settings.razorpayKeySecret}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="••••••••••••••••"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary" type="submit" style={{ width: 'fit-content', padding: '14px 28px' }}>
                  Save Configuration
                </button>
                <Link href="/admin" className="btn btn-secondary">
                  Back to Dashboard
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { getTokenFromReq, verifyToken } = await import('../../lib/auth')
  const token = getTokenFromReq(req as any)
  const payload = verifyToken(token as string)
  if (!payload) return { redirect: { destination: '/admin/login', permanent: false } }
  return { props: {} }
}
