import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ServiceCard from '../components/ServiceCard'
import EnquiryForm from '../components/EnquiryForm'
import { prisma } from '../lib/prisma'
import { sampleServices } from '../lib/sampleData'

const coreServices = [
  { title: 'Consultancy', slug: 'consultancy', icon: 'CS', excerpt: 'Strategic advisory for tax, company setup, compliance and business growth.' },
  { title: 'Finance', slug: 'finance', icon: 'FN', excerpt: 'Financial planning, lending support and capital structuring guidance.' },
  { title: 'Education', slug: 'education', icon: 'ED', excerpt: 'Study material, learning programs and career-focused education support.' },
  { title: 'Investment', slug: 'investment', icon: 'IV', excerpt: 'Portfolio stewardship and investment direction for long-term value.' },
  { title: 'Real Estate', slug: 'real-estate', icon: 'RE', excerpt: 'Property acquisition, portfolio planning and asset positioning.' },
  { title: 'Rental Space', slug: 'rental-space', icon: 'RS', excerpt: 'Commercial and residential space solutions tailored to your requirements.' },
]

const partners = ['Consulting', 'Finance', 'Education', 'Investment', 'Property', 'Corporate']

const whyCards = [
  {
    title: 'Client-led execution',
    text: 'We design every engagement around clarity, responsiveness and measurable business outcomes.',
  },
  {
    title: 'Trusted advisory depth',
    text: 'Our team supports strategic decisions with practical knowledge across compliance, finance and property.',
  },
  {
    title: 'Built for momentum',
    text: 'We keep delivery simple, structured and fast so your team can move forward without friction.',
  },
]

const resourceCards = [
  { title: 'About Us', href: '/about', text: 'Who we are and how we work.' },
  { title: 'Blog', href: '/blog', text: 'Insights, updates and articles.' },
  { title: 'Downloads', href: '/resources/downloads', text: 'Forms, checklists and PDFs.' },
  { title: 'FAQs', href: '/resources/faqs', text: 'Quick answers to common questions.' },
]

const processSteps = [
  {
    number: '01',
    title: 'Discover',
    text: 'We understand your goals, current situation and the opportunities that matter most.',
  },
  {
    number: '02',
    title: 'Plan',
    text: 'We prepare a clear roadmap for the service, timing, documents and next actions.',
  },
  {
    number: '03',
    title: 'Execute',
    text: 'We coordinate the work, keep you informed and move each step with discipline.',
  },
  {
    number: '04',
    title: 'Scale',
    text: 'We stay involved with follow-up support so your progress compounds over time.',
  },
]

export default function Home({ services }: { services: any[] }) {
  const serviceItems = Array.from(
    new Map([...(services || []), ...sampleServices, ...coreServices].map(item => [item.slug, item])).values()
  ).slice(0, 6)

  return (
    <div>
      <Nav />
      <main>
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Trusted by growing businesses</span>
              <h1>
                A faster way to <span className="accent">big success</span>.
              </h1>
              <p>
                Success Tunnel brings consultancy, finance, education, investment and property support into one premium
                advisory experience for ambitious organizations and individuals.
              </p>
              <div className="hero-actions">
                <a href="#contact" className="btn btn-primary">
                  Book Consultation
                </a>
                <a href="/services" className="btn btn-secondary">
                  Explore Services
                </a>
              </div>
              <div className="hero-note">Personalized guidance, faster turnaround and a polished experience from start to finish.</div>
              <div className="hero-metrics">
                <div className="metric-card">
                  <span>Clients served</span>
                  <strong>1,000+</strong>
                </div>
                <div className="metric-card">
                  <span>Years experience</span>
                  <strong>10+</strong>
                </div>
                <div className="metric-card">
                  <span>Projects delivered</span>
                  <strong>500+</strong>
                </div>
                <div className="metric-card">
                  <span>Satisfaction</span>
                  <strong>98%</strong>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-panel">
                <div className="hero-stat-chip">
                  <strong>24h</strong>
                  <span>first response</span>
                </div>
                <div className="hero-board">
                  <span className="service-card-kicker">Premium advisory</span>
                  <h3>Structured support across every stage of your growth.</h3>
                  <p>Clear strategy, disciplined execution and reliable follow-through for modern businesses.</p>
                  <div className="hero-board-grid">
                    <div className="mini-card">
                      <strong>Consultancy</strong>
                      <span>Compliance, company setup and registrations</span>
                    </div>
                    <div className="mini-card">
                      <strong>Property</strong>
                      <span>Investment and rental space guidance</span>
                    </div>
                    <div className="mini-card">
                      <strong>Finance</strong>
                      <span>Planning and lending support</span>
                    </div>
                    <div className="mini-card">
                      <strong>Education</strong>
                      <span>Courses, notes and study support</span>
                    </div>
                  </div>
                </div>
                <div className="hero-floating">
                  <span>Lead advisory</span>
                  <strong>One relationship for strategy, service and execution.</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-band">
          <div className="container stats-grid">
            <div className="stat-card">
              <span>Happy clients</span>
              <strong>1,000+</strong>
            </div>
            <div className="stat-card">
              <span>Years experience</span>
              <strong>10+</strong>
            </div>
            <div className="stat-card">
              <span>Projects done</span>
              <strong>500+</strong>
            </div>
            <div className="stat-card">
              <span>Satisfaction</span>
              <strong>98%</strong>
            </div>
          </div>
        </section>

        <section>
          <div className="container partner-strip">
            <div className="partner-label">Strategic partners and enterprise collaborations</div>
            <div className="partner-logos">
              {partners.map(partner => (
                <div key={partner} className="partner-logo">
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="section-heading">
            <span className="eyebrow">Specialized solutions</span>
            <h2>Global services designed for clarity and confidence.</h2>
            <p>
              Our service model is intentionally broad, but the experience stays focused: one premium team, one clear
              plan and one accountable relationship.
            </p>
          </div>

          <div className="services-grid">
            {serviceItems.map(service => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </section>

        <section className="section-surface" id="about">
          <div className="split-grid">
            <div className="split-media">
              <div className="split-media-panel">
                <div className="hero-stat-chip">
                  <strong>10+</strong>
                  <span>years of advisory focus</span>
                </div>
                <div className="split-media-board">
                  <span className="service-card-kicker">About Success Tunnel</span>
                  <h3>Bridging ambition with global capability.</h3>
                  <p>
                    We combine practical service delivery with a premium client experience, so your team always knows
                    what happens next.
                  </p>
                  <div className="hero-board-grid">
                    <div className="mini-card">
                      <strong>Mission</strong>
                      <span>Deliver dependable advisory and execution</span>
                    </div>
                    <div className="mini-card">
                      <strong>Vision</strong>
                      <span>Become the trusted partner for growth and structure</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="split-content">
              <span className="eyebrow">Why choose us</span>
              <h2>Built for leaders who want progress without the noise.</h2>
              <p>
                We support founders, professionals and families with a clear advisory process that keeps complexity
                manageable and outcomes visible.
              </p>
              <ul className="bullet-list">
                <li>Personal guidance across consultancy, finance, education and property</li>
                <li>Structured communication that keeps your project easy to follow</li>
                <li>Modern, premium service design focused on trust and speed</li>
                <li>Ongoing support so the relationship grows with your needs</li>
              </ul>
              <div className="split-actions">
                <a href="#contact" className="btn btn-primary">
                  Talk to Advisory
                </a>
                <a href="/blog" className="btn btn-secondary">
                  Read Insights
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="section-heading">
            <span className="eyebrow">Why industry leaders choose us</span>
            <h2>Reliable execution, clear communication and premium support.</h2>
            <p>These are the qualities that keep the experience calm, polished and outcome-oriented.</p>
          </div>

          <div className="value-grid">
            {whyCards.map((card, index) => (
              <div key={card.title} className="value-card">
                <div className={`value-number ${index === 1 ? 'dark' : ''}`}>{String(index + 1).padStart(2, '0')}</div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-surface">
          <div className="section-heading">
            <span className="eyebrow">How it works</span>
            <h2>Our four-step advisory framework.</h2>
            <p>A simple process that keeps the engagement structured and easy to trust.</p>
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

        <section className="section-surface">
          <div className="section-heading">
            <span className="eyebrow">Resources</span>
            <h2>Explore more without crowding the header.</h2>
            <p>These pages stay easy to reach from the home page and footer while keeping the top navigation focused.</p>
          </div>

          <div className="article-grid">
            {resourceCards.map(card => (
              <a key={card.title} href={card.href} className="article-card">
                <div className="article-meta">Quick access</div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <span className="article-footer">Open page →</span>
              </a>
            ))}
          </div>
        </section>

        <section className="container">
          <div className="callout-banner">
            <h2>Ready to accelerate your corporate success?</h2>
            <p>
              Let’s shape a clear plan for your next move, whether you need advisory support, property guidance or a
              more structured path for your team.
            </p>
            <div className="callout-actions">
              <a href="#contact" className="btn btn-ghost">
                Book Consultation
              </a>
              <a href="/services" className="btn btn-secondary">
                View Services
              </a>
            </div>
          </div>
        </section>

        <section className="section-surface" id="contact">
          <div className="contact-grid">
            <div className="contact-panel">
              <span className="eyebrow">Contact</span>
              <h2>Start with a conversation.</h2>
              <p>
                Share your goals and we’ll guide you toward the right service path, timeline and next steps.
              </p>
              <div className="contact-details">
                <div>
                  <strong>Email</strong>
                  <p>advisory@successtunnel.com</p>
                </div>
                <div>
                  <strong>Phone</strong>
                  <p>+1 (800) 555-0199</p>
                </div>
                <div>
                  <strong>WhatsApp</strong>
                  <p>+1 (800) 555-0199</p>
                </div>
              </div>
            </div>

            <EnquiryForm
              page="Homepage"
              title="Request a tailored consultation"
              subtitle="Tell us what you need and we’ll prepare a focused next step."
              buttonLabel="Submit consultation request"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const services = await prisma.service.findMany({ take: 6 })
    return { props: { services: JSON.parse(JSON.stringify(services)) } }
  } catch (error) {
    return { props: { services: sampleServices } }
  }
}
