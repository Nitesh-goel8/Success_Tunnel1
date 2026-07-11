export interface SiteSettings {
  businessName: string
  siteTitle: string
  siteTagline: string
  siteDescription: string
  siteUrl: string
  contactEmail: string
  contactPhone1: string
  contactPhone2: string
  officeAddress: string
  whatsappNumber: string
  workingHours: string
  mapEmbedUrl: string
  mapLink: string
  contactPerson: string
  contactRole: string
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  businessName: 'Success Tunnel',
  siteTitle: 'Success Tunnel',
  siteTagline: 'Strategy, education, and growth under one roof',
  siteDescription:
    'Success Tunnel provides consultancy, finance, education, investment, real estate, and rental space services for growing businesses and individuals.',
  siteUrl: 'https://successtunnel.in',
  contactEmail: 'successtunnel.in@gmail.com',
  contactPhone1: '+91 89507 71205',
  contactPhone2: '+91 72061 89559',
  officeAddress:
    'First Floor, Sudarshan Tower, Tau Devi Lal Complex, Behind Hive Hotel, Panipat 132103, Haryana, India',
  whatsappNumber: '+918950771205',
  workingHours: 'Mon - Sat: 10:00 AM - 6:00 PM',
  mapEmbedUrl: 'https://www.google.com/maps?q=Sudarshan+Tower+Panipat+Haryana+132103&output=embed',
  mapLink: 'https://maps.app.goo.gl/n4wZ51qrRY1zSPeb8',
  contactPerson: 'Neeraj Aggarwal',
  contactRole: 'Chartered Accountant & Principal Advisor',
}

export const PUBLIC_SITE_SETTING_KEYS = Object.keys(DEFAULT_SITE_SETTINGS) as Array<keyof SiteSettings>

export const PRIVATE_SITE_SETTING_KEYS = [
  'razorpayKeyId',
  'razorpayKeySecret',
  'smtpHost',
  'smtpPort',
  'smtpSecure',
  'smtpUser',
  'smtpPass',
  'smtpFromEmail',
  'enquiryNotificationEmail',
] as const

export function normalizeSiteSettings(values?: Partial<Record<string, string>>): SiteSettings {
  const legacyTaglines = new Set(['A Fastest Way to Big Success'])
  const siteTagline =
    values?.siteTagline && !legacyTaglines.has(values.siteTagline.trim())
      ? values.siteTagline
      : DEFAULT_SITE_SETTINGS.siteTagline

  return {
    ...DEFAULT_SITE_SETTINGS,
    ...values,
    siteTagline,
  }
}

export function toTelHref(value: string) {
  const normalized = value.replace(/[^\d+]/g, '')
  return normalized.startsWith('+') ? normalized : `+${normalized.replace(/[^\d]/g, '')}`
}

export function toWhatsAppHref(value: string) {
  return value.replace(/\D/g, '')
}
