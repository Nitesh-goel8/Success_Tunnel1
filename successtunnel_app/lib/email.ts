import nodemailer from 'nodemailer'
import { prisma } from './prisma'

type SendEnquiryEmailInput = {
  to: string
  replyTo: string
  subject: string
  html: string
}

async function getSetting(key: string) {
  const row = await prisma.siteSetting.findUnique({ where: { key } })
  return row?.value || null
}

async function getSmtpConfig() {
  const host = process.env.SMTP_HOST || await getSetting('smtpHost')
  const portValue = process.env.SMTP_PORT || await getSetting('smtpPort')
  const user = process.env.SMTP_USER || await getSetting('smtpUser')
  const pass = process.env.SMTP_PASS || await getSetting('smtpPass')
  const from = process.env.SMTP_FROM_EMAIL || await getSetting('smtpFromEmail')
  const secureValue = process.env.SMTP_SECURE || await getSetting('smtpSecure')
  const port = portValue ? Number(portValue) : 587

  if (!host || !user || !pass || !from) {
    return null
  }

  return {
    host,
    port,
    secure: secureValue === 'true' || port === 465,
    auth: { user, pass },
    from,
  }
}

export async function sendEnquiryNotification(input: SendEnquiryEmailInput) {
  const config = await getSmtpConfig()
  if (!config) {
    return { sent: false, reason: 'smtp_not_configured' as const }
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  })

  await transporter.sendMail({
    from: config.from,
    to: input.to,
    replyTo: input.replyTo,
    subject: input.subject,
    html: input.html,
  })

  return { sent: true as const }
}
