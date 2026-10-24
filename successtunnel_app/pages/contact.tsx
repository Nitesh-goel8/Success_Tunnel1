import React from 'react'
import Head from 'next/head'
import GuidedEnquiry from '../components/GuidedEnquiry'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import { useSiteSettings } from '../components/SiteSettingsProvider'
import { toTelHref, toWhatsAppHref } from '../lib/siteSettings'
import { HiLocationMarker, HiPhone, HiMail, HiClock } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'

const faqs = [
  {
    question: 'How fast is your initial advisory consultation response?',
    answer: 'Our advisory team responds to all corporate inquiries within 24 hours on business days, providing a clear scope review and checklist of required statutory documents.'
  },
  {
    question: 'Do I need to prepare any statutory documents before the consultation?',
    answer: 'No initial preparation is mandatory. During our first diagnostic conversation, we will clarify your objective and outline the exact documentation requirements.'
  },
  {
    question: 'Do you offer both in-person and virtual consultation?',
    answer: 'Yes. Clients can meet our advisory partners at our Panipat headquarters or connect remotely via encrypted video conference (Google Meet / Zoom).'
  }
]

export default function Contact() {
  const settings = useSiteSettings()

  return (
    <>
      <Head>
        <title>Contact &amp; Advisory Consultation — Success Tunnel | Panipat</title>
        <meta
          name="description"
          content="Schedule an advisory consultation with Success Tunnel at our Panipat headquarters or connect virtually. Advisory across corporate compliance, finance, and commercial real estate."
        />
        <link rel="canonical" href="https://successtunnel.in/contact" />
        <meta property="og:title" content="Contact & Advisory Consultation — Success Tunnel" />
        <meta property="og:description" content="Reach out to the Success Tunnel advisory desk in Panipat, Haryana. Direct partner accountability and structured consultation." />
        <meta property="og:url" content="https://successtunnel.in/contact" />
        <meta property="og:type" content="website" />
      </Head>

      <div>
        <Nav />
        <main>
          <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
            <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
              <div className="editorial-tag" style={{ marginBottom: '20px' }}>
                <span className="editorial-tag-dot" />
                Advisory Consultation Desk
              </div>
              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)',
                  lineHeight: '1.1',
                  letterSpacing: '-0.035em',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  margin: '16px auto 24px'
                }}
              >
                Schedule an In-Person or Virtual Consultation.
              </h1>
              <p style={{ fontSize: '1.14rem', color: 'var(--muted)', lineHeight: '1.68' }}>
                Directly connect with our practice partners for corporate tax filings, capital procurement, or commercial property acquisition in Panipat.
              </p>
            </div>
          </section>

          <section className="section-surface" id="enquiry-form">
            <div className="container contact-section-grid">
              <div className="contact-info-panel">
                <div className="editorial-tag" style={{ marginBottom: '16px' }}>
                  <span className="editorial-tag-dot" />
                  Corporate Headquarters
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '24px', letterSpacing: '-0.02em' }}>
                  Panipat Advisory Office
                </h3>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper"><HiLocationMarker size={22} /></div>
                  <div className="contact-detail-text">
                    <h4>Office Address</h4>
                    <p>{settings.officeAddress || 'First Floor, Sudarshan Tower, Tau Devi Lal Complex, Behind Hive Hotel, Panipat 132103, Haryana'}</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper"><HiPhone size={22} /></div>
                  <div className="contact-detail-text">
                    <h4>Telephone Support</h4>
                    <p>
                      <a href={`tel:${toTelHref(settings.contactPhone1)}`} style={{ color: 'var(--primary)', fontWeight: 700, display: 'block' }}>{settings.contactPhone1}</a>
                      {settings.contactPhone2 && (
                        <a href={`tel:${toTelHref(settings.contactPhone2)}`} style={{ color: 'var(--muted)', fontSize: '0.92rem', display: 'block' }}>{settings.contactPhone2}</a>
                      )}
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper"><HiMail size={22} /></div>
                  <div className="contact-detail-text">
                    <h4>Corporate Email</h4>
                    <p>
                      <a href={`mailto:${settings.contactEmail || 'contact@successtunnel.in'}`} style={{ color: 'var(--primary)', fontWeight: 700 }}>
                        {settings.contactEmail || 'contact@successtunnel.in'}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper"><FaWhatsapp size={22} /></div>
                  <div className="contact-detail-text">
                    <h4>WhatsApp Direct</h4>
                    <p>
                      <a href={`https://wa.me/${toWhatsAppHref(settings.whatsappNumber)}`} target="_blank" rel="noreferrer" style={{ color: '#16a34a', fontWeight: 700 }}>
                        Message our Advisory Desk &rarr;
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper"><HiClock size={22} /></div>
                  <div className="contact-detail-text">
                    <h4>Business Hours</h4>
                    <p>{settings.workingHours || 'Mon - Sat: 10:00 AM - 6:00 PM'}</p>
                  </div>
                </div>
              </div>

              <div className="contact-form-panel">
                <GuidedEnquiry page="contact" title="Submit Advisory Scope" subtitle="Specify your requirement below and our designated practice head will follow up directly." />
              </div>
            </div>
          </section>

          <section className="section-surface" style={{ padding: '40px 0' }}>
            <div className="container" style={{ maxWidth: '1000px', textAlign: 'center' }}>
              <div style={{ background: '#f8fafc', border: '1px solid var(--line)', borderRadius: '16px', padding: '36px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>
                  Visiting Our Panipat Headquarters?
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.98rem', maxWidth: '640px', margin: '0 auto 20px auto', lineHeight: '1.6' }}>
                  Our corporate chambers are situated on the First Floor of Sudarshan Tower, Tau Devi Lal Complex (behind Hive Hotel), Panipat. Prior appointment scheduling is advised to ensure key practice leaders are on hand.
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.officeAddress || 'Sudarshan Tower, Tau Devi Lal Complex, Panipat, Haryana')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px' }}
                >
                  <HiLocationMarker size={18} style={{ color: 'var(--accent)' }} /> View on Google Maps &rarr;
                </a>
              </div>
            </div>
          </section>

          <section className="section-surface" style={{ background: '#ffffff' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
              <div style={{ textAlign: 'center', marginBottom: '44px' }}>
                <div className="editorial-tag" style={{ marginBottom: '14px' }}>
                  <span className="editorial-tag-dot" />
                  Client Guidance
                </div>
                <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 0' }}>
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <details key={index} style={{ background: 'var(--surface-soft)', border: '1px solid var(--line)', borderRadius: '12px', padding: '18px 22px', marginBottom: '14px' }}>
                    <summary style={{ fontWeight: 700, color: 'var(--primary)', cursor: 'pointer', outline: 'none' }}>
                      {faq.question}
                    </summary>
                    <p style={{ marginTop: '12px', color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6', margin: '12px 0 0' }}>
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
