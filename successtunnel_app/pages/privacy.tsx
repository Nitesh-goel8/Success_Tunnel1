import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Link from 'next/link'
import { useSiteSettings } from '../components/SiteSettingsProvider'

const sections = [
  {
    title: 'Information we collect',
    text: 'We may collect the details you submit through forms, such as your name, phone number, email address, city, service request, and message.',
  },
  {
    title: 'How we use it',
    text: 'We use that information to respond to enquiries, prepare proposals, coordinate services, and improve the website experience.',
  },
  {
    title: 'Sharing and access',
    text: 'We do not sell your personal data. We may share information only with trusted service providers that help us operate the site or deliver requested services.',
  },
  {
    title: 'Cookies and analytics',
    text: 'We may use cookies and analytics tools to understand traffic patterns, measure performance, and improve content relevance.',
  },
]

export default function Privacy() {
  const settings = useSiteSettings()

  return (
    <div>
      <Nav />
      <main>
        <section className="page-hero">
          <div className="container article-hero">
            <div>
              <span className="eyebrow">Legal</span>
              <h1 style={{ margin: '18px 0 0', fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 0.98, letterSpacing: '-.05em' }}>
                Privacy Policy
              </h1>
              <p style={{ margin: '18px 0 0', maxWidth: 700, color: 'var(--muted)', fontSize: '1.06rem' }}>
                This policy explains how Success Tunnel handles the information shared through the website and enquiry forms.
              </p>
            </div>
            <div className="article-feature">
              <div className="service-card-kicker">Last updated</div>
              <h2 style={{ margin: '14px 0 0', fontSize: '2rem', lineHeight: 1.04 }}>Please review before launch.</h2>
              <p style={{ marginTop: 14 }}>
                Replace or review this policy with legal counsel before production if you need jurisdiction-specific wording.
              </p>
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="container" style={{ maxWidth: '960px' }}>
            <div className="section-heading">
              <span className="eyebrow">PRIVACY SUMMARY</span>
              <h2>How we handle visitor information.</h2>
              <p>We keep the policy simple, readable, and aligned to the way the site actually works.</p>
            </div>

            <div className="value-grid">
              {sections.map(item => (
                <div key={item.title} className="value-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-surface" style={{ background: '#f8fafc' }}>
          <div className="container" style={{ maxWidth: '960px' }}>
            <div className="split-grid">
              <div className="split-content">
                <span className="eyebrow">RETENTION & RIGHTS</span>
                <h2>Your data, retained only as needed.</h2>
                <p>
                  We keep enquiry and support records for as long as needed to manage the request, comply with legal or
                  operational obligations, and maintain business records.
                </p>
                <p>
                  If you want to review, update, or delete information you submitted, please contact us and we will
                  handle the request as permitted by applicable law.
                </p>
              </div>

              <div className="panel-card">
                <div className="service-card-kicker">Contact</div>
                <h3 style={{ marginTop: 12 }}>Privacy questions</h3>
                <p style={{ marginTop: 10, color: 'var(--muted)' }}>
                  For questions about this policy or your data, reach out using the details below.
                </p>
                <div style={{ display: 'grid', gap: '10px', marginTop: '18px' }}>
                  <div><strong style={{ color: 'var(--primary)' }}>Email:</strong> {settings.contactEmail}</div>
                  <div><strong style={{ color: 'var(--primary)' }}>Phone:</strong> {settings.contactPhone1}</div>
                </div>
                <Link href="/contact" className="btn btn-primary" style={{ marginTop: '22px', width: 'fit-content' }}>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
