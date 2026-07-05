import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import ServiceCard from '../../components/ServiceCard'
import { prisma } from '../../lib/prisma'
import { sampleServices } from '../../lib/sampleData'

const serviceHighlights = [
  { number: '06', label: 'Core service lines' },
  { number: '24h', label: 'Initial response' },
  { number: '98%', label: 'Client satisfaction' },
]

const processSteps = [
  { number: '01', title: 'Assess', text: 'We understand the request, context and desired outcome.' },
  { number: '02', title: 'Design', text: 'We map the service path, timeline and responsibilities.' },
  { number: '03', title: 'Deliver', text: 'We move through execution with disciplined communication.' },
  { number: '04', title: 'Support', text: 'We remain available as your needs evolve.' },
]

export default function Services({ services }: { services: any[] }) {
  const serviceItems = Array.from(new Map([...(services || []), ...sampleServices].map(item => [item.slug, item])).values())

  return (
    <div>
      <Nav />
      <main>
        <section className="page-hero">
          <div className="container article-hero">
            <div>
              <span className="eyebrow">Specialized solutions</span>
              <h1 style={{ margin: '18px 0 0', fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 0.98, letterSpacing: '-.05em' }}>
                Our service ecosystem for global excellence.
              </h1>
              <p style={{ margin: '18px 0 0', maxWidth: 700, color: 'var(--muted)', fontSize: '1.06rem' }}>
                A premium, integrated offering that connects consultancy, finance, education, investment and property
                services into one coherent client experience.
              </p>
              <div className="hero-actions">
                <a href="#services-list" className="btn btn-primary">
                  Explore Services
                </a>
                <a href="/#contact" className="btn btn-secondary">
                  Book Consultation
                </a>
              </div>
            </div>

            <div className="article-feature">
              <div className="service-card-kicker">Service overview</div>
              <h2 style={{ margin: '14px 0 0', fontSize: '2rem', lineHeight: 1.04, letterSpacing: '-.04em' }}>
                Built to support leaders who want clarity, trust and momentum.
              </h2>
              <p style={{ marginTop: 14 }}>
                Whether you are making decisions about business structure, financial planning or property, we keep the
                experience structured and premium.
              </p>
              <div className="hero-board-grid" style={{ marginTop: 18 }}>
                {serviceHighlights.map(item => (
                  <div key={item.label} className="mini-card">
                    <strong>{item.number}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container">
          <div className="partner-strip">
            <div className="partner-label">Explore the services</div>
            <div className="property-toolbar">
              {['Consultancy', 'Finance', 'Education', 'Investment', 'Real Estate', 'Rental Space'].map(item => (
                <span key={item} className="property-chip">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section-surface" id="services-list">
          <div className="section-heading">
            <span className="eyebrow">Service catalog</span>
            <h2>Specialized solutions for every stage of growth.</h2>
            <p>Choose the service that matches your current need, then move forward with one coordinated team.</p>
          </div>

          <div className="services-grid">
            {serviceItems.map(service => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </section>

        <section className="section-surface">
          <div className="section-heading">
            <span className="eyebrow">How we work</span>
            <h2>A simple delivery model that removes friction.</h2>
            <p>The process is intentionally calm and structured so your team always knows what happens next.</p>
          </div>

          <div className="timeline-grid">
            {processSteps.map(step => (
              <div key={step.number} className="step-card">
                <div className="step-pill">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container">
          <div className="callout-banner">
            <h2>Need help choosing the right service?</h2>
            <p>
              Tell us what you are trying to solve and we’ll guide you to the right starting point.
            </p>
            <div className="callout-actions">
              <a href="/#contact" className="btn btn-ghost">
                Talk to Advisory
              </a>
              <a href="/blog" className="btn btn-secondary">
                Read Insights
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const services = await prisma.service.findMany()
    return { props: { services: JSON.parse(JSON.stringify(services)) } }
  } catch (error) {
    return { props: { services: sampleServices } }
  }
}
