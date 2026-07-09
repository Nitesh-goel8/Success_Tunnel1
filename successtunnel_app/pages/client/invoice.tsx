import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { prisma } from '../../lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

interface InvoiceProps {
  payment: {
    orderId: string
    paymentId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    rentalTitle: string
    amount: number
    currency: string
    status: string
    createdAt: string
  }
}

export default function Invoice({ payment }: InvoiceProps) {
  const invoiceDate = new Date(payment.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  
  const taxRate = 0.18 // 18% GST (typical for services/rentals)
  const baseAmount = Math.round(payment.amount / (1 + taxRate))
  const gstAmount = payment.amount - baseAmount

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Inter', sans-serif" }}>
      <Head>
        <title>Receipt - {payment.paymentId}</title>
      </Head>
      
      {/* Invoice Sheet container */}
      <div className="invoice-container" style={{ background: '#fff', maxWidth: '800px', margin: '0 auto', padding: '50px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
        
        {/* Buttons (Hidden when printing) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '1px dashed #e2e8f0', paddingBottom: '20px' }}>
          <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>SuccessTunnel Official Invoice</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => window.print()} style={{ background: 'linear-gradient(135deg, #0b3a86, #165df5)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(22,93,245,0.1)' }}>
              Print / Save PDF 🖨️
            </button>
            <button onClick={() => window.close()} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
              Close Tab
            </button>
          </div>
        </div>

        {/* Invoice Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '30px', marginBottom: '50px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
              SUCCESS<span style={{ color: '#165df5' }}>TUNNEL</span>
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>
              Plot 45, Corporate Sector,<br />
              New Delhi, Delhi 110001<br />
              support@successtunnel.in | +91 98765 43210
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '-0.03em' }}>INVOICE</h2>
            <p style={{ margin: '6px 0 0', fontSize: '0.88rem', color: '#64748b' }}>
              <strong>Date:</strong> {invoiceDate}<br />
              <strong>Payment ID:</strong> <span style={{ fontFamily: 'monospace' }}>{payment.paymentId}</span><br />
              <strong>Order ID:</strong> <span style={{ fontFamily: 'monospace' }}>{payment.orderId}</span>
            </p>
          </div>
        </div>

        {/* Billing details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px', borderTop: '2px solid #f1f5f9', paddingTop: '30px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Billed To</span>
            <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{payment.customerName}</strong>
            <p style={{ margin: '6px 0 0', fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>
              Email: {payment.customerEmail}<br />
              Phone: {payment.customerPhone}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Payment Summary</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#165df5' }}>Paid in Full (INR)</div>
            <p style={{ margin: '6px 0 0', fontSize: '0.88rem', color: '#64748b' }}>
              Method: Razorpay Online Payment<br />
              Status: Captured / Settled
            </p>
          </div>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700, color: '#334155', fontSize: '0.85rem' }}>Description of Service / Asset</th>
              <th style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700, color: '#334155', fontSize: '0.85rem' }}>Qty</th>
              <th style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700, color: '#334155', fontSize: '0.85rem' }}>Price</th>
              <th style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700, color: '#334155', fontSize: '0.85rem' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '18px', color: '#0f172a', fontWeight: 600, fontSize: '0.95rem' }}>
                Rental Space Booking Token — {payment.rentalTitle}
                <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', fontWeight: 400, marginTop: '4px' }}>
                  Secure reservation deposit for listing space. Non-refundable.
                </span>
              </td>
              <td style={{ padding: '18px', textAlign: 'right', color: '#475569' }}>1</td>
              <td style={{ padding: '18px', textAlign: 'right', color: '#475569' }}>₹{baseAmount.toLocaleString('en-IN')}</td>
              <td style={{ padding: '18px', textAlign: 'right', color: '#0f172a', fontWeight: 600 }}>₹{baseAmount.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        {/* Calculation area */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '50px' }}>
          <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Subtotal:</span>
              <strong style={{ color: '#334155' }}>₹{baseAmount.toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>GST (18% integrated):</span>
              <strong style={{ color: '#334155' }}>₹{gstAmount.toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #f1f5f9', paddingTop: '10px', marginTop: '4px', fontSize: '1.2rem' }}>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>Total Paid:</span>
              <strong style={{ color: '#165df5', fontWeight: 900 }}>₹{payment.amount.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
          This is an electronically generated document. No signature is required. Thank you for choosing SuccessTunnel!
        </div>

      </div>

      <style jsx global>{`
        @media print {
          body {
            background: #fff !important;
            padding: 0 !important;
          }
          .invoice-container {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { paymentId } = query
  if (!paymentId || typeof paymentId !== 'string') {
    return { notFound: true }
  }

  // Auth checking
  const cookie = req.headers.cookie || ''
  const adminMatch = cookie.split(';').map(s => s.trim()).find(s => s.startsWith('st_auth='))
  const clientMatch = cookie.split(';').map(s => s.trim()).find(s => s.startsWith('st_client_auth='))

  let decodedUser: any = null
  let isAdmin = false

  if (adminMatch) {
    try {
      decodedUser = jwt.verify(adminMatch.split('=')[1], JWT_SECRET)
      isAdmin = decodedUser.role === 'admin'
    } catch {
      // Ignored, check client auth next
    }
  }

  if (!isAdmin && clientMatch) {
    try {
      decodedUser = jwt.verify(clientMatch.split('=')[1], JWT_SECRET)
    } catch {
      return { redirect: { destination: '/client/login', permanent: false } }
    }
  }

  if (!decodedUser) {
    return { redirect: { destination: '/client/login', permanent: false } }
  }

  // Retrieve payment
  const payment = await prisma.rentalPayment.findFirst({
    where: { paymentId },
  })

  if (!payment) {
    return { notFound: true }
  }

  // Security: Client can only view their own payment invoice
  if (!isAdmin && payment.customerEmail !== decodedUser.email) {
    return {
      redirect: {
        destination: '/client/dashboard?error=unauthorized_invoice',
        permanent: false,
      },
    }
  }

  return {
    props: {
      payment: {
        orderId: payment.orderId,
        paymentId: payment.paymentId,
        customerName: payment.customerName,
        customerEmail: payment.customerEmail,
        customerPhone: payment.customerPhone,
        rentalTitle: payment.rentalTitle,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        createdAt: payment.createdAt.toISOString(),
      },
    },
  }
}
