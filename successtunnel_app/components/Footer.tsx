import Image from 'next/image'
import Link from 'next/link'
import { useSiteSettings } from './SiteSettingsProvider'
import { toTelHref, toWhatsAppHref } from '../lib/siteSettings'
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineClock,
  HiShieldCheck,
  HiArrowRight,
} from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  const settings = useSiteSettings()

  return (
    <footer
      className="site-footer"
      style={{
        background: 'linear-gradient(180deg, #090d16 0%, #050810 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#94a3b8',
        padding: '72px 0 32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.4), transparent)',
        }}
      />

      <div className="container">
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Column 1: Brand & Headquarters Identity */}
          <div className="footer-brand" style={{ maxWidth: '360px' }}>
            <div
              className="brand"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: '#0f172a',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/logo.jpeg"
                  alt={`${settings.businessName} Logo`}
                  width={38}
                  height={38}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 900,
                  color: '#f8fafc',
                  fontFamily: "'Sora', sans-serif",
                  letterSpacing: '-0.03em',
                }}
              >
                {settings.businessName}
              </span>
            </div>

            <p style={{ fontSize: '0.92rem', lineHeight: '1.7', color: '#94a3b8', marginBottom: '16px' }}>
              Multidisciplinary strategic advisory unifying corporate tax, finance planning, professional education, investment management, and commercial real estate.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                color: '#cbd5e1',
                fontSize: '0.85rem',
                lineHeight: '1.5',
              }}
            >
              <HiOutlineLocationMarker size={18} style={{ color: '#38bdf8', marginTop: '2px', flexShrink: 0 }} />
              <span>{settings.officeAddress}</span>
            </div>
          </div>

          {/* Column 2: Advisory Services */}
          <div className="footer-column">
            <h4
              style={{
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#f8fafc',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '18px',
                fontFamily: "'Sora', sans-serif",
              }}
            >
              Practice Areas
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/services/consultancy" className="footer-link">
                Corporate Consultancy &bull; Tax
              </Link>
              <Link href="/services/finance" className="footer-link">
                Financial Direction &bull; Debt
              </Link>
              <Link href="/education" className="footer-link">
                Professional Education &bull; Tally
              </Link>
              <Link href="/services/investment" className="footer-link">
                Investment Advisory &bull; Capital
              </Link>
              <Link href="/services/real-estate" className="footer-link">
                Commercial Real Estate &bull; Land
              </Link>
              <Link href="/services/rental-space" className="footer-link">
                Managed Rental Spaces &bull; Suites
              </Link>
            </div>
          </div>

          {/* Column 3: Company & Governance */}
          <div className="footer-column">
            <h4
              style={{
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#f8fafc',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '18px',
                fontFamily: "'Sora', sans-serif",
              }}
            >
              Company &amp; Governance
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/about" className="footer-link">
                About Success Tunnel
              </Link>
              <Link href="/projects" className="footer-link">
                Public Projects &amp; Case Studies
              </Link>
              <Link href="/resources" className="footer-link">
                Resources, Calculators &amp; Notes
              </Link>
              <Link href="/properties" className="footer-link">
                Commercial Properties Portfolio
              </Link>
              <Link href="/contact" className="footer-link">
                Schedule Consultation
              </Link>
              <Link href="/portal/login" className="footer-link" style={{ color: '#38bdf8' }}>
                Staff ERP Enterprise Portal &rarr;
              </Link>
              <Link href="/privacy" className="footer-link">
                Privacy Policy
              </Link>
              <Link href="/terms" className="footer-link">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Column 4: Contact & Office Access */}
          <div className="footer-column">
            <h4
              style={{
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#f8fafc',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '18px',
                fontFamily: "'Sora', sans-serif",
              }}
            >
              Direct Advisory Office
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={`mailto:${settings.contactEmail}`}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.9rem', textDecoration: 'none' }}
              >
                <HiOutlineMail size={16} style={{ color: '#38bdf8' }} />
                <span>{settings.contactEmail}</span>
              </a>

              <a
                href={`tel:${toTelHref(settings.contactPhone1)}`}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.9rem', textDecoration: 'none' }}
              >
                <HiOutlinePhone size={16} style={{ color: '#38bdf8' }} />
                <span>{settings.contactPhone1}</span>
              </a>

              <a
                href={`https://wa.me/${toWhatsAppHref(settings.whatsappNumber)}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}
              >
                <FaWhatsapp size={16} />
                <span>WhatsApp Instant Coordination</span>
              </a>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                <HiOutlineClock size={16} />
                <span>{settings.workingHours || 'Mon - Sat: 10:00 AM - 6:00 PM'}</span>
              </div>

              <div
                style={{
                  marginTop: '8px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                }}
              >
                Principal Advisor: {settings.contactPerson || 'Neeraj Aggarwal, CA'}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Divider & Rights */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.84rem',
            color: '#64748b',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} {settings.businessName}. All rights reserved. Panipat, Haryana, India.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/privacy" style={{ color: '#64748b', textDecoration: 'none' }}>
              Privacy
            </Link>
            <span>&bull;</span>
            <Link href="/terms" style={{ color: '#64748b', textDecoration: 'none' }}>
              Terms
            </Link>
            <span>&bull;</span>
            <Link href="/contact" style={{ color: '#38bdf8', textDecoration: 'none' }}>
              Panipat Headquarters
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
