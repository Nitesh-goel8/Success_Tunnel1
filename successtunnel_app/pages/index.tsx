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
}

export async function getStaticProps() {
  try {
    const services = await prisma.service.findMany({ take: 6 })
    return { props: { services: JSON.parse(JSON.stringify(services)) }, revalidate: 60 }
  } catch {
    return { props: { services: sampleServices }, revalidate: 60 }
  }
}
