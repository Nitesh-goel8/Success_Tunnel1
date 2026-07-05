import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

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
        <Link href="/" className="brand">
          Success Tunnel
        </Link>

        <button className="nav-toggle" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open}>
          Menu
        </button>

        <nav className={`nav-main ${open ? 'is-open' : ''}`}>
          {links.map(link => {
            const isActive =
              activePath === link.href ||
              (link.href.startsWith('/services') && activePath.startsWith(link.href)) ||
              (link.href === '/services/real-estate' &&
                (activePath.startsWith('/services/real-estate') || activePath.startsWith('/properties'))) ||
              (link.href === '/services/rental-space' && activePath.startsWith('/services/rental-space'))

            return (
              <Link key={link.label} href={link.href} className={`nav-link ${isActive ? 'active' : ''}`}>
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="nav-actions">
          <Link href="/#contact" className="btn btn-nav">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
