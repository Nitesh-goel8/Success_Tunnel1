import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const values = [
  { icon: '🛡️', title: 'Integrity', text: 'Absolute transparency and ethical dedication in every advisory engagement.' },
  { icon: '⚡', title: 'Innovation', text: 'Adopting advanced digital workflows and systems to speed up turnaround.' },
  { icon: '🔍', title: 'Transparency', text: 'No hidden clauses. Clear operational paths and honest counsel.' },
  { icon: '🤝', title: 'Commitment', text: 'Dedicated advisory relationships with active project follow-through.' },
  { icon: '📈', title: 'Growth', text: 'Designing strategies focused on scaling client operations and capital.' },
  { icon: '🏆', title: 'Client Success', text: 'Aligning our milestones directly with your long-term success metrics.' },
]

const team = [
  { 
    name: 'Devin Carter', 
    role: 'Chief Executive Officer', 
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=250&auto=format&fit=crop',
    bio: '15+ years leading multi-disciplinary consulting practices.' 
  },
  { 
    name: 'Sarah Jenkins', 
    role: 'Director of Advisory Services', 
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop',
    bio: 'Oversees client relationship operations and project coordination.' 
  },
  { 
    name: 'Marcus Thorne', 
    role: 'Head of Finance', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250&auto=format&fit=crop',
    bio: 'Directs capital structuring, taxation, and investment strategy.' 
  },
  { 
    name: 'Anita Rao', 
    role: 'Senior Legal Advisor', 
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop',
    bio: 'Handles corporate registration, property acquisitions, and compliance.' 
  },
]

const timeline = [
  { year: '2018', title: 'Started', text: 'SuccessTunnel launched as a strategic tax and compliance consultancy.' },
  { year: '2020', title: 'Expanded Services', text: 'Integrated corporate finance planning and lending support operations.' },
  { year: '2022', title: '300 Active Clients', text: 'Achieved a major milestone in high-value strategic growth advisory.' },
  { year: '2024', title: 'Property Division', text: 'Launched commercial real estate and corporate leasing space guidance.' },
  { year: '2026', title: 'Nationwide Growth', text: 'Unifying multi-service delivery across key corporate hubs.' },
]

export default function About() {
  return (
    <div>
      <Nav />
      <main>
        {/* About Hero */}
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
            <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)', marginBottom: '24px' }}>ABOUT US</span>
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', 
              lineHeight: '1.1', 
              letterSpacing: '-0.04em',
              fontWeight: 800,
              color: 'var(--primary)',
              margin: '20px auto 30px'
            }}>
              Committed to Your Excellence
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--muted)', lineHeight: '1.65' }}>
              SuccessTunnel is designed as a unified advisory partner, bringing consultancy, finance, education, investment, and property support under one premium client experience.
            </p>
          </div>
        </section>

        {/* Company Story */}
        <section className="section-surface">
          <div className="container" style={{ maxWidth: '960px' }}>
            <span className="eyebrow">OUR ORIGIN</span>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 700, margin: '16px 0 24px' }}>
              How SuccessTunnel Started
            </h2>
            <div style={{ fontSize: '1.08rem', color: 'var(--text)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p>
                SuccessTunnel was founded to solve a persistent organizational pain point: service fragmentation. Traditionally, growing companies and ambitious individuals had to manage relationships with multiple separate providers—lawyers for setup, certified accountants for taxes, brokers for office spaces, and bankers for funding.
              </p>
              <p>
                This disjointed framework created communication lags, strategic misalignments, and costly overheads. We established SuccessTunnel to create a streamlined, one-stop ecosystem where strategy, compliance, finance, and real estate are managed in complete alignment by a single dedicated team.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="section-surface" style={{ background: '#f8fafc' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
            <div style={{ background: 'var(--surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--line)' }}>
              <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)' }}>VISION</span>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', margin: '16px 0 12px' }}>One unified vision</h3>
              <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: '1.7' }}>
                To serve as the premier growth catalyst for modern organizations, transforming complex regulatory, financial, and real estate challenges into clear pathways for long-term prosperity.
              </p>
            </div>

            <div style={{ background: 'var(--surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--line)' }}>
              <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)' }}>MISSION</span>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', margin: '16px 0 12px' }}>A clear mission</h3>
              <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: '1.7' }}>
                To deliver disciplined corporate advice, responsive execution, and absolute transparency across our consulting, property, and lending channels so that our clients can scale securely.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="section-surface">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span className="eyebrow">VALUES</span>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', margin: '12px 0 0', fontWeight: 700 }}>
                Our Core Values
              </h2>
            </div>
            
            <div className="expertise-grid">
              {values.map((v, i) => (
                <div key={i} className="expertise-card" style={{ padding: '32px' }}>
                  <div className="expertise-icon-wrapper">{v.icon}</div>
                  <h3>{v.title}</h3>
                  <p style={{ margin: '0' }}>{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="section-surface" style={{ background: '#f8fafc' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span className="eyebrow">LEADERSHIP</span>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', margin: '12px 0 0', fontWeight: 700 }}>
                Meet Leadership
              </h2>
            </div>

            <div className="insights-grid">
              {team.map((t, idx) => (
                <div key={idx} className="insight-card-item" style={{ background: 'var(--surface)' }}>
                  <div className="insight-img-container">
                    <img src={t.avatar} alt={t.name} className="insight-img" />
                  </div>
                  <div className="insight-content" style={{ padding: '24px' }}>
                    <h3 className="insight-title" style={{ margin: '0 0 4px 0' }}>{t.name}</h3>
                    <span style={{ fontSize: '0.88rem', color: 'var(--accent)', fontWeight: 700, display: 'block', marginBottom: '12px' }}>
                      {t.role}
                    </span>
                    <p style={{ fontSize: '0.92rem', color: 'var(--muted)', margin: '0' }}>{t.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-surface">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span className="eyebrow">TIMELINE</span>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', margin: '12px 0 0', fontWeight: 700 }}>
                Our Evolution
              </h2>
            </div>

            <div className="timeline-flow">
              {timeline.map((step, i) => (
                <div key={i} className="timeline-flow-item">
                  <div className="timeline-flow-badge">{step.year}</div>
                  <div className="timeline-flow-content">
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Associations */}
        <section className="section-surface" style={{ background: '#f8fafc' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <span className="eyebrow" style={{ marginBottom: '24px' }}>ASSOCIATIONS</span>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', margin: '0 0 48px', fontWeight: 700 }}>
              Strategic Partners &amp; Associations
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', opacity: 0.85 }}>
              <div style={{ background: 'var(--surface)', padding: '24px 32px', borderRadius: '16px', border: '1px solid var(--line)', fontWeight: 700 }}>
                🤝 Strategic Enterprise Partner
              </div>
              <div style={{ background: 'var(--surface)', padding: '24px 32px', borderRadius: '16px', border: '1px solid var(--line)', fontWeight: 700 }}>
                🏆 Excellence Awards 2025
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container">
          <div className="cta-banner-container">
            <h2>Ready to Build Your Next Success Story?</h2>
            <div className="cta-actions">
              <a href="/contact" className="cta-btn-primary">Book Consultation &rarr;</a>
              <Link href="/services" className="cta-btn-secondary">Explore Services</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
