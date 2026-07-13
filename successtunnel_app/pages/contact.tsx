import Footer from '../components/Footer'
import Nav from '../components/Nav'
import GuidedEnquiry from '../components/GuidedEnquiry'
import { useSiteSettings } from '../components/SiteSettingsProvider'
import { toTelHref, toWhatsAppHref } from '../lib/siteSettings'
<<<<<<< Updated upstream
import { HiArrowRight, HiClock, HiMail, HiPhone } from 'react-icons/hi'
export default function Contact() { const settings = useSiteSettings(); return <div className="rebuild-contact-page"><Nav /><main><section className="services-hero contact-hero-rebuild"><div className="container"><p className="eyebrow"><span /> The first conversation</p><h1>Let’s make your next move <em>clearer.</em></h1><p>You do not need a perfectly formed brief. Bring the question, and we will help you find a practical starting point.</p></div></section><section className="contact-rebuild"><div className="container contact-rebuild-grid"><aside><p className="eyebrow">Choose what is easiest</p><h2>Talk to a real<br/><em>person.</em></h2><a href={'tel:' + toTelHref(settings.contactPhone1)}><HiPhone /><span><small>Call us</small>{settings.contactPhone1}</span><HiArrowRight /></a><a href={'mailto:' + settings.contactEmail}><HiMail /><span><small>Email us</small>{settings.contactEmail}</span><HiArrowRight /></a><a href={'https://wa.me/' + toWhatsAppHref(settings.whatsappNumber)} target="_blank" rel="noreferrer"><span className="contact-wa">WA</span><span><small>WhatsApp</small>Message the team</span><HiArrowRight /></a><div className="contact-hours"><HiClock /><span><small>Working hours</small>{settings.workingHours}</span></div></aside><GuidedEnquiry page="Contact" title="Tell us a little about it." /></div></section></main><Footer /></div> }
=======
import { HiArrowNarrowUp, HiClock, HiLocationMarker, HiMail, HiPhone } from 'react-icons/hi'

export default function Contact() {
  const settings = useSiteSettings()
  return (
    <div className="contact-page">
      <Nav />
      <main>
        <section className="contact-hero">
          <div className="container contact-hero-grid">
            <div><span className="eyebrow">The first conversation</span><h1>Let’s make your<br />next move <em>clearer.</em></h1><p>Tell us what you are thinking about. You do not need a perfectly formed brief—just a place to begin.</p></div>
            <div className="contact-hero-note"><span>WHAT HAPPENS NEXT</span><strong>01</strong><p>We read your message, connect you with the right person, and agree a simple next step.</p></div>
          </div>
        </section>

        <section className="contact-conversation"><div className="container contact-conversation-grid">
          <aside className="contact-channel-list">
            <span className="eyebrow">Choose what is easiest</span>
            <h2>Talk to a real person.</h2>
            <a href={`tel:${toTelHref(settings.contactPhone1)}`}><HiPhone /><span><small>Call us</small>{settings.contactPhone1}</span><HiArrowNarrowUp /></a>
            <a href={`mailto:${settings.contactEmail}`}><HiMail /><span><small>Email us</small>{settings.contactEmail}</span><HiArrowNarrowUp /></a>
            <a href={`https://wa.me/${toWhatsAppHref(settings.whatsappNumber)}`} target="_blank" rel="noreferrer"><span className="contact-channel-icon">WA</span><span><small>WhatsApp</small>Message the team</span><HiArrowNarrowUp /></a>
            <div className="contact-hours"><HiClock /><span><small>When we are here</small>{settings.workingHours}</span></div>
          </aside>
          <div className="contact-form-new"><EnquiryForm page="ContactPage" title="Tell us a little about it" subtitle="We’ll reply with a useful next step, not a generic sales message." buttonLabel="Send enquiry" /></div>
        </div></section>

        <section className="contact-visit"><div className="container contact-visit-grid"><div><span className="eyebrow">Visit us</span><h2>In the neighbourhood?<br /><em>Come in and talk.</em></h2><p><HiLocationMarker /> {settings.officeAddress}</p><a href={settings.mapLink} target="_blank" rel="noreferrer">Open in Google Maps <HiArrowNarrowUp /></a></div><div className="contact-map-wrap"><iframe src={settings.mapEmbedUrl} title={`${settings.businessName} office map`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></div></section>
      </main>
      <Footer />
    </div>
  )
}
>>>>>>> Stashed changes
