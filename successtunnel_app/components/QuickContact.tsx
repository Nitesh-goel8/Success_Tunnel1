import { FaWhatsapp } from 'react-icons/fa'

export default function QuickContact() {
  return (
    <div className="quick-contact" aria-label="Quick contact options">
      <a className="whatsapp" href="https://wa.me/918950771205" target="_blank" rel="noreferrer">
        <span className="quick-contact-icon"><FaWhatsapp size={20} /></span>
        <span className="quick-contact-label">WhatsApp</span>
      </a>
    </div>
  )
}
