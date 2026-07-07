import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { name, email, phone, city, service, message, page } = req.body
  const cleanEmail = String(email || '').trim().toLowerCase()
  const cleanPhone = String(phone || '').trim()
  const phoneDigits = cleanPhone.replace(/\D/g, '')

  if (!name || !cleanEmail || !cleanPhone) return res.status(400).json({ error: 'name, email and phone are required' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return res.status(400).json({ error: 'valid email required' })
  if (phoneDigits.length < 10) return res.status(400).json({ error: 'valid phone required' })

  try {
    const e = await prisma.enquiry.create({
      data: {
        name: String(name).trim(),
        email: cleanEmail,
        phone: cleanPhone,
        city: city ? String(city).trim() : null,
        service: service ? String(service).trim() : null,
        message: message ? String(message).trim() : null,
        page: page ? String(page).trim() : null
      }
    })
    // TODO: send email notification (SMTP)
    return res.status(201).json({ ok: true, id: e.id })
  } catch (err) {
    console.error("Enquiry API Error:", err);

    return res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
