import Head from 'next/head'
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
      <Head>
        <title>{title} — Success Tunnel Advisory Group | Panipat</title>
        <meta name="description" content={description} />
      </Head>
      <Nav />
      <main>
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
          <div className="container article-hero" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <div className="editorial-tag" style={{ marginBottom: '20px' }}>
                <span className="editorial-tag-dot" />
                {eyebrow}
              </div>
              <h1 style={{ margin: '14px 0 20px', fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', lineHeight: 1.1, letterSpacing: '-0.035em', fontWeight: 800, color: 'var(--primary)' }}>
                {title}
              </h1>
              <p style={{ margin: 0, maxWidth: 640, color: 'var(--muted)', fontSize: '1.12rem', lineHeight: 1.68 }}>
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
