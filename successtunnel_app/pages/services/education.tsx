import PageShell from '../../components/PageShell'
import CategoryHub from '../../components/CategoryHub'
import Link from 'next/link'

const cards = [
  { title: 'Study Content', icon: 'SC', excerpt: 'Notes and structured learning content.' },
  { title: 'Educational Blogs', icon: 'EB', excerpt: 'Articles designed for learners and parents.' },
  { title: 'Downloadable Notes', icon: 'DN', excerpt: 'Request PDFs and quick-reference material.' },
  { title: 'Tally Training', icon: 'TT', excerpt: 'Practical accounting and software learning.' },
]

const steps = [
  { number: '01', title: 'Understand', text: 'We learn what you need to study or teach.' },
  { number: '02', title: 'Organize', text: 'We align the right material or course path.' },
  { number: '03', title: 'Support', text: 'We help with notes, classes or reference content.' },
  { number: '04', title: 'Follow up', text: 'We stay available for next-step support.' },
]

const faqs = [
  { question: 'Do you have downloadable study notes?', answer: 'Yes, the downloads hub is ready for notes and PDFs.' },
  { question: 'Can I enquire about Tally training?', answer: 'Yes, the page includes a clear contact path for that.' },
  { question: 'Is educational content updated regularly?', answer: 'The blog and resources structure is ready for ongoing publishing.' },
]

export default function Education() {
  return (
    <PageShell
      eyebrow="Education"
      title="Learning support with structure."
      description="A premium educational section for study content, notes and training."
      aside={
        <div className="hero-board">
          <span className="service-card-kicker">Education category</span>
          <h3>Study material, blog content and practical courses.</h3>
          <p>Designed to support learning journeys with easy navigation.</p>
          <div className="hero-board-grid">
            <div className="mini-card">
              <strong>Content</strong>
              <span>Notes, blogs and training</span>
            </div>
            <div className="mini-card">
              <strong>Mode</strong>
              <span>Self-study and guided help</span>
            </div>
          </div>
        </div>
      }
    >
      <CategoryHub
        eyebrow="Education services"
        title="Content and training for learners."
        description="A clean hub for study content, educational articles and downloadable material."
        stats={[
          { label: 'Resources', value: '04' },
          { label: 'Response time', value: '24h' },
          { label: 'Modes', value: 'Online' },
          { label: 'Support', value: 'Guided' },
        ]}
        cards={cards}
        steps={steps}
        faqs={faqs}
        ctaTitle="Need the right study path?"
        ctaDescription="Send a request and we’ll help guide you to the best fit."
        formPage="education"
        formTitle="Request education support"
      />
      <section className="section-surface" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="callout-banner">
            <h2>Looking for courses, notes, or learning tools?</h2>
            <p>The full education hub now lives in the dedicated education section with videos, notes, downloads, calculators, and more.</p>
            <div className="cta-actions">
              <Link href="/education" className="cta-btn-primary">Open education hub</Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
