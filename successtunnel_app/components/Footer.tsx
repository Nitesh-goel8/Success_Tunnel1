import Image from 'next/image'
import Link from 'next/link'
import { useSiteSettings } from './SiteSettingsProvider'
import { toTelHref, toWhatsAppHref } from '../lib/siteSettings'
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  const settings = useSiteSettings()

  return (
    <footer className="site-footer" style={{ background: '#080D18', color: 'var(--muted)', borderTop: '1px solid var(--line)', paddingTop: '64px', paddingBottom: '32px' }}>
      <div className="container footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr', gap: '40px', marginBottom: '48px' }}>
        <div className="footer-brand">
          <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Image
              src="/logo.jpeg"
              alt={`${settings.businessName} Logo`}
              width={38}
              height={38}
              style={{ borderRadius: '8px', objectFit: 'contain', background: '#ffffff', flexShrink: 0, padding: '2px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                {settings.businessName || 'Success Tunnel'}
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', color: '#94a3b8', textTransform: 'uppercase' }}>
                Advisory Group &bull; Panipat
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', lineHeight: '1.65', color: '#94a3b8', marginBottom: '20px', maxWidth: '320px' }}>
            {settings.siteTagline || 'Multidisciplinary advisory partner unifying corporate compliance, business finance, professional education, investment, and commercial real estate.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: '#94a3b8', lineHeight: '1.5' }}>
            <HiOutlineLocationMarker size={18} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '2px' }} />
            <span>{settings.officeAddress || 'First Floor, Sudarshan Tower, Tau Devi Lal Complex, Behind Hive Hotel, Panipat 132103, Haryana'}</span>
          </div>
        </div>

        <div className="footer-column">
          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.04em' }}>Practice Areas</h4>
          <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            <Link href="/services/consultancy" style={{ color: '#94a3b8', textDecoration: 'none' }}>Corporate Consultancy</Link>
            <Link href="/services/finance" style={{ color: '#94a3b8', textDecoration: 'none' }}>Corporate Finance</Link>
            <Link href="/education" style={{ color: '#94a3b8', textDecoration: 'none' }}>Executive Education</Link>
            <Link href="/services/investment" style={{ color: '#94a3b8', textDecoration: 'none' }}>Investment Planning</Link>
            <Link href="/services/real-estate" style={{ color: '#94a3b8', textDecoration: 'none' }}>Commercial Real Estate</Link>
            <Link href="/services/rental-space" style={{ color: '#94a3b8', textDecoration: 'none' }}>Managed Workspaces</Link>
          </div>
        </div>

        <div className="footer-column">
          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.04em' }}>Governance & Firm</h4>
          <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            <Link href="/about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About Us</Link>
            <Link href="/projects" style={{ color: '#94a3b8', textDecoration: 'none' }}>Projects & Case Studies</Link>
            <Link href="/resources" style={{ color: '#94a3b8', textDecoration: 'none' }}>Knowledge Base & Tools</Link>
            <Link href="/properties" style={{ color: '#94a3b8', textDecoration: 'none' }}>Commercial Properties</Link>
            <Link href="/contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact & Enquiries</Link>
            <Link href="/portal/login" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>Staff ERP Portal</Link>
            <Link href="/privacy" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.82rem' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.82rem' }}>Terms of Service</Link>
          </div>
        </div>

        <div className="footer-column">
          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.04em' }}>Panipat Headquarters</h4>
          <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HiOutlineMail size={16} style={{ color: '#38bdf8', flexShrink: 0 }} />
              <a href={`mailto:${settings.contactEmail || 'contact@successtunnel.in'}`} style={{ color: '#e2e8f0', textDecoration: 'none' }}>
                {settings.contactEmail || 'contact@successtunnel.in'}
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HiOutlinePhone size={16} style={{ color: '#38bdf8', flexShrink: 0 }} />
              <a href={`tel:${toTelHref(settings.contactPhone1)}`} style={{ color: '#e2e8f0', textDecoration: 'none' }}>
                {settings.contactPhone1}
              </a>
            </div>
            {settings.contactPhone2 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '24px' }}>
                <a href={`tel:${toTelHref(settings.contactPhone2)}`} style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  {settings.contactPhone2}
                </a>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaWhatsapp size={16} style={{ color: '#22c55e', flexShrink: 0 }} />
              <a href={`https://wa.me/${toWhatsAppHref(settings.whatsappNumber)}`} target="_blank" rel="noreferrer" style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 600 }}>
                Direct WhatsApp Connect
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.82rem', marginTop: '4px' }}>
              <HiOutlineClock size={16} style={{ flexShrink: 0 }} />
              <span>{settings.workingHours || 'Mon - Sat: 10:00 AM - 6:00 PM'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ borderTop: '1px solid #1e293b', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.82rem', color: '#64748b' }}>
        <div>
          &copy; {new Date().getFullYear()} {settings.businessName || 'Success Tunnel'}. Panipat, Haryana, India. All rights reserved.
        </div>
        <div>
          Independent Corporate Advisory, Compliance &amp; Capital Planning Standard.
        </div>
      </div>
    </footer>
  )
}
