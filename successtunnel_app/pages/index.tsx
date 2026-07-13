<<<<<<< Updated upstream
import Link from 'next/link'
=======
﻿import Link from 'next/link'
>>>>>>> Stashed changes
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import GuidedEnquiry from '../components/GuidedEnquiry'
import { prisma } from '../lib/prisma'
import { sampleServices } from '../lib/sampleData'
<<<<<<< Updated upstream
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
const steps = [
  ['01', 'Tell us what you need', 'Share your goal, question or requirement.'],
  ['02', 'Get the right support', 'We connect you with the right service and person.'],
  ['03', 'Move forward', 'Take the next step with clear guidance.'],
]

export default function Home({ services }: { services: any[] }) {
  const serviceItems = Array.from(new Map([...(services || []), ...sampleServices, ...defaults].map(item => [item.slug, item])).values()).filter((item: any) => serviceMeta[item.slug])

  return <div className="rebuild-home refresh-home"><Nav /><main>
    <section className="home-service-strip" aria-label="Our services"><div className="container service-strip-inner"><span>Our services</span><div>{serviceItems.map((service: any) => <Link key={service.slug} href={`/services/${service.slug}`}>{service.title}</Link>)}</div><Link href="/services" className="service-strip-all">View all <HiArrowRight /></Link></div></section>
    <section className="refresh-hero"><div className="container refresh-hero-grid"><div className="refresh-hero-copy"><p className="eyebrow"><span /> One place for your next step</p><h1>A Fastest Way to <em className="hero-word-cycle"><span>Big Success.</span><span>Real Growth.</span><span>Better Results.</span></em></h1><p>Business, finance, education, investment or property — tell us what you need and we will help you find the right way forward.</p><div className="refresh-hero-actions"><a href="#enquiry" className="btn btn-primary">Talk to our team <HiArrowRight /></a><Link href="/services" className="simple-link">Explore services <HiArrowRight /></Link></div><div className="hero-trust"><HiCheck /> Simple advice. Real people. Clear next steps.</div></div><div className="success-map" aria-label="How SuccessTunnel helps you move forward"><div className="map-caption"><span>YOUR PATH TO SUCCESS</span><b>Start with one conversation.</b></div><div className="map-line" /><article className="map-card map-card-one"><span>01</span><div><small>START HERE</small><strong>Tell us your goal</strong><p>What do you want to achieve?</p></div></article><article className="map-card map-card-two"><span>02</span><div><small>WE GUIDE YOU</small><strong>Find the right support</strong><p>Choose the service that fits.</p></div></article><article className="map-card map-card-three"><span>03</span><div><small>MOVE AHEAD</small><strong>Take the next step</strong><p>Get going with confidence.</p></div></article><div className="map-burst">Success<br/><i>starts here</i></div></div></div></section>
    <section className="service-picker-section"><div className="container"><div className="friendly-heading"><div><p className="eyebrow"><span /> Choose what you need</p><h2>How can we help <em>today?</em></h2></div><p>Pick a service to learn more, or send us your question and we will guide you.</p></div><div className="friendly-service-grid">{serviceItems.map((service: any) => { const meta = serviceMeta[service.slug]; const Icon = meta.icon; return <Link href={`/services/${service.slug}`} key={service.slug} className="friendly-service-card"><Icon /><div><h3>{service.title}</h3><p>{service.excerpt || meta.description}</p></div><HiArrowRight /></Link> })}</div></div></section>
    <section className="simple-process"><div className="container simple-process-grid"><div><p className="eyebrow">Easy from the first call</p><h2>No complicated process.<br/><em>Just start here.</em></h2><p>We keep things simple so you know what happens next.</p></div><div className="simple-process-steps">{steps.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="rebuild-contact refresh-contact"><div className="container rebuild-contact-grid"><div><p className="eyebrow"><span /> Let’s begin</p><h2>Tell us what you need.<br/><em>We’ll help from there.</em></h2><p>There is no need to have everything figured out. Send a quick message and our team will get back to you.</p><Link href="/contact" className="simple-link">Prefer to call or WhatsApp? <HiArrowRight /></Link></div><GuidedEnquiry page="Homepage" title="What can we help you with?" subtitle="Choose a service, share a few details, and we will get in touch." /></div></section>
  </main><Footer /></div>
=======
import { useSiteSettings } from '../components/SiteSettingsProvider'
import { toTelHref } from '../lib/siteSettings'
import {
  HiArrowRight, HiArrowNarrowUp, HiBriefcase, HiChartBar, HiCheck,
  HiGlobeAlt, HiOfficeBuilding, HiPlay, HiShieldCheck, HiTrendingUp, HiUsers,
} from 'react-icons/hi'

const serviceMeta: Record<string, { label: string; icon: any; description: string }> = {
  consultancy: { label: '01', icon: HiBriefcase, description: 'Strategy that turns complex decisions into a focused plan.' },
  finance: { label: '02', icon: HiChartBar, description: 'Finance solutions designed around your next decisive move.' },
  education: { label: '03', icon: HiUsers, description: 'Practical learning that strengthens teams and leaders.' },
  investment: { label: '04', icon: HiTrendingUp, description: 'Opportunity assessment guided by clear commercial thinking.' },
  'real-estate': { label: '05', icon: HiOfficeBuilding, description: 'Property decisions made with confidence and perspective.' },
  'rental-space': { label: '06', icon: HiGlobeAlt, description: 'Workspaces that make a strong first impression.' },
}

const defaultServices = [
  { title: 'Consultancy', slug: 'consultancy' }, { title: 'Finance', slug: 'finance' },
  { title: 'Education', slug: 'education' }, { title: 'Investment', slug: 'investment' },
  { title: 'Real Estate', slug: 'real-estate' }, { title: 'Rental Space', slug: 'rental-space' },
]

const outcomes = [['1000+', 'clients supported'], ['10+', 'years of experience'], ['98%', 'client satisfaction']]
const approach = [
  ['01', 'Understand the opportunity', 'We begin with the context behind the brief—not a one-size-fits-all response.'],
  ['02', 'Build the right route', 'Your plan connects the practical next step with the outcome you want to reach.'],
  ['03', 'Move with confidence', 'Clear ownership and consistent support keep progress from losing momentum.'],
]

export default function Home({ services, featuredEducationContent }: { services: any[]; featuredEducationContent: any | null }) {
  const settings = useSiteSettings()
  const serviceItems = Array.from(
    new Map([...(services || []), ...sampleServices, ...defaultServices].map(item => [item.slug, item])).values()
  ).filter((item: any) => serviceMeta[item.slug]).slice(0, 6)

  return (
    <div>
      <Nav />
      <main>
        <section className="new-hero">
          <div className="container new-hero-grid">
            <div className="new-hero-copy">
              <div className="kicker"><span></span> A clearer way forward</div>
              <h1>The fastest way<br />to <em>big success.</em></h1>
              <p>One experienced partner for the decisions that shape your business, your finances and your future. Clear direction, considered action, real momentum.</p>
              <div className="new-hero-actions">
                <Link href="/contact" className="btn btn-primary">Let’s build your next step <HiArrowRight /></Link>
                <Link href="/services" className="text-link">See how we can help <HiArrowNarrowUp /></Link>
              </div>
              <div className="trust-line"><HiShieldCheck /> Trusted by people and businesses across India.</div>
            </div>
            <div className="hero-composition hero-story" aria-label="SuccessTunnel integrated services">
              <div className="composition-topline">PRACTICAL EXPERTISE. ONE TEAM.</div>
              <div className="story-line story-line-one"></div><div className="story-line story-line-two"></div>
              <div className="story-copy"><span>Built around</span><strong>your<br /><i>ambition.</i></strong><p>Less friction. More forward motion.</p></div>
              <div className="story-tag story-tag-one"><HiBriefcase /><span>Business<br />strategy</span></div>
              <div className="story-tag story-tag-two"><HiChartBar /><span>Money &amp;<br />growth</span></div>
              <div className="story-tag story-tag-three"><HiOfficeBuilding /><span>Space &amp;<br />property</span></div>
              <div className="story-pulse"></div>
            </div>
          </div>
        </section>

        <section className="proof-strip"><div className="container proof-grid">
          <p className="proof-statement">Built for the people who are serious about what comes next.</p>
          <div className="proof-numbers">{outcomes.map(([number, label]) => <div className="proof-item" key={label}><strong>{number}</strong><span>{label}</span></div>)}</div>
        </div></section>

        <section className="services-section"><div className="container">
          <div className="section-intro split-intro"><div><div className="kicker"><span></span> What we do</div><h2>Everything you need<br />to move <em>forward.</em></h2></div><p>We bring the right expertise together, so every decision feels connected to the bigger picture—not just the next task.</p></div>
          <div className="new-services-grid">
            {serviceItems.map(service => {
              const meta = serviceMeta[service.slug]; const Icon = meta.icon
              return <Link href={`/services/${service.slug}`} className="new-service-card" key={service.slug}>
                <div className="service-card-head"><span>{meta.label}</span><HiArrowNarrowUp /></div><Icon className="service-icon" />
                <h3>{service.title}</h3><p>{service.excerpt || service.description || meta.description}</p><span className="service-card-link">Discover service <HiArrowRight /></span>
              </Link>
            })}
          </div>
        </div></section>

        <section className="statement-section"><div className="container statement-grid">
          <div className="statement-mark">“</div><div><div className="kicker light-kicker"><span></span> The SuccessTunnel difference</div><h2>Big decisions deserve a better view.</h2></div>
          <p>We turn scattered questions into a clear, joined-up plan—then stay involved while that plan becomes progress.</p><Link href="/about" className="statement-link">Meet the people behind it <HiArrowNarrowUp /></Link>
        </div></section>

        <section className="approach-section"><div className="container">
          <div className="section-intro"><div className="kicker"><span></span> How we work</div><h2>Simple by design.<br /><em>Personal by nature.</em></h2></div>
          <div className="approach-list">{approach.map(([number, title, description]) => <div className="approach-item" key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p><HiCheck /></div>)}</div>
        </div></section>

        <section className="insight-callout"><div className="container insight-callout-inner"><div className="insight-icon"><HiPlay /></div><div><span>LEARN WITH SUCCESS TUNNEL</span><h2>Useful knowledge, without the noise.</h2></div><Link href="/education" className="btn btn-secondary">Explore learning <HiArrowRight /></Link></div></section>

        <section className="contact-section" id="contact"><div className="container contact-new-grid">
          <div className="contact-new-copy"><div className="kicker"><span></span> A good place to start</div><h2>Tell us what<br />you’re <em>building.</em></h2><p>There is no pressure and no complicated process. Share a little context, and we’ll guide you to the right person and the right next step.</p><a className="contact-phone" href={`tel:${toTelHref(settings.contactPhone1)}`}>{settings.contactPhone1}<HiArrowNarrowUp /></a><p className="contact-note">Monday–Saturday · We usually reply within one working day.</p></div>
          <div className="new-form-wrap"><EnquiryForm page="Homepage" title="Start the conversation" subtitle="A few details are enough. We’ll take it from there." buttonLabel="Send my enquiry" /></div>
        </div></section>
      </main>
      <EducationVideoPromo video={featuredEducationContent} />
      <Footer />
    </div>
  )
>>>>>>> Stashed changes
}

export async function getStaticProps() {
  try {
    const services = await prisma.service.findMany({ take: 6 })
<<<<<<< Updated upstream
    return { props: { services: JSON.parse(JSON.stringify(services)) }, revalidate: 60 }
  } catch {
    return { props: { services: sampleServices }, revalidate: 60 }
  }
=======
    const featuredEducationContent = await prisma.educationContent.findFirst({ where: { isPublished: true, showOnHomePopup: true }, orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }] })
    return { props: { services: JSON.parse(JSON.stringify(services)), featuredEducationContent: featuredEducationContent ? JSON.parse(JSON.stringify(featuredEducationContent)) : null }, revalidate: 60 }
  } catch { return { props: { services: sampleServices, featuredEducationContent: null }, revalidate: 60 } }
>>>>>>> Stashed changes
}
