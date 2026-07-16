import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'
import { checkRateLimit } from '../../lib/rateLimit'
import { sendEnquiryNotification } from '../../lib/email'
import { pushLeadToCRM } from '../../lib/crm'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { name, email, phone, city, service, message, page, website } = req.body

  if (website) return res.status(400).json({ error: 'spam detected' })

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'
  const rateLimit = checkRateLimit(`enquiry:${ip}`, 5, 15 * 60 * 1000)
  if (!rateLimit.allowed) {
    return res.status(429).json({ error: 'Too many enquiries sent from this connection. Please try again later.' })
  }

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

    const notificationSetting = await prisma.siteSetting.findUnique({ where: { key: 'enquiryNotificationEmail' } })
    const destinationEmail = process.env.ENQUIRY_NOTIFICATION_EMAIL || notificationSetting?.value || process.env.ADMIN_EMAIL
    if (destinationEmail) {
      const html = `
        <h2>New Success Tunnel Enquiry</h2>
        <p><strong>Name:</strong> ${String(name).trim()}</p>
        <p><strong>Email:</strong> ${cleanEmail}</p>
        <p><strong>Phone:</strong> ${cleanPhone}</p>
        <p><strong>City:</strong> ${city ? String(city).trim() : '-'}</p>
        <p><strong>Service:</strong> ${service ? String(service).trim() : '-'}</p>
        <p><strong>Source Page:</strong> ${page ? String(page).trim() : '-'}</p>
        <p><strong>Message:</strong><br />${message ? String(message).trim().replace(/\n/g, '<br />') : '-'}</p>
        <p><strong>Enquiry ID:</strong> ${e.id}</p>
      `

      try {
        await sendEnquiryNotification({
          to: destinationEmail,
          replyTo: cleanEmail,
          subject: `New enquiry from ${String(name).trim()}`,
          html,
        })
      } catch (mailError) {
        console.error('Failed to send enquiry notification:', mailError)
      }
    }

    // Push the lead to the CRM (e.g., Salesforce, HubSpot)
    await pushLeadToCRM({
      id: e.id,
      name: String(name).trim(),
      email: cleanEmail,
      phone: cleanPhone,
      city: city ? String(city).trim() : null,
      service: service ? String(service).trim() : null,
      message: message ? String(message).trim() : null,
      page: page ? String(page).trim() : null,
      source: 'Success Tunnel Website'
    })

    return res.status(201).json({ ok: true, id: e.id })
  } catch (err) {
    console.error("Enquiry API Error:", err);

    return res.status(500).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
