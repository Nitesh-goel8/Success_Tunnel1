import React from 'react'
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Link from 'next/link'
import { useSiteSettings } from '../components/SiteSettingsProvider'

const terms = [
  {
    title: 'Use of the website',
    text: 'The website is provided for general information, enquiry submission, service discovery, and content access.',
  },
  {
    title: 'Service scope',
    text: 'Any advisory work, filings, bookings, or transactions are subject to separate confirmations, availability, and applicable service terms.',
  },
  {
    title: 'Accuracy of information',
    text: 'We aim to keep information current, but we do not guarantee that every page is error-free or suitable for every situation.',
  },
  {
    title: 'User responsibilities',
    text: 'You are responsible for providing accurate details, reviewing submissions before sending, and using the site lawfully.',
  },
]

export default function Terms() {
  const settings = useSiteSettings()

  return (
    <>
      <Head>
        <title>Terms of Service — Success Tunnel</title>
        <meta
          name="description"
          content="Terms of Service for Success Tunnel. General terms and conditions regarding the use of our website, services, and online tools."
        />
        <link rel="canonical" href="https://successtunnel.in/terms" />
        <meta property="og:title" content="Terms of Service — Success Tunnel" />
        <meta property="og:description" content="General terms and conditions regarding the use of our website and services." />
        <meta property="og:url" content="https://successtunnel.in/terms" />
        <meta property="og:type" content="website" />
      </Head>

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
                  These terms describe how the website may be used and the general expectations around our services.
                </p>
              </div>
              <div className="article-feature">
                <div className="service-card-kicker">Important Note</div>
                <h2 style={{ margin: '14px 0 0', fontSize: '1.6rem', lineHeight: 1.15 }}>Professional Engagement Standards</h2>
                <p style={{ marginTop: 14 }}>
                  All advisory engagements, filings, and project deliverables are formally defined and governed by mutual agreement.
                </p>
              </div>
            </div>
          </section>

          <section className="section-surface">
            <div className="container" style={{ maxWidth: '960px' }}>
              <div className="section-heading">
                <span className="eyebrow">GENERAL PRINCIPLES</span>
                <h2>What you can expect from these terms.</h2>
                <p>We believe in transparent terms that clearly establish expectations for clients and visitors.</p>
              </div>

              <div className="value-grid">
                {terms.map(item => (
                  <div key={item.title} className="value-card">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="section-surface" style={{ background: '#f8fafc' }}>
            <div className="container" style={{ maxWidth: '960px' }}>
              <div className="split-grid">
                <div className="split-content">
                  <span className="eyebrow">SERVICE EXECUTION</span>
                  <h2>Professional standards &amp; liability.</h2>
                  <p>
                    Success Tunnel delivers advisory services using reasonable professional skill and diligence.
                    Clients are responsible for the truthfulness and accuracy of documents submitted for filings.
                  </p>
                  <p>
                    Third-party regulatory timelines (such as government portals, tax authorities, or registry bodies)
                    are subject to statutory operational guidelines.
                  </p>
                </div>

                <div className="panel-card">
                  <div className="service-card-kicker">Contact</div>
                  <h3 style={{ marginTop: 12 }}>Questions about terms?</h3>
                  <p style={{ marginTop: 10, color: 'var(--muted)' }}>
                    Reach out if you need clarification on service scopes, terms, or coordination.
                  </p>
                  <div style={{ display: 'grid', gap: '10px', marginTop: '18px' }}>
                    <div><strong style={{ color: 'var(--primary)' }}>Email:</strong> {settings.contactEmail}</div>
                    <div><strong style={{ color: 'var(--primary)' }}>Phone:</strong> {settings.contactPhone1}</div>
                  </div>
                  <Link href="/contact" className="btn btn-primary" style={{ marginTop: '22px', width: 'fit-content' }}>
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
