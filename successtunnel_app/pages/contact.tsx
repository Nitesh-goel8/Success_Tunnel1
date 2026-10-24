import React from 'react'
import Head from 'next/head'
import GuidedEnquiry from '../components/GuidedEnquiry'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import { useSiteSettings } from '../components/SiteSettingsProvider'
import { toTelHref, toWhatsAppHref } from '../lib/siteSettings'
import {
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineClock,
  HiShieldCheck,
  HiExternalLink,
} from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'

const faqs = [
  {
    question: 'How fast is your initial consultation response?',
    answer:
      'Our advisory team at Panipat headquarters reviews all submitted inquiries and responds within 24 hours on business days, providing a clear roadmap of required documents and next steps.',
  },
  {
    question: 'Do I need to prepare any documents before the consultation?',
    answer:
      'No initial preparation is mandatory. In our first conversation, we clarify your commercial or statutory objectives and provide a concise checklist of only the necessary filings or records.',
  },
  {
    question: 'Do you offer virtual meetings in addition to in-person consultations?',
    answer:
      'Yes. While clients frequently visit our headquarters at Sudarshan Tower in Panipat, we conduct structured virtual advisory sessions globally via Zoom, Google Meet, and Microsoft Teams.',
  },
  {
    question: 'Are client discussions and document shared protected by confidentiality?',
    answer:
      'All client communications, statutory disclosures, and financial statements are strictly protected under statutory professional confidentiality and non-disclosure governance.',
  },
]

export default function Contact() {
  const settings = useSiteSettings()

  return (
    <>
      <Head>
        <title>Contact Us — Success Tunnel | Book Consultation &bull; Panipat, Haryana</title>
        <meta
          name="description"
          content="Get in touch with Success Tunnel for corporate consulting, finance, practical education, investment, and commercial real estate inquiries at our Panipat headquarters."
        />
        <link rel="canonical" href="https://successtunnel.in/contact" />
        <meta property="og:title" content="Contact Us — Success Tunnel" />
        <meta
          property="og:description"
          content="Connect with the Success Tunnel advisory team at Sudarshan Tower, Panipat. We guide you to the right service path with clear next steps."
        />
        <meta property="og:url" content="https://successtunnel.in/contact" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="cinematic-theme-root">
        <Nav />

        <main>
          {/* Header */}
          <section
            style={{
              paddingTop: 'clamp(50px, 8vw, 90px)',
              paddingBottom: 'clamp(36px, 5vw, 60px)',
              textAlign: 'center',
            }}
          >
            <div className="container" style={{ maxWidth: '820px' }}>
              <span
                className="eyebrow"
                style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px',
                }}
              >
                DIRECT ADVISORY CHANNEL &bull; PANIPAT HQ
              </span>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
                  lineHeight: '1.1',
                  letterSpacing: '-0.04em',
                  fontWeight: 900,
                  color: '#f8fafc',
                  margin: '0 auto 24px',
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                Let&apos;s Start a Strategic Conversation.
              </h1>

              <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: '1.7', margin: '0 auto' }}>
                Connect with {settings.contactPerson || 'Neeraj Aggarwal, CA'} and our multidisciplinary advisory team at Panipat. We provide actionable roadmaps tailored to your commercial priorities.
              </p>
            </div>
          </section>

          {/* Contact Details & Guided Enquiry Form */}
          <section style={{ paddingBottom: '96px' }}>
            <div className="container contact-section-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              {/* Contact Information Panel */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(9, 13, 22, 0.95) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: 'clamp(28px, 4vw, 44px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '28px',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    HEADQUARTERS OFFICE
                  </span>
                  <h3 style={{ fontSize: '1.75rem', color: '#f8fafc', fontWeight: 800, margin: '8px 0 0', fontFamily: "'Sora', sans-serif" }}>
                    Panipat Corporate Office
                  </h3>
                </div>

                {/* Address */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                      flexShrink: 0,
                    }}
                  >
                    <HiOutlineLocationMarker size={22} />
                  </div>
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700, margin: '0 0 6px' }}>
                      Physical Address
                    </h4>
                    <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.6', margin: '0 0 8px' }}>
                      {settings.officeAddress}
                    </p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(settings.officeAddress)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      View on Google Maps <HiExternalLink size={14} />
                    </a>
                  </div>
                </div>

                {/* Telephone */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(96, 165, 250, 0.1)',
                      border: '1px solid rgba(96, 165, 250, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#60a5fa',
                      flexShrink: 0,
                    }}
                  >
                    <HiOutlinePhone size={22} />
                  </div>
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700, margin: '0 0 6px' }}>
                      Advisory Desk
                    </h4>
                    <p style={{ margin: 0 }}>
                      <a href={`tel:${toTelHref(settings.contactPhone1)}`} style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none', display: 'block', fontSize: '1rem' }}>
                        {settings.contactPhone1}
                      </a>
                      <a href={`tel:${toTelHref(settings.contactPhone2)}`} style={{ color: '#94a3b8', fontSize: '0.88rem', textDecoration: 'none', display: 'block', marginTop: '2px' }}>
                        {settings.contactPhone2}
                      </a>
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10b981',
                      flexShrink: 0,
                    }}
                  >
                    <FaWhatsapp size={22} />
                  </div>
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700, margin: '0 0 4px' }}>
                      Instant Messaging
                    </h4>
                    <p style={{ margin: 0 }}>
                      <a
                        href={`https://wa.me/${toWhatsAppHref(settings.whatsappNumber)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#10b981', fontWeight: 700, textDecoration: 'none', fontSize: '0.92rem' }}
                      >
                        Start WhatsApp Consultation &rarr;
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email & Working Hours */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(168, 85, 247, 0.1)',
                      border: '1px solid rgba(168, 85, 247, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#a855f7',
                      flexShrink: 0,
                    }}
                  >
                    <HiOutlineMail size={22} />
                  </div>
                  <div>
                    <h4 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700, margin: '0 0 4px' }}>
                      Written Communications
                    </h4>
                    <p style={{ margin: 0 }}>
                      <a href={`mailto:${settings.contactEmail}`} style={{ color: '#f8fafc', fontWeight: 600, textDecoration: 'none' }}>
                        {settings.contactEmail}
                      </a>
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.82rem', marginTop: '6px' }}>
                      <HiOutlineClock size={15} />
                      <span>{settings.workingHours || 'Mon - Sat: 10:00 AM - 6:00 PM'}</span>
                    </div>
                  </div>
                </div>

                {/* Lead Practitioner Governance Card */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '0.86rem',
                    color: '#cbd5e1',
                    lineHeight: '1.5',
                  }}
                >
                  <strong style={{ color: '#f8fafc', display: 'block', marginBottom: '2px' }}>
                    Principal Governance
                  </strong>
                  Led by {settings.contactPerson || 'Neeraj Aggarwal'}, {settings.contactRole || 'Chartered Accountant & Principal Advisor'}.
                </div>
              </div>

              {/* Interactive Guided Enquiry Form Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(9, 13, 22, 0.95) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: 'clamp(28px, 4vw, 44px)',
                }}
              >
                <GuidedEnquiry
                  page="Contact Page"
                  title="Submit Practice Enquiry"
                  subtitle="Choose your focus area and provide basic details. Our team responds within one working day."
                />
              </div>
            </div>
          </section>

          {/* Common Questions / FAQs */}
          <section style={{ padding: '80px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div className="container" style={{ maxWidth: '840px' }}>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <span className="eyebrow" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)' }}>
                  CONSULTATION PROTOCOLS
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                    color: '#f8fafc',
                    fontWeight: 800,
                    margin: '14px 0 0',
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  Frequently Asked Questions
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      padding: '24px 28px',
                    }}
                  >
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 10px', fontFamily: "'Sora', sans-serif" }}>
                      {faq.question}
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.94rem', lineHeight: '1.65', margin: 0 }}>
                      {faq.answer}
                    </p>
                  </div>
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
