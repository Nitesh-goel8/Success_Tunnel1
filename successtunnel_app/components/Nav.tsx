import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'

const links = [
  { href: '/services/consultancy', label: 'Consultancy' },
  { href: '/services/finance', label: 'Finance' },
  { href: '/services/education', label: 'Education' },
  { href: '/services/investment', label: 'Investment' },
  { href: '/services/real-estate', label: 'Real Estate' },
  { href: '/services/rental-space', label: 'Rental Space' },
]

export default function Nav() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [router.asPath])

  const activePath = useMemo(() => router.asPath, [router.asPath])

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Link href="/" className="brand" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <Image
            src="/logo.jpeg"
            alt="SuccessTunnel Logo"
            width={44}
            height={44}
            style={{ borderRadius: '8px', objectFit: 'contain', background: '#fff', boxShadow: '0 2px 8px rgba(22, 93, 245, 0.12)' }}
            priority
          />
          <span>SuccessTunnel</span>
        </Link>

        <button className="nav-toggle" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-label="Toggle navigation">
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
          {links.map(link => {
            const isActive =
              activePath === link.href ||
              (link.href !== '/' && activePath.startsWith(link.href))

            return (
              <Link key={link.label} href={link.href} className={`nav-link ${isActive ? 'active' : ''}`}>
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="nav-actions">
          <Link href="/contact" className="btn btn-nav" style={{ borderRadius: '12px', padding: '10px 20px', gap: '6px' }}>
            Book Consultation &rarr;
          </Link>
        </div>
      </div>
    </header>
  )
}
