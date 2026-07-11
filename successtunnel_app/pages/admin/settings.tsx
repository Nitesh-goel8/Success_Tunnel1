import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import axios from 'axios'
import Footer from '../../components/Footer'
import Nav from '../../components/Nav'
import { DEFAULT_SITE_SETTINGS } from '../../lib/siteSettings'

const initialSettings = {
  ...DEFAULT_SITE_SETTINGS,
  razorpayKeyId: '',
  razorpayKeySecret: '',
  enquiryNotificationEmail: '',
  smtpHost: '',
  smtpPort: '587',
  smtpSecure: 'false',
  smtpUser: '',
  smtpPass: '',
  smtpFromEmail: '',
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await axios.get('/api/admin/settings')
        const data = response.data
        setSettings((prev) => ({
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
      setMessage('Settings updated successfully.')
    } catch (err: any) {
      setMessage(`Error updating settings: ${err.response?.data?.error || err.message}`)
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
            <p>Manage site-wide business details, public SEO information, contact methods, and payment/email integrations.</p>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ margin: '0 0 8px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px', color: 'var(--primary)' }}>Brand & SEO</h4>
                  <Field label="Business Name" name="businessName" value={settings.businessName} onChange={handleInputChange} placeholder="Success Tunnel" />
                  <Field label="Site Title" name="siteTitle" value={settings.siteTitle} onChange={handleInputChange} placeholder="Success Tunnel" />
                  <Field label="Site Tagline" name="siteTagline" value={settings.siteTagline} onChange={handleInputChange} placeholder="Strategy, education, and growth under one roof" />
                  <Field label="Canonical Site URL" name="siteUrl" value={settings.siteUrl} onChange={handleInputChange} placeholder="https://successtunnel.in" />
                  <TextField label="Site Description" name="siteDescription" value={settings.siteDescription} onChange={handleInputChange} placeholder="Short SEO-friendly business description" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ margin: '0 0 8px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px', color: 'var(--primary)' }}>Contact Details</h4>
                  <Field label="Primary Support Email" name="contactEmail" value={settings.contactEmail} onChange={handleInputChange} placeholder="support@successtunnel.in" />
                  <Field label="Primary Contact Phone" name="contactPhone1" value={settings.contactPhone1} onChange={handleInputChange} placeholder="+91 89507 71205" />
                  <Field label="Secondary Contact Phone" name="contactPhone2" value={settings.contactPhone2} onChange={handleInputChange} placeholder="+91 72061 89559" />
                  <Field label="WhatsApp Number" name="whatsappNumber" value={settings.whatsappNumber} onChange={handleInputChange} placeholder="+918950771205" />
                  <Field label="Working Hours" name="workingHours" value={settings.workingHours} onChange={handleInputChange} placeholder="Mon - Sat: 10:00 AM - 6:00 PM" />
                  <Field label="Contact Person" name="contactPerson" value={settings.contactPerson} onChange={handleInputChange} placeholder="Neeraj Aggarwal" />
                  <Field label="Contact Role" name="contactRole" value={settings.contactRole} onChange={handleInputChange} placeholder="Chartered Accountant & Principal Advisor" />
                </div>
              </div>

              <TextField label="Office Address" name="officeAddress" value={settings.officeAddress} onChange={handleInputChange} placeholder="Full office address..." />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', margin: '24px 0 32px' }}>
                <Field label="Map Embed URL" name="mapEmbedUrl" value={settings.mapEmbedUrl} onChange={handleInputChange} placeholder="Google Maps embed URL" />
                <Field label="Public Map Link" name="mapLink" value={settings.mapLink} onChange={handleInputChange} placeholder="Google Maps share link" />
              </div>

              <h4 style={{ margin: '32px 0 8px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px', color: 'var(--primary)' }}>Razorpay Credentials</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: '0 0 20px 0' }}>
                These database values are used only when environment variables are not present.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <Field label="Razorpay Key ID" name="razorpayKeyId" value={settings.razorpayKeyId} onChange={handleInputChange} placeholder="rzp_test_..." />
                <Field label="Razorpay Key Secret" name="razorpayKeySecret" value={settings.razorpayKeySecret} onChange={handleInputChange} placeholder="Secret key" type="password" />
              </div>

              <h4 style={{ margin: '32px 0 8px 0', borderBottom: '1px solid var(--line)', paddingBottom: '8px', color: 'var(--primary)' }}>Email Notifications</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: '0 0 20px 0' }}>
                For production, storing these in environment variables is still recommended.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <Field label="Notification Email" name="enquiryNotificationEmail" value={settings.enquiryNotificationEmail} onChange={handleInputChange} placeholder="enquiries@successtunnel.in" />
                <Field label="SMTP Host" name="smtpHost" value={settings.smtpHost} onChange={handleInputChange} placeholder="smtp.example.com" />
                <Field label="SMTP Port" name="smtpPort" value={settings.smtpPort} onChange={handleInputChange} placeholder="587" />
                <Field label="SMTP Secure" name="smtpSecure" value={settings.smtpSecure} onChange={handleInputChange} placeholder="true or false" />
                <Field label="SMTP Username" name="smtpUser" value={settings.smtpUser} onChange={handleInputChange} placeholder="SMTP username" />
                <Field label="SMTP Password" name="smtpPass" value={settings.smtpPass} onChange={handleInputChange} placeholder="SMTP password" type="password" />
                <Field label="SMTP From Email" name="smtpFromEmail" value={settings.smtpFromEmail} onChange={handleInputChange} placeholder="no-reply@example.com" />
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

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text'
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder: string
  type?: string
}) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="form-input"
        placeholder={placeholder}
      />
    </div>
  )
}

function TextField({
  label,
  name,
  value,
  onChange,
  placeholder
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder: string
}) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="form-textarea"
        style={{ minHeight: '100px' }}
        placeholder={placeholder}
      />
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
