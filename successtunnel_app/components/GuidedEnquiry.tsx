import { FormEvent, useState } from 'react'
import axios from 'axios'
import { HiArrowRight, HiCheck } from 'react-icons/hi'

const fallbackServices = ['Consultancy', 'Finance', 'Education', 'Investment', 'Real Estate', 'Rental Space']

type GuidedEnquiryProps = {
  page: string
  title?: string
  subtitle?: string
  selectedService?: string
  serviceOptions?: string[]
}

export default function GuidedEnquiry({
  page,
  title = 'Start with a little context.',
  subtitle = 'Choose an area, then share the essentials. We will connect you with the right next step.',
  selectedService = '',
  serviceOptions = fallbackServices,
}: GuidedEnquiryProps) {
  const [step, setStep] = useState(selectedService ? 2 : 1)
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', service: selectedService, message: '', website: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  const chooseService = (service: string) => {
    setForm(current => ({ ...current, service }))
    setStep(2)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (form.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.')
      setStatus('error')
      return
    }
    setStatus('sending')
    setError('')
    try {
      await axios.post('/api/enquiries', { ...form, page })
      setStatus('sent')
      setForm({ name: '', email: '', phone: '', city: '', service: selectedService, message: '', website: '' })
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || 'Please try again in a moment.')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return <div className="guided-enquiry guided-success" aria-live="polite"><span className="guided-success-icon"><HiCheck /></span><p className="eyebrow">Message received</p><h3>Thank you—we’ll be in touch within one working day.</h3><p>Your enquiry is with the SuccessTunnel team. If it is time-sensitive, please call us directly.</p></div>
  }

  return (
    <div className="guided-enquiry" id="enquiry">
      <div className="guided-enquiry-heading"><span className="eyebrow">A clear first step</span><h3>{title}</h3><p>{subtitle}</p></div>
      <div className="guided-progress" aria-label={'Step ' + step + ' of 2'}><span className={step === 1 ? 'is-current' : 'is-complete'}>1. Your focus</span><i /><span className={step === 2 ? 'is-current' : ''}>2. Your details</span></div>
      {step === 1 ? (
        <div className="guided-service-picker"><p>What would you like help with?</p><div className="guided-service-options">{serviceOptions.map(service => <button type="button" key={service} onClick={() => chooseService(service)}><span>{service}</span><HiArrowRight /></button>)}</div></div>
      ) : (
        <form onSubmit={submit} className="guided-form">
          <div className="guided-selected-service"><span>Selected focus</span><strong>{form.service}</strong>{!selectedService && <button type="button" onClick={() => setStep(1)}>Change</button>}</div>
          <input name="website" value={form.website} onChange={event => setForm({ ...form, website: event.target.value })} tabIndex={-1} autoComplete="off" aria-hidden="true" className="honeypot" />
          <div className="guided-fields">
            <label><span>Your name</span><input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Full name" /></label>
            <label><span>Mobile number</span><input required inputMode="tel" value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} placeholder="10-digit mobile number" /></label>
            <label><span>Email address</span><input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label>
            <label><span>City <em>(optional)</em></span><input value={form.city} onChange={event => setForm({ ...form, city: event.target.value })} placeholder="Your city" /></label>
            <label className="guided-field-full"><span>Tell us a little more <em>(optional)</em></span><textarea value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} placeholder="Your goal, timeline, or requirement" /></label>
          </div>
          <div className="guided-submit"><button type="submit" className="btn btn-primary" disabled={status === 'sending'}>{status === 'sending' ? 'Sending enquiry...' : 'Send my enquiry'} <HiArrowRight /></button><small>Usually answered within one working day.</small></div>
          {status === 'error' && <p className="guided-error" role="alert">{error}</p>}
        </form>
      )}
    </div>
  )
}
