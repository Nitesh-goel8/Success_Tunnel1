import { useState } from 'react'
import axios from 'axios'

type EnquiryFormProps = {
  page?: string
  title?: string
  subtitle?: string
  buttonLabel?: string
}

export default function EnquiryForm({
  page,
  title = 'Request a consultation',
  subtitle = 'Share your requirements and our advisory team will respond shortly.',
  buttonLabel = 'Send enquiry',
}: EnquiryFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', service: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const onChange = (event: any) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const submit = async (event: any) => {
    event.preventDefault()
    setStatus('sending')

    try {
      await axios.post('/api/enquiries', { ...form, page })
      setStatus('sent')
      setForm({ name: '', email: '', phone: '', city: '', service: '', message: '' })
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="eyebrow">Get in touch</div>
      <h3 style={{ margin: '14px 0 0', fontSize: '1.55rem', letterSpacing: '-.03em' }}>{title}</h3>
      <p style={{ margin: '12px 0 0', color: 'var(--muted)' }}>{subtitle}</p>

      <div className="form-grid" style={{ marginTop: '22px' }}>
        <div className="field-group">
          <label className="field-label" htmlFor={`${page || 'enquiry'}-name`}>Full name</label>
          <input
            id={`${page || 'enquiry'}-name`}
            className="form-input"
            name="name"
            placeholder="Johnathan Doe"
            value={form.name}
            onChange={onChange}
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor={`${page || 'enquiry'}-email`}>Email</label>
          <input
            id={`${page || 'enquiry'}-email`}
            className="form-input"
            name="email"
            placeholder="john@company.com"
            type="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor={`${page || 'enquiry'}-phone`}>Mobile</label>
          <input
            id={`${page || 'enquiry'}-phone`}
            className="form-input"
            name="phone"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={onChange}
          />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor={`${page || 'enquiry'}-city`}>City</label>
          <input
            id={`${page || 'enquiry'}-city`}
            className="form-input"
            name="city"
            placeholder="Mumbai"
            value={form.city}
            onChange={onChange}
          />
        </div>
        <div className="field-group field-full">
          <label className="field-label" htmlFor={`${page || 'enquiry'}-service`}>Service required</label>
          <input
            id={`${page || 'enquiry'}-service`}
            className="form-input"
            name="service"
            placeholder="Consultancy / Finance / Education / Property"
            value={form.service}
            onChange={onChange}
          />
        </div>
        <div className="field-group field-full">
          <label className="field-label" htmlFor={`${page || 'enquiry'}-message`}>Message</label>
          <textarea
            id={`${page || 'enquiry'}-message`}
            className="form-textarea"
            name="message"
            placeholder="Tell us what you need help with"
            value={form.message}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : buttonLabel}
        </button>
        <span style={{ color: 'var(--muted)', fontSize: '.92rem' }}>We usually respond within one business day.</span>
      </div>

      {status === 'sent' && <p className="form-status success">Enquiry sent successfully.</p>}
      {status === 'error' && <p className="form-status error">Unable to send enquiry. Please try again.</p>}
    </form>
  )
}
