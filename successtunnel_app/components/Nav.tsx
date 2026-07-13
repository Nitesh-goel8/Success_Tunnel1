import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSiteSettings } from './SiteSettingsProvider'

const links = [{ href: '/', label: 'Home' }, { href: '/services', label: 'Services' }, { href: '/about', label: 'About us' }, { href: '/contact', label: 'Contact' }]

export default function Nav() {
  const router = useRouter()
  const settings = useSiteSettings()
  const [open, setOpen] = useState(false)
  const activePath = useMemo(() => router.asPath, [router.asPath])

  useEffect(() => { setOpen(false) }, [router.asPath])

  return <header className="site-header"><div className="container nav-inner">
    <Link href="/" className="brand brand-lockup" aria-label={`${settings.businessName} home`}><Image src="/logo.jpeg" alt="" width={34} height={34} priority /><span>{settings.businessName}</span></Link>
    <button className="nav-toggle" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-label="Toggle navigation">{open ? 'Close' : 'Menu'}</button>
    <nav className={'nav-main ' + (open ? 'is-open' : '')} aria-label="Main navigation">
      {links.map(link => { const active = link.href === '/' ? activePath === '/' : activePath.startsWith(link.href); return <Link key={link.href} href={link.href} className={'nav-link ' + (active ? 'active' : '')}>{link.label}</Link> })}
      <Link href="/client/login" className={'nav-link nav-link-mobile-only ' + (activePath.startsWith('/client/login') ? 'active' : '')}>Log in</Link>
      <Link href="/client/signup" className={'nav-link nav-link-mobile-only ' + (activePath.startsWith('/client/signup') ? 'active' : '')}>Sign up</Link>
    </nav>
    <div className="nav-actions">
      <Link href="/client/login" className="nav-link nav-link-auth">Log in</Link>
      <Link href="/client/signup" className="btn btn-nav btn-signup">Sign up</Link>
      <Link href="/contact#enquiry" className="btn btn-nav btn-talk">Talk to us</Link>
    </div>
  </div></header>
}
