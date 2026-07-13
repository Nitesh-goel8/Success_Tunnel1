import type { ReactNode } from 'react'
import Nav from './Nav'
import Footer from './Footer'

export default function PageShell({
  eyebrow,
  title,
  description,
  aside,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  aside: ReactNode
  children: ReactNode
}) {
  const theme = eyebrow.toLowerCase().includes('property') || eyebrow.toLowerCase().includes('rental')
    ? 'theme-sage'
    : eyebrow.toLowerCase().includes('education') || eyebrow.toLowerCase().includes('learn')
      ? 'theme-violet'
      : eyebrow.toLowerCase().includes('finance') || eyebrow.toLowerCase().includes('investment')
        ? 'theme-blue'
        : 'theme-coral'

  return (
    <div className={`public-page ${theme}`}>
      <Nav />
      <main>
        <section className="page-hero page-hero-reframed">
          <div className="container article-hero">
            <div>
              <span className="eyebrow">{eyebrow}</span>
              <h1 style={{ margin: '18px 0 0', fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 0.98, letterSpacing: '-.05em' }}>
                {title}
              </h1>
              <p style={{ margin: '18px 0 0', maxWidth: 700, color: 'var(--muted)', fontSize: '1.06rem' }}>
                {description}
              </p>
            </div>
            <div className="article-feature page-hero-aside">{aside}</div>
          </div>
        </section>
        {children}
      </main>
      <Footer />
    </div>
  )
}
