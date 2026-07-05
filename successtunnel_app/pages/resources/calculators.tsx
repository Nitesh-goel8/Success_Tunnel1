import PageShell from '../../components/PageShell'

const calculators = [
  { title: 'Loan EMI Calculator', note: 'Estimate monthly repayment for common finance scenarios.' },
  { title: 'Tax Estimate Helper', note: 'Placeholder for planning and projection use cases.' },
  { title: 'Property Affordability', note: 'A future tool to compare budget, rent and purchase options.' },
]

export default function Calculators() {
  return (
    <PageShell
      eyebrow="Calculators"
      title="Future planning tools."
      description="A placeholder section for calculators that can be added in phase two or three."
      aside={
        <div className="hero-board">
          <span className="service-card-kicker">Tools</span>
          <h3>Practical calculators for faster decisions.</h3>
          <p>We’ve stubbed the page so the architecture is complete and ready for enhancement.</p>
          <div className="hero-board-grid">
            {calculators.map(item => (
              <div key={item.title} className="mini-card">
                <strong>{item.title}</strong>
                <span>{item.note}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <section className="section-surface">
        <div className="section-heading">
          <span className="eyebrow">Tool list</span>
          <h2>Placeholders for later build-out.</h2>
        </div>
        <div className="value-grid">
          {calculators.map((item, index) => (
            <div key={item.title} className="value-card">
              <div className={`value-number ${index === 1 ? 'dark' : ''}`}>{String(index + 1).padStart(2, '0')}</div>
              <h3>{item.title}</h3>
              <p>{item.note}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
