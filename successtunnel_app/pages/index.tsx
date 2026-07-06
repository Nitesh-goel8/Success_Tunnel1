import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import EnquiryForm from '../components/EnquiryForm'
import { prisma } from '../lib/prisma'
import { sampleServices } from '../lib/sampleData'
import {
  HiShieldCheck, HiGlobeAlt, HiUsers, HiStar,
  HiBriefcase, HiChartBar, HiAcademicCap, HiTrendingUp, HiOfficeBuilding, HiKey,
  HiLocationMarker, HiPhone, HiMail, HiClock, HiChatAlt2,
  HiClipboardList
} from 'react-icons/hi'
import { FaWhatsapp, FaRocket, FaIndustry, FaStore, FaUniversity, FaTools, FaTrophy } from 'react-icons/fa'
import { MdHealthAndSafety } from 'react-icons/md'

const coreServices = [
  { title: 'Consultancy', slug: 'consultancy', icon: '💼', excerpt: 'Strategic planning and operational optimization for scaling enterprises.' },
  { title: 'Finance', slug: 'finance', icon: '📊', excerpt: 'Financial restructuring, investment planning, and capital procurement.' },
  { title: 'Education', slug: 'education', icon: '🎓', excerpt: 'Corporate training programs and leadership development.' },
  { title: 'Investment', slug: 'investment', icon: '📈', excerpt: 'Identifying high-yield opportunities across emerging markets.' },
  { title: 'Real Estate', slug: 'real-estate', icon: '🏢', excerpt: 'Property management and portfolio acquisition for commercial clients.' },
  { title: 'Rental Space', slug: 'rental-space', icon: '🔑', excerpt: 'Premium co-working and corporate office spaces tailored for success.' },
]

const trustedBrands = [
  'Partner Companies',
  'Client Companies',
  'Government Registrations',
  'Associations',
  'Partner Companies',
  'Client Companies',
  'Government Registrations',
  'Associations',
]

const successStories = [
  {
    category: 'FINANCE & REAL ESTATE',
    title: 'Navigating Post-Pandemic Scaling for MSMEs',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=600&auto=format&fit=crop',
    problem: 'Stagnant growth due to capital crunch.',
    solution: 'Asset-backed financing & lean operations.',
    outcome: '40% YOY revenue increase.'
  },
  {
    category: 'STRATEGIC CONSULTANCY',
    title: 'Digital Transformation for Healthcare Providers',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop',
    problem: 'Outdated patient management legacy systems.',
    solution: 'AI-integrated workflow automation.',
    outcome: '60% reduction in admin overhead.'
  },
  {
    category: 'PROPERTY SOLUTIONS',
    title: 'Optimizing Commercial Real Estate Portfolios',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
    problem: 'High vacancy rates in commercial hubs.',
    solution: 'Hybrid-work space adaptive remodeling.',
    outcome: '100% occupancy within 8 months.'
  }
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

const industries = [
  { id: 'startups', name: 'Startups', icon: <FaRocket size={22} /> },
  { id: 'msme', name: 'MSME', icon: <FaIndustry size={22} /> },
  { id: 'healthcare', name: 'Healthcare', icon: <MdHealthAndSafety size={22} /> },
  { id: 'banking', name: 'Banking', icon: <FaUniversity size={22} /> },
  { id: 'construction', name: 'Construction', icon: <FaTools size={22} /> },
  { id: 'retail', name: 'Retail', icon: <FaStore size={22} /> }
]

const blogs = [
  {
    category: 'FINANCE',
    title: 'The Future of MSME Financing in 2024',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
    excerpt: 'Exploring new avenues for debt-free capital in a rising interest rate environment.'
  },
  {
    category: 'MANAGEMENT',
    title: 'Bridging the Corporate Leadership Gap',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
    excerpt: 'How to cultivate the next generation of executives through strategic training.'
  },
  {
    category: 'PROPERTIES',
    title: 'Investing in Sustainable Commercial Spaces',
    image: 'https://images.unsplash.com/photo-1464938050744-13748f5ad1a2?q=80&w=600&auto=format&fit=crop',
    excerpt: 'Why ESG compliance is now the biggest driver for real estate ROI.'
  }
]

export default function Home({ services }: { services: any[] }) {
  const serviceItems = Array.from(
    new Map([...(services || []), ...sampleServices, ...coreServices].map(item => [item.slug, item])).values()
  ).slice(0, 6)

  const [activeInd, setActiveInd] = useState('healthcare')

  return (
    <div>
      <Nav />
      <main>
        {/* 1. Hero Section */}
        <section className="hero-section" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
          <div className="container hero-grid" style={{ alignItems: 'center' }}>
            <div className="hero-copy" style={{ textAlign: 'left' }}>
              <h1 style={{ 
                fontSize: 'clamp(2.4rem, 5.5vw, 4.6rem)', 
                lineHeight: '1.05', 
                letterSpacing: '-0.04em',
                fontWeight: 900,
                color: 'var(--primary)',
                margin: '0 0 24px 0',
                fontFamily: "'Sora', sans-serif"
              }}>
                A Fastest Way<br />
                <span style={{ background: 'linear-gradient(135deg, var(--accent), #0b3a86)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>to Big Success.</span>
              </h1>
              <p style={{ 
                fontSize: '1.15rem', 
                lineHeight: '1.65', 
                color: 'var(--muted)', 
                marginBottom: '32px', 
                maxWidth: '520px' 
              }}>
                Strategic consultancy, finance, education, investment, and real estate solutions — designed to accelerate your growth and secure your future.
              </p>
              <div className="hero-actions" style={{ justifyContent: 'flex-start', gap: '16px' }}>
                <a href="#contact" className="btn btn-primary" style={{ padding: '16px 28px' }}>
                  Book Consultation &rarr;
                </a>
                <Link href="/services" className="btn btn-secondary" style={{ padding: '16px 28px' }}>
                  Explore Services
                </Link>
              </div>

              {/* Bottom Metrics inside Hero */}
              <div className="hero-metrics-bar">
                <div className="hero-metric-item">
                  <div className="hero-metric-icon"><HiUsers size={22} /></div>
                  <div className="hero-metric-text">1000+<br/>Happy Clients</div>
                </div>
                <div className="hero-metric-item">
                  <div className="hero-metric-icon"><HiStar size={22} /></div>
                  <div className="hero-metric-text">10+ Years<br/>Experience</div>
                </div>
                <div className="hero-metric-item">
                  <div className="hero-metric-icon"><HiGlobeAlt size={22} /></div>
                  <div className="hero-metric-text">Pan India<br/>Presence</div>
                </div>
                <div className="hero-metric-item">
                  <div className="hero-metric-icon"><HiChatAlt2 size={22} /></div>
                  <div className="hero-metric-text">Free<br/>Consultation</div>
                </div>
              </div>
            </div>

            {/* Right Side: Interactive Branch Diagram */}
            <div className="hero-diagram-container">
              <svg className="hero-svg-overlay" viewBox="0 0 500 500">
                {/* Outer Dashed Circles */}
                <circle cx="250" cy="250" r="160" fill="none" stroke="rgba(22, 93, 245, 0.12)" strokeWidth="1.5" strokeDasharray="6,6" />
                <circle cx="250" cy="250" r="90" fill="none" stroke="rgba(22, 93, 245, 0.08)" strokeWidth="1.5" />
                
                {/* Connection Lines from Center */}
                <line x1="250" y1="250" x2="135" y2="120" stroke="rgba(22, 93, 245, 0.25)" strokeWidth="1.5" />
                <line x1="250" y1="250" x2="365" y2="120" stroke="rgba(22, 93, 245, 0.25)" strokeWidth="1.5" />
                <line x1="250" y1="250" x2="410" y2="250" stroke="rgba(22, 93, 245, 0.25)" strokeWidth="1.5" />
                <line x1="250" y1="250" x2="365" y2="380" stroke="rgba(22, 93, 245, 0.25)" strokeWidth="1.5" />
                <line x1="250" y1="250" x2="135" y2="380" stroke="rgba(22, 93, 245, 0.25)" strokeWidth="1.5" />
                <line x1="250" y1="250" x2="90" y2="250" stroke="rgba(22, 93, 245, 0.25)" strokeWidth="1.5" />

                {/* Little Accent Nodes on Line Paths */}
                <circle cx="190" cy="185" r="4.5" fill="var(--accent)" />
                <circle cx="310" cy="185" r="4.5" fill="var(--accent)" />
                <circle cx="350" cy="250" r="4.5" fill="var(--accent)" />
                <circle cx="310" cy="315" r="4.5" fill="var(--accent)" />
                <circle cx="190" cy="315" r="4.5" fill="var(--accent)" />
                <circle cx="150" cy="250" r="4.5" fill="var(--accent)" />
              </svg>

              {/* Central Circle */}
              <div className="hero-center-node">
                <Image
                  src="/logo.jpeg"
                  alt="SuccessTunnel"
                  width={70}
                  height={70}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                  priority
                />
              </div>

              {/* 6 Circular/Rounded Branches */}
              <Link href="/services/consultancy" className="hero-outer-node" style={{ top: '65px', left: '40px' }}>
                <span><HiBriefcase size={15} /></span> Consultancy
              </Link>
              <Link href="/services/finance" className="hero-outer-node" style={{ top: '65px', right: '40px' }}>
                <span><HiChartBar size={15} /></span> Finance
              </Link>
              <Link href="/services/education" className="hero-outer-node" style={{ top: '228px', right: '10px' }}>
                <span><HiAcademicCap size={15} /></span> Education
              </Link>
              <Link href="/services/investment" className="hero-outer-node" style={{ bottom: '65px', right: '40px' }}>
                <span><HiTrendingUp size={15} /></span> Investment
              </Link>
              <Link href="/services/real-estate" className="hero-outer-node" style={{ bottom: '65px', left: '40px' }}>
                <span><HiOfficeBuilding size={15} /></span> Real Estate
              </Link>
              <Link href="/services/rental-space" className="hero-outer-node" style={{ top: '228px', left: '10px' }}>
                <span><HiKey size={15} /></span> Rental Space
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Trusted Companies Section */}
        <section className="trusted-logos-section">
          <div className="container">
            <div className="trusted-title">Strategic Partner Companies &amp; Government Registrations</div>
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

        {/* 3. Our Expertise (What We Do) */}
        <section className="section-surface">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)' }}>OUR EXPERTISE</span>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--primary)', fontWeight: 700, margin: '12px 0 0' }}>
                Premium Solutions for Every Stage
              </h2>
            </div>

            <div className="expertise-grid">
              {serviceItems.map(service => (
                <div key={service.slug} className="expertise-card">
                  <div className="expertise-icon-wrapper">
                    {service.slug === 'consultancy' ? <HiBriefcase size={28} /> :
                     service.slug === 'finance' ? <HiChartBar size={28} /> :
                     service.slug === 'education' ? <HiAcademicCap size={28} /> :
                     service.slug === 'investment' ? <HiTrendingUp size={28} /> :
                     service.slug === 'real-estate' ? <HiOfficeBuilding size={28} /> : <HiKey size={28} />}
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.excerpt}</p>
                  <Link href={`/services/${service.slug}`} className="expertise-card-link">
                    Learn More &rarr;
                  </Link>
                </div>
              ))}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link href="/services" className="btn btn-secondary">
                View All Services &rarr;
              </Link>
            </div>
          </div>
        </section>



        {/* 7. Industries We Serve (Industries We Catalyze) */}
        <section className="section-surface">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--primary)', fontWeight: 700, margin: '0' }}>
                Industries We Catalyze
              </h2>
            </div>

            <div className="industries-container">
              {industries.map((ind) => (
                <div 
                  key={ind.id} 
                  className={`industry-card-item ${activeInd === ind.id ? 'active' : ''}`}
                  onClick={() => setActiveInd(ind.id)}
                >
                  <div className="industry-icon-container">{ind.icon}</div>
                  <span>{ind.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Reflections (Testimonials) */}
        <section className="section-surface">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--primary)', fontWeight: 700, margin: '0' }}>
                Client Reflections
              </h2>
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
                  <div className="reflection-stars">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* About Us Section */}
        <section className="section-surface" id="about" style={{ background: '#f8fafc', scrollMarginTop: '100px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div>
                <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)' }}>ABOUT US</span>
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--primary)', fontWeight: 800, lineHeight: '1.15', margin: '16px 0 20px', letterSpacing: '-0.03em' }}>
                  One Partner.<br />Every Growth Need.
                </h2>
                <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: '1.75', marginBottom: '20px' }}>
                  SuccessTunnel was built to eliminate the fragmentation that holds growing businesses back. Instead of juggling multiple advisors, you get one strategic partner for consultancy, finance, education, investment, and real estate.
                </p>
                <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: '1.75', marginBottom: '32px' }}>
                  With 10+ years of combined experience and 1000+ clients served, our team is built to deliver results — not just recommendations.
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <Link href="/contact" className="cta-btn-primary" style={{ fontSize: '0.95rem' }}>Book Consultation &rarr;</Link>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {[
                  { number: '10+', label: 'Years of Experience' },
                  { number: '1000+', label: 'Clients Served' },
                  { number: '500+', label: 'Projects Completed' },
                  { number: '98%', label: 'Client Satisfaction' },
                ].map((stat, i) => (
                  <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '20px', padding: '28px 24px', textAlign: 'center', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)' }}>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent)', fontFamily: 'Sora, sans-serif', lineHeight: 1 }}>{stat.number}</div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--muted)', fontWeight: 600, marginTop: '8px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="section-surface" id="achievements" style={{ scrollMarginTop: '100px' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span className="eyebrow" style={{ color: 'var(--accent)', background: 'rgba(22, 93, 245, 0.08)' }}>ACHIEVEMENTS</span>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--primary)', fontWeight: 800, margin: '16px 0 0', letterSpacing: '-0.03em' }}>
                Our Milestones
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '60px' }}>
              {[
                { icon: <FaTrophy size={30} />, number: '10+', label: 'Years of Experience', desc: 'A decade of trusted advisory across diverse industries and client scales.' },
                { icon: <HiUsers size={30} />, number: '1000+', label: 'Clients Served', desc: 'Built long-term partnerships with startups, MSMEs, and enterprise clients.' },
                { icon: <HiClipboardList size={30} />, number: '500+', label: 'Projects Completed', desc: 'Successfully delivered advisory, financial, and property projects.' },
                { icon: <HiStar size={30} />, number: '98%', label: 'Client Satisfaction', desc: 'Near-perfect satisfaction scores across all service categories.' },
                { icon: <HiGlobeAlt size={30} />, number: 'Pan India', label: 'Presence', desc: 'Serving clients across Haryana, Delhi NCR, and major Indian cities.' },
                { icon: <HiChatAlt2 size={30} />, number: 'Free', label: 'First Consultation', desc: 'Book a no-obligation first consultation with our principal advisor.' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '20px',
                  padding: '32px 28px',
                  boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent)', fontFamily: 'Sora, sans-serif', lineHeight: 1 }}>{item.number}</div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>{item.label}</div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Awards Row */}
            <div style={{ background: 'var(--primary)', borderRadius: '24px', padding: '40px 48px', display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.4rem', margin: '0 0 8px' }}>Recognized for Excellence</h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', margin: 0, fontSize: '0.95rem' }}>Industry awards and association recognitions</p>
              </div>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {[
                  { icon: <FaTrophy size={16} />, label: 'Excellence Award 2023' },
                  { icon: <HiUsers size={16} />, label: 'Strategic Partner 2024' },
                  { icon: <HiStar size={16} />, label: 'Best Advisory Firm 2025' }
                ].map((award, i) => (
                  <span key={i} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', padding: '10px 20px', color: '#fff', fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                    {award.icon} {award.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 9. CTA Section */}
        <section className="container">
          <div className="cta-banner-container">
            <h2>Ready to Accelerate Your Business Growth?</h2>
            <div className="cta-actions">
              <a href="#contact" className="cta-btn-primary">Book Consultation</a>
              <Link href="/contact" className="cta-btn-secondary">Contact Us</Link>
            </div>
          </div>
        </section>

        {/* 10. Contact Section */}
        <section className="section-surface" id="contact" style={{ scrollMarginTop: '100px' }}>
          <div className="container contact-section-grid">
            <div className="contact-info-panel">
              <span className="eyebrow" style={{ marginBottom: '24px' }}>TALK TO US</span>
              <h3>Let&apos;s Discuss Your Vision</h3>

              <div className="contact-detail-item">
                <div className="contact-icon-wrapper"><HiLocationMarker size={22} /></div>
                <div className="contact-detail-text">
                  <h4>Office Address</h4>
                  <p>First Floor, Sudarshan Tower<br />Tau Devi Lal Complex, Behind Hive Hotel<br />Panipat 132103, Haryana, India</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-wrapper"><HiPhone size={22} /></div>
                <div className="contact-detail-text">
                  <h4>Call Us</h4>
                  <p>
                    <a href="tel:+918950771205" style={{ color: 'var(--primary)', fontWeight: 700, display: 'block' }}>+91 89507 71205</a>
                    <a href="tel:+917206189559" style={{ color: 'var(--muted)', fontSize: '0.9rem', display: 'block' }}>+91 72061 89559</a>
                  </p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-wrapper"><HiMail size={22} /></div>
                <div className="contact-detail-text">
                  <h4>Email Us</h4>
                  <p><a href="mailto:successtunnel.in@gmail.com" style={{ color: 'var(--primary)', fontWeight: 700 }}>successtunnel.in@gmail.com</a></p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-wrapper"><FaWhatsapp size={22} /></div>
                <div className="contact-detail-text">
                  <h4>WhatsApp</h4>
                  <p><a href="https://wa.me/918950771205" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: 700 }}>Chat on WhatsApp &rarr;</a></p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-wrapper"><HiClock size={22} /></div>
                <div className="contact-detail-text">
                  <h4>Working Hours</h4>
                  <p>Mon – Sat: 10:00 AM – 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="contact-form-card">
              <EnquiryForm
                page="Homepage"
                title="Request a tailored consultation"
                subtitle="Tell us what you need and we’ll prepare a focused next step."
                buttonLabel="Send Inquiry"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const services = await prisma.service.findMany({ take: 6 })
    return { props: { services: JSON.parse(JSON.stringify(services)) } }
  } catch (error) {
    return { props: { services: sampleServices } }
  }
}

