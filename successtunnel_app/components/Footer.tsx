export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="brand">Success Tunnel</div>
          <p>Enterprise consulting for growth, finance, education and property with precision and trust.</p>
        </div>

        <div className="footer-column">
          <h4>Navigation</h4>
          <div className="footer-links">
            <a href="/about">About Us</a>
            <a href="/services">Services</a>
            <a href="/blog">Blog</a>
            <a href="/properties">Properties</a>
            <a href="/resources">Resources</a>
            <a href="/contact">Contact</a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Legal</h4>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/admin/login">Admin Login</a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Contact</h4>
          <div className="footer-links">
            <a href="mailto:advisory@successtunnel.com">advisory@successtunnel.com</a>
            <a href="tel:+18005550199">+1 (800) 555-0199</a>
            <a href="https://wa.me/18005550199" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="footer-divider">© {new Date().getFullYear()} Success Tunnel. All rights reserved.</div>
    </footer>
  )
}
