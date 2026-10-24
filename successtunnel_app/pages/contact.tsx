import React from 'react'
import Head from 'next/head'
import GuidedEnquiry from '../components/GuidedEnquiry'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import { useSiteSettings } from '../components/SiteSettingsProvider'
import { toTelHref, toWhatsAppHref } from '../lib/siteSettings'

const faqs = [
  {
    question: 'How fast is your initial consultation response?',
    answer: 'Our advisory team typically responds to all inquiries within 24 hours on business days, providing a clear roadmap of required documents and next steps.'
  },
  {
    question: 'Do I need to prepare any documents before the consultation?',
    answer: 'No initial preparation is required. In our first call, we will clarify your goals and let you know exactly what files or documents might be needed.'
  },
  {
    question: 'Do you offer virtual meetings?',
    answer: 'Yes, we support virtual advisory sessions via Zoom, Google Meet, and Microsoft Teams to make coordination seamless from anywhere.'
  }
]

export default function Contact() {
  const settings = useSiteSettings()

  return (
    <>
      <Head>
        <title>Contact Us — Success Tunnel | Book Consultation</title>
        <meta
          name="description"
          content="Get in touch with Success Tunnel for consulting, finance, education, investment, and real estate inquiries. Schedule a consultation or send an inquiry directly."
        />
        <link rel="canonical" href="https://successtunnel.in/contact" />
        <meta property="og:title" content="Contact Us — Success Tunnel" />
        <meta property="og:description" content="Reach out to the Success Tunnel advisory team. We'll guide you to the right service path with clear next steps." />
        <meta property="og:url" content="https://successtunnel.in/contact" />
        <meta property="og:type" content="website" />
      </Head>

      <div>
        <Nav />
        <main>
          <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
            <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
              <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)', marginBottom: '24px' }}>CONTACT US</span>
              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
                  lineHeight: '1.1',
                  letterSpacing: '-0.04em',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  margin: '20px auto 30px'
                }}
              >
                Let&apos;s Start a Conversation
              </h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--muted)', lineHeight: '1.65' }}>
                Reach out to {settings.contactPerson} and our advisory team. We&apos;ll guide you to the right service path with clear next steps.
              </p>
            </div>
          </section>

          <section className="section-surface" id="enquiry-form">
            <div className="container contact-section-grid">
              <div className="contact-info-panel">
                <h3>Get In Touch</h3>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper">Location</div>
                  <div className="contact-detail-text">
                    <h4>Office Address</h4>
                    <p>{settings.officeAddress}</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper">Call</div>
                  <div className="contact-detail-text">
                    <h4>Phone Numbers</h4>
                    <p>
                      <a href={`tel:${toTelHref(settings.contactPhone1)}`} style={{ color: 'var(--primary)', fontWeight: 700, display: 'block' }}>{settings.contactPhone1}</a>
                      <a href={`tel:${toTelHref(settings.contactPhone2)}`} style={{ color: 'var(--muted)', fontSize: '0.92rem', display: 'block' }}>{settings.contactPhone2}</a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper">Email</div>
                  <div className="contact-detail-text">
                    <h4>Email Us</h4>
                    <p>
                      <a href={`mailto:${settings.contactEmail}`} style={{ color: 'var(--primary)', fontWeight: 700 }}>
                        {settings.contactEmail}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper">Chat</div>
                  <div className="contact-detail-text">
                    <h4>WhatsApp</h4>
                    <p>
                      <a href={`https://wa.me/${toWhatsAppHref(settings.whatsappNumber)}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: 700 }}>
                        Chat on WhatsApp &rarr;
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-wrapper">Hours</div>
                  <div className="contact-detail-text">
                    <h4>Business Hours</h4>
                    <p>{settings.workingHours}</p>
                  </div>
                </div>
              </div>

              <div className="contact-form-panel">
                <GuidedEnquiry page="contact" title="Tell us about your requirement" subtitle="Fill in your details below and our team will get back to you promptly." />
              </div>
            </div>
          </section>

          <section className="section-surface" style={{ padding: '40px 0' }}>
            <div className="container" style={{ maxWidth: '1000px', textAlign: 'center' }}>
              <div style={{ background: '#f8fafc', border: '1px solid var(--line)', borderRadius: '16px', padding: '32px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
                  Looking for In-Person Consultation?
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 16px auto' }}>
                  Visit our headquarters during business hours. We recommend scheduling an appointment in advance so the relevant domain consultant is available.
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.officeAddress)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.95rem' }}
                >
                  Open in Google Maps &rarr;
                </a>
              </div>
            </div>
          </section>

          <section className="section-surface" style={{ background: '#f8fafc' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)' }}>FAQ</span>
                <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 700, margin: '12px 0 0' }}>
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <details key={index} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px' }}>
                    <summary style={{ fontWeight: 700, color: 'var(--primary)', cursor: 'pointer', outline: 'none' }}>
                      {faq.question}
                    </summary>
                    <p style={{ marginTop: '12px', color: 'var(--muted)', fontSize: '0.96rem', lineHeight: '1.6' }}>
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
