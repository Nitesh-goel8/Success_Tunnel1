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
  return (
    <div>
      <Nav />
      <main>
        <section className="page-hero">
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
            <div className="article-feature">{aside}</div>
          </div>
        </section>
        {children}
      </main>
      <Footer />
    </div>
  )
}
