import PageShell from '../../components/PageShell'

const faqs = [
  { question: 'What services do you offer?', answer: 'Consultancy, finance, education, investment and property support.' },
  { question: 'Can I contact you by WhatsApp?', answer: 'Yes. The site includes a WhatsApp action for quick follow-up.' },
  { question: 'Do you provide downloadable forms?', answer: 'Yes. The downloads hub is ready for PDFs and request forms.' },
  { question: 'Are calculators available?', answer: 'This page is prepared for future calculator tools.' },
]

export default function FAQs() {
  return (
    <PageShell
      eyebrow="FAQs"
      title="Frequently asked questions."
      description="A simple accordion-style hub for the most common questions."
      aside={
        <div className="hero-board">
          <span className="service-card-kicker">Help center</span>
          <h3>Fast answers, easy to scan.</h3>
          <p>Search and filter can be added later, but the content structure is now in place.</p>
          <div className="hero-board-grid">
            {faqs.map(item => (
              <div key={item.question} className="mini-card">
                <strong>{item.question}</strong>
                <span>{item.answer}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <section className="section-surface">
        <div className="section-heading">
          <span className="eyebrow">FAQ list</span>
          <h2>Accordion questions.</h2>
        </div>
        <div className="faq-list">
          {faqs.map(item => (
            <details key={item.question} className="faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
