import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

async function getStoredSetting(key: string) {
  const row = await prisma.siteSetting.findUnique({ where: { key } })
  return row?.value || null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { amount, customerName, customerEmail, customerPhone, rentalTitle } = req.body

  if (!amount || !customerName || !customerEmail || !customerPhone || !rentalTitle) {
    return res.status(400).json({ error: 'Missing required parameters' })
  }

  const parsedAmount = Number(amount)
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than zero' })
  }

  const keyId = process.env.RAZORPAY_KEY_ID || await getStoredSetting('razorpayKeyId')
  const keySecret = process.env.RAZORPAY_KEY_SECRET || await getStoredSetting('razorpayKeySecret')

  if (!keyId || !keySecret) {
    return res.status(500).json({ error: 'Razorpay keys not configured on server' })
  }

  try {
    // Razorpay amount is in paise (e.g. 500 INR = 50000 paise)
    const amountInPaise = Math.round(parsedAmount * 100)

    // Call Razorpay API
    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64')
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Razorpay API error: ${errText}`)
    }

    const orderData = await response.json()

    // Save payment record in DB
    await prisma.rentalPayment.create({
      data: {
        orderId: orderData.id,
        customerName,
        customerEmail,
        customerPhone,
        rentalTitle,
        amount: amountInPaise,
        status: 'created'
      }
    })

    return res.json({
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      keyId
    })
  } catch (error: any) {
    console.error('Order creation error:', error)
    return res.status(500).json({ error: error.message })
  }
}
