import Footer from '../components/Footer'
import Nav from '../components/Nav'
import GuidedEnquiry from '../components/GuidedEnquiry'
import { useSiteSettings } from '../components/SiteSettingsProvider'
import { toTelHref, toWhatsAppHref } from '../lib/siteSettings'
import { HiArrowRight, HiClock, HiMail, HiPhone } from 'react-icons/hi'

export default function Contact() {
  const settings = useSiteSettings()

  return <div className="rebuild-contact-page"><Nav /><main>
    <section className="services-hero contact-hero-rebuild"><div className="container"><p className="eyebrow"><span /> Let’s talk</p><h1>Tell us what you need.<br/><em>We’ll help you start.</em></h1><p>You do not need to have every detail ready. Share your question and our team will point you in the right direction.</p></div></section>
    <section className="contact-rebuild"><div className="container contact-rebuild-grid"><aside><p className="eyebrow">Choose what works for you</p><h2>Talk to a real<br/><em>person.</em></h2><a href={'tel:' + toTelHref(settings.contactPhone1)}><HiPhone /><span><small>Call us</small>{settings.contactPhone1}</span><HiArrowRight /></a><a href={'mailto:' + settings.contactEmail}><HiMail /><span><small>Email us</small>{settings.contactEmail}</span><HiArrowRight /></a><a href={'https://wa.me/' + toWhatsAppHref(settings.whatsappNumber)} target="_blank" rel="noreferrer"><span className="contact-wa">WA</span><span><small>WhatsApp</small>Message the team</span><HiArrowRight /></a><div className="contact-hours"><HiClock /><span><small>Working hours</small>{settings.workingHours}</span></div></aside><GuidedEnquiry page="Contact" title="How can we help?" subtitle="Choose a service and share a few details. We will get back to you." /></div></section>
  </main><Footer /></div>
}
