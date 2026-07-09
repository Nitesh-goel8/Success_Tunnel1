import { useState } from 'react'

interface RentalPaymentButtonProps {
  rentalTitle: string
  defaultAmount?: number
}

export default function RentalPaymentButton({ rentalTitle, defaultAmount = 500 }: RentalPaymentButtonProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: defaultAmount.toString()
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  })
  const [showModal, setShowModal] = useState(false)

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: 'idle', message: '' })

    const resScript = await loadRazorpayScript()
    if (!resScript) {
      setStatus({ type: 'error', message: 'Failed to load Razorpay SDK. Check your internet connection.' })
      setLoading(false)
      return
    }

    try {
      // 1. Create order on backend
      const resOrder = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          rentalTitle: rentalTitle
        })
      })

      if (!resOrder.ok) {
        const errorData = await resOrder.json()
        throw new Error(errorData.error || 'Failed to initialize payment order')
      }

      const orderData = await resOrder.json()

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SuccessTunnel',
        description: `Booking deposit for ${rentalTitle}`,
        image: '/logo.jpeg',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 3. Verify signature on backend
          try {
            setLoading(true)
            const resVerify = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            })

            const verifyData = await resVerify.json()
            if (resVerify.ok && verifyData.success) {
              setStatus({
                type: 'success',
                message: `Payment successful! Transaction ID: ${response.razorpay_payment_id}. We will contact you shortly.`
              })
              setFormData({ name: '', email: '', phone: '', amount: defaultAmount.toString() })
              setShowModal(false)
            } else {
              throw new Error(verifyData.error || 'Signature verification failed')
            }
          } catch (err: any) {
            setStatus({ type: 'error', message: err.message || 'Payment verification failed.' })
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          rentalTitle: rentalTitle
        },
        theme: {
          color: '#0b3a86'
        }
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.on('payment.failed', function (response: any) {
        setStatus({
          type: 'error',
          message: `Payment failed: ${response.error.description || 'Unknown error'}`
        })
      })
      paymentObject.open()
    } catch (error: any) {
      console.error(error)
      setStatus({ type: 'error', message: error.message || 'Error occurred while processing payment.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="payment-gateway-wrapper">
      {status.type === 'success' && (
        <div className="payment-alert success-alert">
          <span style={{ fontSize: '1.5rem' }}>✅</span>
          <div>
            <h4 style={{ margin: '0 0 4px 0', color: '#065f46' }}>Payment Complete</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#047857' }}>{status.message}</p>
          </div>
        </div>
      )}

      {status.type === 'error' && (
        <div className="payment-alert error-alert">
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div>
            <h4 style={{ margin: '0 0 4px 0', color: '#991b1b' }}>Payment Issue</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#b91c1c' }}>{status.message}</p>
          </div>
        </div>
      )}

      {!showModal ? (
        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', fontSize: '1.05rem' }}
          onClick={() => setShowModal(true)}
          type="button"
        >
          Book &amp; Pay Security Deposit &rarr;
        </button>
      ) : (
        <div className="payment-modal-overlay">
          <div className="payment-modal-card">
            <div className="payment-modal-header">
              <h3>Secure Booking Deposit</h3>
              <button className="close-modal-btn" onClick={() => setShowModal(false)} type="button">&times;</button>
            </div>
            
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)', margin: '0 0 20px 0' }}>
              Confirm your details to pay the booking token/deposit for <strong>{rentalTitle}</strong>.
            </p>

            <form onSubmit={handlePayment} className="payment-form">
              <div className="field-group">
                <label className="field-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. Neeraj Aggarwal"
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. client@example.com"
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. +91 99999 99999"
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label">Deposit Amount (INR)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px 18px', borderRadius: '10px' }}
                >
                  {loading ? 'Processing...' : `Pay ₹${formData.amount}`}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                  style={{ padding: '12px 18px', borderRadius: '10px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
