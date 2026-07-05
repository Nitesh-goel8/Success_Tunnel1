import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import EnquiryForm from '../../components/EnquiryForm'
import ServiceCard from '../../components/ServiceCard'

const consultancyPillars = [
  { id: 1, title: 'Income Tax', slug: 'consultancy', icon: 'IT', excerpt: 'Compliance, planning and filing support for individuals and businesses.' },
  { id: 2, title: 'GST Compliance', slug: 'consultancy', icon: 'GS', excerpt: 'Registration, return filing and audit support in one structured workflow.' },
  { id: 3, title: 'MSME Registration', slug: 'consultancy', icon: 'MS', excerpt: 'Focused guidance for small and medium enterprises.' },
  { id: 4, title: 'Trademark', slug: 'consultancy', icon: 'TM', excerpt: 'Protect your brand with registration and monitoring support.' },
  { id: 5, title: 'Company Services', slug: 'consultancy', icon: 'CP', excerpt: 'Incorporation, filings and governance support.' },
  { id: 6, title: 'NPO / Trust', slug: 'consultancy', icon: 'NT', excerpt: 'Setup and compliance for purpose-driven organizations.' },
]

const onboarding = [
  {
    number: '01',
    title: 'Discovery Session',
    text: 'We learn about your structure, current challenges and the service outcomes you want to achieve.',
  },
  {
    number: '02',
    title: 'Strategic Mapping',
    text: 'We identify the right path, required documents and the best sequence for execution.',
  },
  {
    number: '03',
    title: 'Execution Phase',
    text: 'Our team handles the work with discipline, accuracy and transparent communication.',
  },
  {
    number: '04',
    title: 'Operational Handover',
    text: 'We close the loop with support, follow-up and next-step guidance if needed.',
  },
]

const faqItems = [
  {
    question: 'What is the typical turnaround for MSME Registration?',
    answer: 'Timing depends on document readiness, but we keep the process clear and well coordinated from the start.',
  },
  {
    question: 'Do you provide ongoing GST audit support?',
    answer: 'Yes. We can support filing, review cycles and follow-up work after the initial setup.',
  },
  {
    question: 'Can you help with trademark filing and monitoring?',
    answer: 'Absolutely. We can manage filing and provide practical guidance for brand protection.',
  },
]

export default function Consultancy() {
  return (
    <div>
      <Nav />
      <main>
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Strategic consultancy</span>
              <h1>
                Precision in <span className="accent">taxation</span> and business registration.
              </h1>
              <p>
                We help founders and business owners move from uncertainty to clarity with a structured, premium
                consultancy experience.
              </p>
              <div className="hero-actions">
                <a href="#contact" className="btn btn-primary">
                  Get Started
                </a>
                <a href="#portfolio" className="btn btn-secondary">
                  View Portfolio
                </a>
              </div>
              <div className="hero-note">Response guaranteed within one business day.</div>
            </div>

            <div className="hero-visual">
              <div className="hero-panel">
                <div className="hero-stat-chip">
                  <strong>500+</strong>
                  <span>firms supported</span>
                </div>
                <div className="hero-board">
                  <span className="service-card-kicker">Consultancy framework</span>
                  <h3>Built for high-trust advisory and disciplined execution.</h3>
                  <p>From registrations to ongoing compliance, every step stays visible and organized.</p>
                  <div className="hero-board-grid">
                    <div className="mini-card">
                      <strong>Tax</strong>
                      <span>Planning and filing support</span>
                    </div>
                    <div className="mini-card">
                      <strong>Setup</strong>
                      <span>Company and MSME registration</span>
                    </div>
                    <div className="mini-card">
                      <strong>Brand</strong>
                      <span>Trademark filing and protection</span>
                    </div>
                    <div className="mini-card">
                      <strong>Trust</strong>
                      <span>NPO and trust compliance</span>
                    </div>
                  </div>
                </div>
                <div className="hero-floating">
                  <span>Dedicated team</span>
                  <strong>One point of contact from discovery through handover.</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-band">
          <div className="container stats-grid">
            <div className="stat-card">
              <span>Focused service lines</span>
              <strong>06</strong>
            </div>
            <div className="stat-card">
              <span>Average response</span>
              <strong>24h</strong>
            </div>
            <div className="stat-card">
              <span>Execution clarity</span>
              <strong>01</strong>
            </div>
            <div className="stat-card">
              <span>Confidence</span>
              <strong>98%</strong>
            </div>
          </div>
        </section>

        <section className="section-surface" id="portfolio">
          <div className="section-heading">
            <span className="eyebrow">Core consultancy pillars</span>
            <h2>All the support you need in one advisory flow.</h2>
            <p>The service list below matches the reference experience and gives you the full set of consultancy sections.</p>
          </div>

          <div className="services-grid">
            {consultancyPillars.map(service => (
              <ServiceCard key={service.title} service={service} href="#contact-form" />
            ))}
          </div>
        </section>

        <section className="container">
          <div className="callout-banner">
            <h2>Why clients choose our consultancy team.</h2>
            <p>
              We keep the engagement premium but practical, so you always know what is happening and what comes next.
            </p>
            <div className="callout-actions">
              <a href="#contact" className="btn btn-ghost">
                Talk to Advisory
              </a>
              <a href="/services" className="btn btn-secondary">
                Explore Other Services
              </a>
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="section-heading">
            <span className="eyebrow">Streamlined onboarding</span>
            <h2>Our four-step methodology keeps the process simple.</h2>
            <p>We make the experience feel organized and reliable from the very first conversation.</p>
          </div>

          <div className="split-grid">
            <div>
              <div className="timeline-grid" style={{ gridTemplateColumns: '1fr', gap: 16 }}>
                {onboarding.map(step => (
                  <div key={step.number} className="step-card" style={{ gridTemplateColumns: 'auto 1fr' }}>
                    <div className="step-pill">{step.number}</div>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <EnquiryForm
              page="consultancy"
              title="Request expert consultation"
              subtitle="Tell us your objective and we’ll shape the right plan."
              buttonLabel="Submit consultation request"
            />
          </div>
        </section>

        <section className="section-surface">
          <div className="section-heading">
            <span className="eyebrow">Frequently asked questions</span>
            <h2>Common queries about our consultancy workflow.</h2>
          </div>

          <div className="faq-list">
            {faqItems.map(item => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="container" id="contact">
          <div className="callout-banner">
            <h2>Ready to begin your consultancy project?</h2>
            <p>Start with a quick enquiry and we’ll guide you to the most suitable next step.</p>
            <div className="callout-actions">
              <a href="#contact-form" className="btn btn-ghost">
                Submit Enquiry
              </a>
              <a href="/services" className="btn btn-secondary">
                Back to Services
              </a>
            </div>
          </div>
          <div id="contact-form" style={{ marginTop: 24 }}>
            <EnquiryForm
              page="consultancy-bottom"
              title="Speak with our consultancy team"
              subtitle="We’ll review your needs and respond with a tailored plan."
              buttonLabel="Send enquiry"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
