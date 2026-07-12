import { useState } from 'react'
import axios from 'axios'

const defaultServiceOptions = [
  'Consultancy / Tax',
  'Finance / Loan',
  'Education / Training',
  'Investment',
  'Property / Real Estate',
  'Rental Space',
  'Not sure yet',
]

type EnquiryFormProps = {
  page?: string
  title?: string
  subtitle?: string
  buttonLabel?: string
  serviceOptions?: string[]
}

export default function EnquiryForm({
  page,
  title = 'Request a quick callback',
  subtitle = 'Share a few details and our team will call you back with the right next step.',
  buttonLabel = 'Request callback',
  serviceOptions = defaultServiceOptions,
}: EnquiryFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', service: '', message: '', website: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const onChange = (event: any) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const submit = async (event: any) => {
    event.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    // Client-side validation: check phone digits length
    const phoneDigits = form.phone.replace(/\D/g, '')
    if (phoneDigits.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.')
      setStatus('error')
      return
    }

    try {
      await axios.post('/api/enquiries', { ...form, page })
      setStatus('sent')
      setForm({ name: '', email: '', phone: '', city: '', service: '', message: '', website: '' })
    } catch (error: any) {
      const msg = error.response?.data?.error || error.message || 'Please try again.'
      setErrorMessage(msg)
      setStatus('error')
    }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="eyebrow">Quick enquiry</div>
      <h3 style={{ margin: '14px 0 0', fontSize: '1.55rem', letterSpacing: '-.03em' }}>{title}</h3>
      <p style={{ margin: '12px 0 0', color: 'var(--muted)' }}>{subtitle}</p>

      <div className="form-grid" style={{ marginTop: '22px' }}>
        <input
          name="website"
          value={form.website}
          onChange={onChange}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ display: 'none' }}
        />
        <div className="field-group">
          <label className="field-label" htmlFor={`${page || 'enquiry'}-name`}>Your name</label>
          <input
            id={`${page || 'enquiry'}-name`}
            className="form-input"
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={onChange}
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor={`${page || 'enquiry'}-email`}>Email address</label>
          <input
            id={`${page || 'enquiry'}-email`}
            className="form-input"
            name="email"
            placeholder="Enter your email address"
            type="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor={`${page || 'enquiry'}-phone`}>Mobile number</label>
          <input
            id={`${page || 'enquiry'}-phone`}
            className="form-input"
            name="phone"
            placeholder="Enter your 10-digit mobile number"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={onChange}
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor={`${page || 'enquiry'}-city`}>City</label>
          <input
            id={`${page || 'enquiry'}-city`}
            className="form-input"
            name="city"
            placeholder="Enter your city"
            value={form.city}
            onChange={onChange}
          />
        </div>
        <div className="field-group field-full">
          <label className="field-label" htmlFor={`${page || 'enquiry'}-service`}>What do you need help with?</label>
          <select
            id={`${page || 'enquiry'}-service`}
            className="form-input"
            name="service"
            value={form.service}
            onChange={onChange}
            required
          >
            <option value="">Select your service</option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="field-group field-full">
          <label className="field-label" htmlFor={`${page || 'enquiry'}-message`}>Tell us more</label>
          <textarea
            id={`${page || 'enquiry'}-message`}
            className="form-textarea"
            name="message"
            placeholder="Share a few details about your requirement"
            value={form.message}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Please wait...' : buttonLabel}
        </button>
        <span style={{ color: 'var(--muted)', fontSize: '.92rem' }}>We usually respond within 1 business day.</span>
      </div>

      {status === 'sent' && <p className="form-status success">Thanks! We’ll get back to you soon.</p>}
      {status === 'error' && (
        <p className="form-status error">
          Unable to send your enquiry. {errorMessage || 'Please try again.'}
        </p>
      )}
    </form>
  )
}
