import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import crypto from 'crypto'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing signature verification parameters' })
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keySecret) {
    return res.status(500).json({ error: 'Razorpay secret not configured on server' })
  }

  try {
    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex')

    const isValid = generatedSignature === razorpay_signature

    if (!isValid) {
      // Mark payment as failed in database
      try {
        await prisma.rentalPayment.update({
          where: { orderId: razorpay_order_id },
          data: { status: 'failed' }
        })
      } catch (dbErr) {
        console.error('Failed to update db status to failed', dbErr)
      }

      return res.status(400).json({ error: 'Invalid signature. Payment verification failed.' })
    }

    // Mark as paid in database
    await prisma.rentalPayment.update({
      where: { orderId: razorpay_order_id },
      data: {
        status: 'paid',
        paymentId: razorpay_payment_id
      }
    })

    return res.json({ success: true, message: 'Payment verified successfully.' })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return res.status(500).json({ error: error.message })
  }
}
