import PageShell from '../components/PageShell'

const values = [
  { title: 'Mission', text: 'Deliver dependable advisory and execution for growth-focused clients.' },
  { title: 'Vision', text: 'Become the trusted partner for professional services across every life stage.' },
  { title: 'Values', text: 'Clarity, integrity, responsiveness and premium client care.' },
]

const team = [
  { name: 'Advisory Lead', role: 'Strategy & client success', bio: 'Guides the engagement with calm, senior-level perspective.' },
  { name: 'Operations Lead', role: 'Delivery & coordination', bio: 'Keeps the work structured, timely and easy to follow.' },
  { name: 'Service Specialist', role: 'Consultancy & compliance', bio: 'Supports the details behind each service journey.' },
]

const timeline = [
  { number: '01', title: 'Started with advisory', text: 'Built to help clients navigate complex service decisions with confidence.' },
  { number: '02', title: 'Expanded into multiple categories', text: 'Added finance, education, investment and property support.' },
  { number: '03', title: 'Focused on premium delivery', text: 'Raised the experience quality with better communication and structure.' },
  { number: '04', title: 'Scaled for long-term growth', text: 'Created a foundation for more resources, FAQs and future client tools.' },
]

export default function About() {
  return (
    <PageShell
      eyebrow="About"
      title="Committed to your excellence."
      description="Success Tunnel is designed as a multi-service advisory partner with a calm, premium client experience."
      aside={
        <div className="hero-board">
          <span className="service-card-kicker">About Success Tunnel</span>
          <h3>One relationship for consulting, finance, education and property support.</h3>
          <p>We keep the experience structured, helpful and easy to act on.</p>
          <div className="hero-board-grid">
            {values.map(item => (
              <div key={item.title} className="mini-card">
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <section className="section-surface">
        <div className="section-heading">
          <span className="eyebrow">Our story</span>
          <h2>Built to make professional services feel simple.</h2>
          <p>
            We created Success Tunnel to bring together the practical services people need most, supported by a premium and trustworthy experience.
          </p>
        </div>
        <div className="split-grid">
          <div className="split-content">
            <span className="eyebrow">What we do</span>
            <h2>We combine advisory depth with responsive execution.</h2>
            <p>
              The goal is not just to offer services, but to give clients a clear path from enquiry to completion.
            </p>
            <ul className="bullet-list">
              <li>Clear communication from the first conversation</li>
              <li>Service categories organized for easy discovery</li>
              <li>Premium presentation with practical value</li>
              <li>Support that scales with client needs</li>
            </ul>
          </div>

          <div className="panel-card">
            <div className="service-card-kicker">Leadership values</div>
            <h3 style={{ marginTop: 12 }}>What defines the team</h3>
            <div style={{ display: 'grid', gap: 14, marginTop: 18 }}>
              {values.map(item => (
                <div key={item.title} className="mini-card">
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-surface">
        <div className="section-heading">
          <span className="eyebrow">Team</span>
          <h2>Small, sharp and focused on delivery.</h2>
        </div>
        <div className="services-grid">
          {team.map(person => (
            <div key={person.name} className="value-card">
              <div className="value-number">{person.name.slice(0, 2).toUpperCase()}</div>
              <h3>{person.name}</h3>
              <p><strong style={{ color: 'var(--primary)' }}>{person.role}</strong></p>
              <p>{person.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-surface">
        <div className="section-heading">
          <span className="eyebrow">Timeline</span>
          <h2>How the company has evolved.</h2>
        </div>
        <div className="timeline-grid">
          {timeline.map(step => (
            <div key={step.number} className="step-card">
              <div className="step-pill">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
