import PageShell from '../components/PageShell'
import EnquiryForm from '../components/EnquiryForm'

export default function Contact() {
  return (
    <PageShell
      eyebrow="Contact"
      title="Start with a conversation."
      description="Tell us what you need and we’ll guide you to the right service, timeline and next step."
      aside={
        <div className="hero-board">
          <span className="service-card-kicker">Office details</span>
          <h3>Reach out by phone, email or WhatsApp.</h3>
          <p>We’re set up for quick response and clear follow-up.</p>
          <div className="hero-board-grid">
            <div className="mini-card">
              <strong>Email</strong>
              <span>advisory@successtunnel.com</span>
            </div>
            <div className="mini-card">
              <strong>Phone</strong>
              <span>+1 (800) 555-0199</span>
            </div>
            <div className="mini-card">
              <strong>WhatsApp</strong>
              <span>Instant chat support</span>
            </div>
            <div className="mini-card">
              <strong>Hours</strong>
              <span>Mon–Sat, 10:00 AM to 7:00 PM</span>
            </div>
          </div>
        </div>
      }
    >
      <section className="section-surface">
        <div className="contact-grid">
          <div className="contact-panel">
            <span className="eyebrow">Office</span>
            <h2>Contact details and location.</h2>
            <p>Use this page for direct contact and lead capture.</p>
            <div className="contact-details">
              <div>
                <strong>Email</strong>
                <p>advisory@successtunnel.com</p>
              </div>
              <div>
                <strong>Phone</strong>
                <p>+1 (800) 555-0199</p>
              </div>
              <div>
                <strong>Map</strong>
                <p>Office map embed can be added here before launch.</p>
              </div>
            </div>
          </div>

          <EnquiryForm
            page="contact"
            title="Send us your enquiry"
            subtitle="We usually respond within one business day."
            buttonLabel="Send message"
          />
        </div>
      </section>
    </PageShell>
  )
}
