import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Terms() {
  return (
    <div>
      <Nav />
      <main>
        <section className="page-hero">
          <div className="container article-hero">
            <div>
              <span className="eyebrow">Legal</span>
              <h1 style={{ margin: '18px 0 0', fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 0.98, letterSpacing: '-.05em' }}>
                Terms of Service
              </h1>
              <p style={{ margin: '18px 0 0', maxWidth: 700, color: 'var(--muted)', fontSize: '1.06rem' }}>
                This page can be expanded with your final terms wording before launch.
              </p>
            </div>
            <div className="article-feature">
              <div className="service-card-kicker">Placeholder</div>
              <h2 style={{ margin: '14px 0 0', fontSize: '2rem', lineHeight: 1.04 }}>Terms content goes here.</h2>
              <p style={{ marginTop: 14 }}>
                We created this page so the footer link remains valid while the final terms text is prepared.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
