import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useSiteSettings } from './SiteSettingsProvider'
import { HiArrowRight } from 'react-icons/hi'

const navLinks = [
  { href: '/services/consultancy', label: 'Consultancy' },
  { href: '/services/finance', label: 'Finance' },
  { href: '/education', label: 'Education' },
  { href: '/services/investment', label: 'Investment' },
  { href: '/services/real-estate', label: 'Real Estate' },
  { href: '/services/rental-space', label: 'Rental Space' },
  { href: '/projects', label: 'Projects' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const settings = useSiteSettings()

  useEffect(() => {
    setOpen(false)
  }, [router.asPath])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const activePath = useMemo(() => router.asPath, [router.asPath])

  return (
    <header
      className={`site-header ${scrolled ? 'is-scrolled' : ''}`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        background: scrolled ? 'rgba(7, 11, 20, 0.92)' : 'rgba(7, 11, 20, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(56, 189, 248, 0.18)' : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: scrolled ? '0 12px 36px rgba(0, 0, 0, 0.5)' : 'none',
      }}
    >
      <div className="container nav-inner" style={{ padding: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="brand"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              overflow: 'hidden',
              background: '#0f172a',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src="/logo.jpeg"
              alt="Success Tunnel Logo"
              width={40}
              height={40}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#f8fafc',
                letterSpacing: '-0.03em',
                fontFamily: "'Sora', sans-serif",
                lineHeight: 1.1,
              }}
            >
              {settings.businessName}
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                color: '#38bdf8',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Panipat &bull; Strategic Advisory
            </span>
          </div>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          className="nav-toggle"
          type="button"
          onClick={() => setOpen(value => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation"
          style={{
            display: 'none',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            color: '#f8fafc',
            padding: '8px 10px',
            cursor: 'pointer',
          }}
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

        {/* Desktop Navigation Links */}
        <nav className={`nav-main ${open ? 'is-open' : ''}`}>
          {navLinks.map(link => {
            const isActive =
              activePath === link.href ||
              (link.href !== '/' && activePath.startsWith(link.href))

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                style={{
                  color: isActive ? '#38bdf8' : '#cbd5e1',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  position: 'relative',
                  padding: '8px 4px',
                  transition: 'color 0.2s ease',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            href="/portal/login"
            style={{
              color: '#94a3b8',
              fontSize: '0.84rem',
              fontWeight: 600,
              padding: '8px 14px',
              textDecoration: 'none',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.03)',
              transition: 'all 0.2s ease',
            }}
          >
            ERP Portal
          </Link>

          <Link
            href="/contact"
            className="btn btn-nav"
            style={{
              borderRadius: '10px',
              padding: '9px 18px',
              fontSize: '0.88rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
              color: '#ffffff',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 18px rgba(37, 99, 235, 0.35)',
              textDecoration: 'none',
            }}
          >
            Consultation <HiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  )
}
