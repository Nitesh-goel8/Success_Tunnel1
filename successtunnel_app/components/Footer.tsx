import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Image
              src="/logo.jpeg"
              alt="SuccessTunnel Logo"
              width={40}
              height={40}
              style={{ borderRadius: '8px', objectFit: 'contain', background: '#fff', flexShrink: 0 }}
            />
            <span>SuccessTunnel</span>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.65', marginBottom: '16px' }}>
            A Fastest Way to Big Success — Your trusted partner for consultancy, finance, education, investment &amp; real estate.
          </p>
          <p style={{ fontSize: '0.82rem', opacity: 0.65, lineHeight: '1.5' }}>
            First Floor, Sudarshan Tower<br />
            Tau Devi Lal Complex, Behind Hive Hotel<br />
            Panipat 132103, Haryana, India
          </p>
        </div>

        <div className="footer-column">
          <h4>Services</h4>
          <div className="footer-links">
            <Link href="/services/consultancy">Consultancy</Link>
            <Link href="/services/finance">Finance</Link>
            <Link href="/services/education">Education</Link>
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
            <a href="mailto:successtunnel.in@gmail.com">successtunnel.in@gmail.com</a>
            <a href="tel:+918950771205">+91 89507 71205</a>
            <a href="tel:+917206189559">+91 72061 89559</a>
            <a href="https://wa.me/918950771205" target="_blank" rel="noreferrer">
              💬 WhatsApp Us
            </a>
            <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>Mon–Sat: 10:00 AM – 6:00 PM</span>
          </div>
        </div>
      </div>

      <div className="footer-divider">© {new Date().getFullYear()} SuccessTunnel. All rights reserved. | Neeraj Aggarwal, CA</div>
    </footer>
  )
}
