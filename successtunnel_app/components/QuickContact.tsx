import { FaWhatsapp } from 'react-icons/fa'
import { useSiteSettings } from './SiteSettingsProvider'
import { toWhatsAppHref } from '../lib/siteSettings'

export default function QuickContact() {
  const settings = useSiteSettings()

  return (
    <div className="quick-contact" aria-label="Quick contact options">
      <a className="whatsapp" href={`https://wa.me/${toWhatsAppHref(settings.whatsappNumber)}`} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp">
        <span className="quick-contact-icon"><FaWhatsapp size={20} /></span>
        <span className="quick-contact-label">WhatsApp</span>
      </a>
    </div>
  )
}
