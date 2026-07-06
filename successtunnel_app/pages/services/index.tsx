import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { prisma } from '../../lib/prisma'
import { sampleServices } from '../../lib/sampleData'

const coreServices = [
  { title: 'Consultancy', slug: 'consultancy', excerpt: 'Strategic planning and operational optimization for scaling enterprises.' },
  { title: 'Finance', slug: 'finance', excerpt: 'Financial restructuring, investment planning, and capital procurement.' },
  { title: 'Education', slug: 'education', excerpt: 'Corporate training programs and leadership development.' },
  { title: 'Investment', slug: 'investment', excerpt: 'Identifying high-yield opportunities across emerging markets.' },
  { title: 'Real Estate', slug: 'real-estate', excerpt: 'Property management and portfolio acquisition for commercial clients.' },
  { title: 'Rental Space', slug: 'rental-space', excerpt: 'Premium co-working and corporate office spaces tailored for success.' },
]

const benefits = [
  { icon: '🎯', title: 'Coordinated Strategy', text: 'All your service needs (taxes, finance, property) managed by a single unified team to avoid disjointed planning.' },
  { icon: '⚡', title: 'Rapid Execution', text: 'Direct regulatory channels, automated workflows, and centralized communication lines for faster completions.' },
  { icon: '💎', title: 'Premium Experience', text: 'Enjoy a calm, transparent, and dedicated advisory experience with complete clarity at every stage.' }
]

const processFlow = [
  { step: '01', title: 'Book Consultation', desc: 'Schedule a call or submit an inquiry detailing your organizational goals.' },
  { step: '02', title: 'Requirement Analysis', desc: 'We deep dive into compliance logs, financials, or space specifications.' },
  { step: '03', title: 'Strategy Planning', desc: 'We build a clear, structured roadmap with timelines, documents, and next steps.' },
  { step: '04', title: 'Execution', desc: 'Our team carries out setup, filings, lending support, or lease coordination.' },
  { step: '05', title: 'Continuous Support', desc: 'We stay on hand to scale, audit, and provide structured follow-up advice.' }
]

const faqs = [
  {
    question: "What service lines do you cover?",
    answer: "We cover comprehensive professional services across five main pillars: Strategic business consultancy (income tax, GST, registration), finance planning, educational courses/notes, investment portfolios, and real estate & rental services."
  },
  {
    question: "Can I bundle multiple services together?",
    answer: "Absolutely. Most clients benefit from combining services—such as company registration (consultancy) with corporate office space search (rental space) and capital planning (finance)."
  },
  {
    question: "Do you support virtual meetings?",
    answer: "Yes, we support virtual advisory sessions globally via Zoom, Google Meet, and Microsoft Teams to make coordination seamless."
  }
]

export default function Services({ services }: { services: any[] }) {
  const serviceItems = Array.from(
    new Map([...(services || []), ...sampleServices, ...coreServices].map(item => [item.slug, item])).values()
  ).slice(0, 6)

  return (
    <div>
      <Nav />
      <main>
        {/* Services Hero */}
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
            <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)', marginBottom: '24px' }}>SERVICES</span>
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', 
              lineHeight: '1.1', 
              letterSpacing: '-0.04em',
              fontWeight: 800,
              color: 'var(--primary)',
              margin: '20px auto 30px'
            }}>
              Our Service Ecosystem
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--muted)', lineHeight: '1.65' }}>
              We unify consultancy, finance, education, investment, and property support into one coherent, premium client experience.
            </p>
          </div>
        </section>

        {/* All Services Grid */}
        <section className="section-surface" id="services-grid">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span className="eyebrow">PORTFOLIO</span>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 700, margin: '12px 0 0' }}>
                Expertise Across Key Channels
              </h2>
            </div>

            <div className="expertise-grid">
              {serviceItems.map(service => (
                <div key={service.slug} className="expertise-card">
                  <div className="expertise-icon-wrapper">
                    {service.slug === 'consultancy' ? '💼' : 
                     service.slug === 'finance' ? '📊' : 
                     service.slug === 'education' ? '🎓' : 
                     service.slug === 'investment' ? '📈' : 
                     service.slug === 'real-estate' ? '🏢' : '🔑'}
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.excerpt}</p>
                  <Link href={`/services/${service.slug}`} className="expertise-card-link">
                    Learn More &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section-surface" style={{ background: '#f8fafc' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span className="eyebrow">BENEFITS</span>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 700, margin: '12px 0 0' }}>
                The SuccessTunnel Advantage
              </h2>
            </div>

            <div className="expertise-grid">
              {benefits.map((b, i) => (
                <div key={i} className="expertise-card" style={{ padding: '32px' }}>
                  <div className="expertise-icon-wrapper">{b.icon}</div>
                  <h3>{b.title}</h3>
                  <p style={{ margin: '0' }}>{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="section-surface">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span className="eyebrow">PROCESS</span>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 700, margin: '12px 0 0' }}>
                Our Delivery Roadmap
              </h2>
            </div>

            <div className="timeline-flow">
              {processFlow.map((flow, idx) => (
                <div key={idx} className="timeline-flow-item">
                  <div className="timeline-flow-badge">{flow.step}</div>
                  <div className="timeline-flow-content">
                    <h3>{flow.title}</h3>
                    <p>{flow.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="section-surface" style={{ background: '#f8fafc' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <span className="eyebrow">FAQ</span>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 700, margin: '12px 0 0' }}>
                Frequently Asked Questions
              </h2>
            </div>

            <div className="faq-list">
              {faqs.map((faq, index) => (
                <details key={index} className="faq-item" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px' }}>
                  <summary style={{ fontWeight: 700, color: 'var(--primary)', cursor: 'pointer', outline: 'none' }}>
                    {faq.question}
                  </summary>
                  <p style={{ marginTop: '12px', color: 'var(--muted)', fontSize: '0.96rem', lineHeight: '1.6' }}>
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container">
          <div className="cta-banner-container">
            <h2>Ready to Build Your Next Success Story?</h2>
            <div className="cta-actions">
              <Link href="/contact" className="cta-btn-primary">Book Consultation &rarr;</Link>
              <a href="#services-grid" className="cta-btn-secondary">Explore Services</a>
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
