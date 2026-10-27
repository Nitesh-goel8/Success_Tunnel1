import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useSiteSettings } from './SiteSettingsProvider'
import { HiOutlineChevronDown } from 'react-icons/hi'

const practiceAreas = [
  { href: '/services/consultancy', label: 'Corporate Consultancy' },
  { href: '/services/finance', label: 'Corporate Finance' },
  { href: '/education', label: 'Executive Education' },
  { href: '/services/investment', label: 'Investment Planning' },
  { href: '/services/real-estate', label: 'Commercial Real Estate' },
  { href: '/services/rental-space', label: 'Managed Workspaces' },
]

export default function Nav() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [servicesDropdown, setServicesDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const settings = useSiteSettings()

  useEffect(() => {
    setOpen(false)
    setServicesDropdown(false)
  }, [router.asPath])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const activePath = useMemo(() => router.asPath, [router.asPath])

  return (
    <header
      className="site-header"
      style={{
        background: scrolled ? 'rgba(255, 255, 255, 0.92)' : 'rgba(251, 251, 253, 0.85)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.04)' : 'none',
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <div className="container nav-inner" style={{ padding: '14px 0' }}>
        <Link href="/" className="brand" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <Image
            src="/logo.jpeg"
            alt="Success Tunnel Logo"
            width={40}
            height={40}
            style={{ borderRadius: '10px', objectFit: 'contain', background: '#ffffff', border: '1px solid #e5e5ea', padding: '2px' }}
            priority
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              {settings.businessName || 'Success Tunnel'}
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', color: '#86868b', textTransform: 'uppercase' }}>
              Advisory Group &bull; Corporate Chambers
            </span>
          </div>
        </Link>

        <button
          className="nav-toggle"
          type="button"
          onClick={() => setOpen(value => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation"
          style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', color: 'var(--text)' }}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        <nav className={`nav-main ${open ? 'is-open' : ''}`}>
          {/* Practice Areas dropdown */}
          <div
            className="nav-dropdown"
            onMouseEnter={() => setServicesDropdown(true)}
            onMouseLeave={() => setServicesDropdown(false)}
            style={{ position: 'relative' }}
          >
            <Link
              href="/services"
              className={`nav-link ${activePath.startsWith('/services') || activePath === '/education' ? 'active' : ''}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              Practice Areas
              <HiOutlineChevronDown size={14} style={{ opacity: 0.7 }} />
            </Link>

            {servicesDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '260px',
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '12px',
                  boxShadow: '0 16px 36px rgba(15, 23, 42, 0.12)',
                  padding: '8px',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                {practiceAreas.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      padding: '8px 12px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: activePath === item.href ? 'var(--accent)' : 'var(--text)',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      background: activePath === item.href ? 'var(--surface-soft)' : 'transparent',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/projects" className={`nav-link ${activePath.startsWith('/projects') ? 'active' : ''}`}>
            Projects
          </Link>

          <Link href="/resources" className={`nav-link ${activePath.startsWith('/resources') ? 'active' : ''}`}>
            Resources
          </Link>

          <Link href="/about" className={`nav-link ${activePath === '/about' ? 'active' : ''}`}>
            About
          </Link>

          <Link href="/contact" className={`nav-link ${activePath === '/contact' ? 'active' : ''}`}>
            Contact
          </Link>
        </nav>

        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            href="/portal/dashboard"
            className="btn btn-secondary"
            style={{
              padding: '8px 16px',
              fontSize: '0.84rem',
              fontWeight: 600,
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Staff Portal</span>
          </Link>
          <Link
            href="/contact"
            className="btn btn-primary"
            style={{
              padding: '9px 20px',
              fontSize: '0.88rem',
              fontWeight: 600,
              borderRadius: '999px',
            }}
          >
            Book Consultation &rarr;
          </Link>
        </div>
      </div>
    </header>
  )
}
