import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import GuidedEnquiry from '../components/GuidedEnquiry'
import { prisma } from '../lib/prisma'
import { sampleServices } from '../lib/sampleData'
import { HiAcademicCap, HiArrowRight, HiBriefcase, HiChartBar, HiCheck, HiOfficeBuilding, HiTrendingUp, HiUsers } from 'react-icons/hi'

const serviceMeta: Record<string, { icon: any; label: string; description: string }> = {
  consultancy: { icon: HiBriefcase, label: 'Consultancy', description: 'Business guidance, registrations and practical support.' },
  finance: { icon: HiChartBar, label: 'Finance', description: 'Funding, planning and financial solutions.' },
  education: { icon: HiAcademicCap, label: 'Education', description: 'Learning support for students and professionals.' },
  investment: { icon: HiTrendingUp, label: 'Investment', description: 'Clear options for building your future.' },
  'real-estate': { icon: HiOfficeBuilding, label: 'Real Estate', description: 'Property help for buying, selling and investing.' },
  'rental-space': { icon: HiUsers, label: 'Rental Space', description: 'The right residential or commercial space.' },
}

const defaults = Object.entries(serviceMeta).map(([slug, service]) => ({ slug, title: service.label }))

const trustedBrands = [
  'Partner Companies',
  'Client Companies',
  'Associations',
  'Partner Companies',
  'Client Companies',
  'Associations',
]

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'CEO, TechFlow',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    quote: "SuccessTunnel didn't just give us advice; they gave us a roadmap. Their financial restructuring saved our expansion."
  },
  {
    name: 'Marcus Thorne',
    role: 'Director, BlueRock',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    quote: "The strategic insight provided during our property acquisition was phenomenal. They understand the market like no one else."
  },
  {
    name: 'Anita Rao',
    role: 'Founder, Wellness Collective',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
    quote: "From consultancy to finding our first flagship office, SuccessTunnel was with us. They are a true partner in growth."
  }
]

export default function Home({ services }: { services: any[] }) {
  const serviceItems = Array.from(new Map([...(services || []), ...sampleServices, ...defaults].map(item => [item.slug, item])).values()).filter((item: any) => serviceMeta[item.slug])

  return <div className="rebuild-home refresh-home"><Nav /><main>
    {/* Secondary Sub-Navbar */}
    <section className="home-service-strip" aria-label="Our services">
      <div className="container service-strip-inner">
        <span>Our services</span>
        <div>
          {serviceItems.map((service: any) => <Link key={service.slug} href={`/services/${service.slug}`}>{service.title}</Link>)}
        </div>
        <Link href="/services" className="service-strip-all">View all <HiArrowRight /></Link>
      </div>
    </section>

    {/* Hero Section */}
    <section className="refresh-hero">
      <div className="container refresh-hero-grid">
        <div className="refresh-hero-copy">
          <p className="eyebrow"><span /> One place for your next step</p>
          <h1>The Fastest Way to <em className="hero-word-cycle"><span>Big Success.</span><span>Real Growth.</span><span>Better Results.</span></em></h1>
          <p>Business, finance, education, investment or property — tell us what you need and we will help you find the right way forward.</p>
          <div className="refresh-hero-actions">
            <a href="#enquiry" className="btn btn-primary">Talk to our team <HiArrowRight /></a>
            <Link href="/services" className="simple-link">Explore services <HiArrowRight /></Link>
          </div>
          <div className="hero-trust"><HiCheck /> Simple advice. Real people. Clear next steps.</div>
        </div>
        
        <div className="success-map" aria-label="How SuccessTunnel helps you move forward">
          <div className="map-caption"><span>YOUR PATH TO SUCCESS</span><b>Start with one conversation.</b></div>
          <div className="map-line" />
          <article className="map-card map-card-one">
            <span>01</span>
            <div>
              <small>START HERE</small>
              <strong>Tell us your goal</strong>
              <p>What do you want to achieve?</p>
            </div>
          </article>
          <article className="map-card map-card-two">
            <span>02</span>
            <div>
              <small>WE GUIDE YOU</small>
              <strong>Find the right support</strong>
              <p>Choose the service that fits.</p>
            </div>
          </article>
          <article className="map-card map-card-three">
            <span>03</span>
            <div>
              <small>MOVE AHEAD</small>
              <strong>Take the next step</strong>
              <p>Get going with confidence.</p>
            </div>
          </article>
          <div className="map-burst">Success<br/><i>starts here</i></div>
        </div>
      </div>
    </section>

    {/* Strategic Partner Companies & Associations Logo Carousel */}
    <section className="trusted-logos-section">
      <div className="container">
        <div className="trusted-title">Strategic Partner Companies &amp; Associations</div>
        <div className="logo-slider">
          <div className="logo-slide-track">
            {trustedBrands.map((brand, idx) => (
              <div key={idx} className="logo-item">
                <span>🏢</span> {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Service Picker Grid */}
    <section className="service-picker-section">
      <div className="container">
        <div className="friendly-heading">
          <div>
            <p className="eyebrow"><span /> Choose what you need</p>
            <h2>How can we help <em>today?</em></h2>
          </div>
          <p>Pick a service to learn more, or send us your question and we will guide you.</p>
        </div>
        <div className="friendly-service-grid">
          {serviceItems.map((service: any) => {
            const meta = serviceMeta[service.slug];
            const Icon = meta.icon;
            return <Link href={`/services/${service.slug}`} key={service.slug} className="friendly-service-card">
              <Icon />
              <div>
                <h3>{service.title}</h3>
                <p>{service.excerpt || meta.description}</p>
              </div>
              <HiArrowRight />
            </Link>
          })}
        </div>
      </div>
    </section>

    {/* About Us / Stats Grid Section */}
    <section className="rebuild-about" id="about" style={{ padding: '80px 0', borderTop: '1px solid var(--hair)', borderBottom: '1px solid var(--hair)' }}>
      <div className="container">
        <div className="about-grid">
          <div>
            <p className="eyebrow"><span></span> Why Success Tunnel</p>
            <h2 style={{ marginTop: '16px' }}>One partner.<br /><em>Every business need.</em></h2>
            <p style={{ color: 'var(--soft-ink)', marginTop: '22px', fontSize: '1.02rem', lineHeight: '1.7' }}>
              SuccessTunnel eliminates the complexity of coordinating multiple service providers. From registration and finance to strategic growth and premium commercial properties, we align everything under a single plan.
            </p>
            <p style={{ color: 'var(--soft-ink)', marginTop: '16px', fontSize: '1.02rem', lineHeight: '1.7', marginBottom: '32px' }}>
              With over a decade of hands-on expertise across India, our team focuses on what actually works for your business.
            </p>
            <Link href="/about" className="simple-link">Learn more about us <HiArrowRight /></Link>
          </div>

          <div className="about-stats-grid">
            {[
              { number: '10+', label: 'Years of Experience' },
              { number: '1000+', label: 'Clients Served' },
              { number: '500+', label: 'Projects Completed' },
              { number: '98%', label: 'Client Satisfaction' },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <strong>{stat.number}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Client Reflections / Testimonials Section */}
    <section className="rebuild-testimonials" style={{ padding: '80px 0', borderBottom: '1px solid var(--hair)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <p className="eyebrow"><span></span> Client Reflections</p>
          <h2 style={{ marginTop: '16px' }}>Trusted by growing <em>enterprises.</em></h2>
        </div>

        <div className="reflections-grid">
          {testimonials.map((t, idx) => (
            <div key={idx} className="reflection-card">
              <div>
                <div className="reflection-header">
                  <div className="reflection-author-info">
                    <img src={t.avatar} alt={t.name} className="reflection-avatar" />
                    <div>
                      <h4 className="reflection-author-name">{t.name}</h4>
                      <span className="reflection-author-role">{t.role}</span>
                    </div>
                  </div>
                  <div className="quote-icon">“</div>
                </div>
                <p className="reflection-text">"{t.quote}"</p>
              </div>
              <div className="reflection-stars">★★★★★</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Contact / Guided Enquiry Section */}
    <section className="rebuild-contact refresh-contact" id="enquiry">
      <div className="container rebuild-contact-grid">
        <div>
          <p className="eyebrow"><span /> Let’s begin</p>
          <h2>Tell us what you need.<br/><em>We’ll help from there.</em></h2>
          <p>There is no need to have everything figured out. Send a quick message and our team will get back to you.</p>
          <Link href="/contact" className="simple-link">Prefer to call or WhatsApp? <HiArrowRight /></Link>
        </div>
        <GuidedEnquiry page="Homepage" title="What can we help you with?" subtitle="Choose a service, share a few details, and we will get in touch." />
      </div>
    </section>
  </main><Footer /></div>
}

export async function getStaticProps() {
  try {
    const services = await prisma.service.findMany({ take: 6 })
    return { props: { services: JSON.parse(JSON.stringify(services)) }, revalidate: 60 }
  } catch {
    return { props: { services: sampleServices }, revalidate: 60 }
  }
}

