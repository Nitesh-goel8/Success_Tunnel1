import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useSiteSettings } from '../components/SiteSettingsProvider'

const strengths = [
  {
    title: 'Multi-service guidance',
    text: 'One coordinated team for consultancy, finance, education, investment, real estate, and rental space needs.',
  },
  {
    title: 'Clear next steps',
    text: 'We keep engagements structured so clients know what happens, when it happens, and what they need to provide.',
  },
  {
    title: 'Business-first thinking',
    text: 'Every recommendation is meant to support growth, reduce friction, and improve decision-making.',
  },
  {
    title: 'Responsive support',
    text: 'Fast communication matters. We aim to keep momentum moving without adding unnecessary complexity.',
  },
]

const process = [
  {
    step: '01',
    title: 'Understand the brief',
    text: 'We start by learning the goal, scope, and timeline so the right service path is clear from the beginning.',
  },
  {
    step: '02',
    title: 'Define the plan',
    text: 'We align the work into a practical sequence with the right documents, dependencies, and approvals.',
  },
  {
    step: '03',
    title: 'Execute with care',
    text: 'Our team handles the work in an organized way and keeps communication simple throughout the engagement.',
  },
  {
    step: '04',
    title: 'Support the outcome',
    text: 'Once the immediate need is complete, we stay available for follow-up, refinement, and related guidance.',
  },
]

const serviceAreas = [
  {
    title: 'Consultancy',
    text: 'Tax, compliance, registrations, entity setup, and advisory support for individuals and businesses.',
  },
  {
    title: 'Finance',
    text: 'Planning, funding support, and financial direction for growth-minded clients.',
  },
  {
    title: 'Education',
    text: 'Learning support, study material, and practical content for students and professionals.',
  },
  {
    title: 'Investment',
    text: 'Decision support for better capital allocation and longer-term financial confidence.',
  },
  {
    title: 'Real Estate',
    text: 'Property guidance for acquisition, portfolio planning, and commercial decision-making.',
  },
  {
    title: 'Rental Space',
    text: 'Office and workspace options with booking support and client-friendly coordination.',
  },
]

export default function About() {
  const settings = useSiteSettings()

  return (
    <div>
      <Nav />
      <main>
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '52px' }}>
          <div className="container" style={{ maxWidth: '820px', textAlign: 'center' }}>
            <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)', marginBottom: '24px' }}>
              ABOUT US
            </span>
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
                lineHeight: '1.08',
                letterSpacing: '-0.04em',
                fontWeight: 800,
                color: 'var(--primary)',
                margin: '20px auto 24px',
              }}
            >
              A single partner for growth, clarity, and execution.
            </h1>
            <p style={{ fontSize: '1.14rem', color: 'var(--muted)', lineHeight: '1.7' }}>
              Success Tunnel brings consulting, finance, education, investment, and property support together in one
              place so clients can move forward with less friction and more confidence.
            </p>
          </div>
        </section>

        <section className="section-surface">
          <div className="container" style={{ maxWidth: '980px' }}>
            <div className="split-grid">
              <div className="split-content">
                <span className="eyebrow">OUR PURPOSE</span>
                <h2>We simplify the work that slows people down.</h2>
                <p>
                  Many clients do not need more noise — they need a reliable team that can connect the dots across
                  compliance, finance, education, property, and everyday advisory work. That is the role we are built
                  to play.
                </p>
                <p>
                  We focus on clarity, practical next steps, and a professional experience that feels organized from
                  the first conversation to final delivery.
                </p>
              </div>

              <div className="panel-card" style={{ padding: '28px' }}>
                <span className="eyebrow">WHAT WE VALUE</span>
                <h3 style={{ marginTop: 12 }}>How we try to work</h3>
                <div style={{ display: 'grid', gap: '14px', marginTop: '18px' }}>
                  {strengths.slice(0, 4).map(item => (
                    <div key={item.title} style={{ padding: '14px 0', borderTop: '1px solid var(--line)' }}>
                      <strong style={{ display: 'block', color: 'var(--primary)', marginBottom: '6px' }}>{item.title}</strong>
                      <span style={{ color: 'var(--muted)', lineHeight: '1.6' }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-surface" style={{ background: '#f8fafc' }}>
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">SERVICE COVERAGE</span>
              <h2>Built to support the full client journey.</h2>
              <p>Our platform is designed to cover both recurring advisory work and one-time business needs.</p>
            </div>

            <div className="services-grid">
              {serviceAreas.map(item => (
                <div key={item.title} className="service-card">
                  <div className="service-card-kicker">{item.title}</div>
                  <p style={{ marginTop: 12 }}>{item.text}</p>
                  <Link href={`/services/${item.title.toLowerCase().replace(/\s+/g, '-')}`} className="service-card-cta">
                    Learn more →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">OUR PROCESS</span>
              <h2>A simple flow that keeps work moving.</h2>
              <p>The goal is not to overcomplicate delivery. It is to make progress visible and easy to act on.</p>
            </div>

            <div className="timeline-grid">
              {process.map(item => (
                <div key={item.step} className="step-card">
                  <div className="step-pill">{item.step}</div>
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
                <span className="eyebrow">CONTACT</span>
                <h2>Let’s talk about what you need next.</h2>
                <p>
                  Whether you need compliance support, finance guidance, a property conversation, or educational
                  resources, we can help define the right path forward.
                </p>
                <div style={{ display: 'grid', gap: '12px', marginTop: '20px', color: 'var(--muted)' }}>
                  <div><strong style={{ color: 'var(--primary)' }}>Contact person:</strong> {settings.contactPerson}</div>
                  <div><strong style={{ color: 'var(--primary)' }}>Phone:</strong> {settings.contactPhone1}</div>
                  <div><strong style={{ color: 'var(--primary)' }}>Email:</strong> {settings.contactEmail}</div>
                </div>
              </div>

              <div className="callout-banner" style={{ marginTop: 0 }}>
                <h2>Ready to start?</h2>
                <p>Book a consultation and we’ll help you identify the most practical next step.</p>
                <div className="callout-actions">
                  <Link href="/contact" className="btn btn-primary">
                    Book Consultation
                  </Link>
                  <Link href="/services" className="btn btn-secondary">
                    Explore Services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
