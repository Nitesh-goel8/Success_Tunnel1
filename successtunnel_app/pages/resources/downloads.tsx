import PageShell from '../../components/PageShell'

const downloads = [
  { title: 'New Client Checklist', category: 'Consultancy', note: 'Request this PDF during onboarding.' },
  { title: 'Financial Planning Form', category: 'Finance', note: 'Useful for advisory and application prep.' },
  { title: 'Study Notes Sample', category: 'Education', note: 'Preview learning material structure.' },
  { title: 'Property Requirement Sheet', category: 'Real Estate', note: 'Capture shortlist criteria before viewing.' },
]

export default function Downloads() {
  return (
    <PageShell
      eyebrow="Downloads"
      title="Forms, checklists and PDFs."
      description="A clean downloads hub for future assets and lead capture."
      aside={
        <div className="hero-board">
          <span className="service-card-kicker">Download hub</span>
          <h3>Request documents and forms in one place.</h3>
          <p>These cards can later be wired to real file URLs or CMS attachments.</p>
          <div className="hero-board-grid">
            {downloads.map(item => (
              <div key={item.title} className="mini-card">
                <strong>{item.title}</strong>
                <span>{item.category}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <section className="section-surface">
        <div className="section-heading">
          <span className="eyebrow">Available files</span>
          <h2>Request-ready download cards.</h2>
        </div>
        <div className="article-grid">
          {downloads.map(item => (
            <article key={item.title} className="article-card">
              <div className="article-meta">{item.category}</div>
              <h3>{item.title}</h3>
              <p>{item.note}</p>
              <span className="article-footer">Request file →</span>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
