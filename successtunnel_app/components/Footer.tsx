import Image from 'next/image'
import Link from 'next/link'
import { useSiteSettings } from './SiteSettingsProvider'
import { toTelHref, toWhatsAppHref } from '../lib/siteSettings'

export default function Footer() {
  const settings = useSiteSettings()

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Image
              src="/logo.jpeg"
              alt={`${settings.businessName} Logo`}
              width={40}
              height={40}
              style={{ borderRadius: '8px', objectFit: 'contain', background: '#fff', flexShrink: 0 }}
            />
            <span>{settings.businessName}</span>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.65', marginBottom: '16px' }}>
            {settings.siteTagline} - Your trusted partner for consultancy, finance, education, investment &amp; real estate.
          </p>
          <p style={{ fontSize: '0.82rem', opacity: 0.65, lineHeight: '1.5' }}>{settings.officeAddress}</p>
        </div>

        <div className="footer-column">
          <h4>Services</h4>
          <div className="footer-links">
            <Link href="/services/consultancy">Consultancy</Link>
            <Link href="/services/finance">Finance</Link>
            <Link href="/education">Education</Link>
            <Link href="/services/investment">Investment</Link>
            <Link href="/services/real-estate">Real Estate</Link>
            <Link href="/services/rental-space">Rental Space</Link>
          </div>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <div className="footer-links">
            <Link href="/about">About Us</Link>
            <Link href="/properties">Properties</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>

        <div className="footer-column">
          <h4>Get in Touch</h4>
          <div className="footer-links">
            <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
            <a href={`tel:${toTelHref(settings.contactPhone1)}`}>{settings.contactPhone1}</a>
            <a href={`tel:${toTelHref(settings.contactPhone2)}`}>{settings.contactPhone2}</a>
            <a href={`https://wa.me/${toWhatsAppHref(settings.whatsappNumber)}`} target="_blank" rel="noreferrer">
              WhatsApp Us
            </a>
            <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>{settings.workingHours}</span>
          </div>
        </div>
      </div>

      <div className="footer-divider">
        &copy; {new Date().getFullYear()} {settings.businessName}. All rights reserved. 
      </div>
    </footer>
  )
}
