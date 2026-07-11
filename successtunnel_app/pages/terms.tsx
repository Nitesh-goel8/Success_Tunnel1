import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Link from 'next/link'
import { useSiteSettings } from '../components/SiteSettingsProvider'

const terms = [
  {
    title: 'Use of the website',
    text: 'The website is provided for general information, enquiry submission, service discovery, and content access.',
  },
  {
    title: 'Service scope',
    text: 'Any advisory work, filings, bookings, or transactions are subject to separate confirmations, availability, and applicable service terms.',
  },
  {
    title: 'Accuracy of information',
    text: 'We aim to keep information current, but we do not guarantee that every page is error-free or suitable for every situation.',
  },
  {
    title: 'User responsibilities',
    text: 'You are responsible for providing accurate details, reviewing submissions before sending, and using the site lawfully.',
  },
]

export default function Terms() {
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
                Terms of Service
              </h1>
              <p style={{ margin: '18px 0 0', maxWidth: 700, color: 'var(--muted)', fontSize: '1.06rem' }}>
                These terms describe how the website may be used and the general expectations around our services.
              </p>
            </div>
            <div className="article-feature">
              <div className="service-card-kicker">Important</div>
              <h2 style={{ margin: '14px 0 0', fontSize: '2rem', lineHeight: 1.04 }}>Review before production use.</h2>
              <p style={{ marginTop: 14 }}>
                This is a practical draft and should be checked by legal counsel for your final launch jurisdiction.
              </p>
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="container" style={{ maxWidth: '960px' }}>
            <div className="section-heading">
              <span className="eyebrow">TERMS SUMMARY</span>
              <h2>How the site and services should be used.</h2>
              <p>A clear, plain-English baseline that matches the current website experience.</p>
            </div>

            <div className="value-grid">
              {terms.map(item => (
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
                <span className="eyebrow">LIMITATIONS</span>
                <h2>What users should expect.</h2>
                <p>
                  Content on this website may include general guidance, educational information, or service summaries.
                  It should not be treated as a substitute for tailored professional advice unless explicitly confirmed.
                </p>
                <p>
                  We may update site content, features, or availability at any time. Continued use of the site after an
                  update indicates acceptance of the revised terms.
                </p>
              </div>

              <div className="panel-card">
                <div className="service-card-kicker">Contact</div>
                <h3 style={{ marginTop: 12 }}>Questions about these terms?</h3>
                <p style={{ marginTop: 10, color: 'var(--muted)' }}>
                  Reach out if you need clarification on any service or policy language.
                </p>
                <div style={{ display: 'grid', gap: '10px', marginTop: '18px' }}>
                  <div><strong style={{ color: 'var(--primary)' }}>Email:</strong> {settings.contactEmail}</div>
                  <div><strong style={{ color: 'var(--primary)' }}>Phone:</strong> {settings.contactPhone1}</div>
                </div>
                <Link href="/contact" className="btn btn-primary" style={{ marginTop: '22px', width: 'fit-content' }}>
                  Contact Support
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
