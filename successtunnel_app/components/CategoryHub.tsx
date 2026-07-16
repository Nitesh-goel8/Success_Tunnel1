import Link from 'next/link'
import GuidedEnquiry from './GuidedEnquiry'

type CardItem = {
  title: string
  slug?: string
  excerpt: string
  icon?: string
  href?: string
}

type StepItem = {
  number: string
  title: string
  text: string
}

type FaqItem = {
  question: string
  answer: string
}

export default function CategoryHub({
  eyebrow,
  title,
  description,
  stats,
  cards,
  steps,
  faqs,
  ctaTitle,
  ctaDescription,
  formPage,
  formTitle,
  serviceOptions,
}: {
  eyebrow: string
  title: string
  description: string
  stats: { label: string; value: string }[]
  cards: CardItem[]
  steps: StepItem[]
  faqs: FaqItem[]
  ctaTitle: string
  ctaDescription: string
  formPage: string
  formTitle: string
  serviceOptions?: string[]
}) {
  return (
    <div className="section-surface" style={{ marginTop: 0 }}>
      <div className="section-heading">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="hero-board-grid" style={{ marginBottom: 28 }}>
        {stats.map(item => (
          <div key={item.label} className="mini-card">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="services-grid">
        {cards.map(card => {
          const iconText = card.icon || card.title.slice(0, 2).toUpperCase()
          const href = card.href || '#contact-form'
          return (
            <Link key={card.title} href={href} className="service-card">
              <div className="service-card-icon">{iconText}</div>
              <div className="service-card-kicker">Service line</div>
              <h3>{card.title}</h3>
              <p>{card.excerpt}</p>
              <span className="service-card-cta">Learn more &rarr;</span>
            </Link>
          )
        })}
      </div>

      <div style={{ height: 24 }} />

      <div className="section-heading" style={{ marginBottom: 28 }}>
        <span className="eyebrow">How it works</span>
        <h2>Our approach for this category.</h2>
        <p>Simple, consistent and designed to keep the process easy to trust.</p>
      </div>

      <div className="timeline-grid">
        {steps.map(step => (
          <div key={step.number} className="step-card">
            <div className="step-pill">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>

      <div style={{ height: 24 }} />

      <div className="section-heading" style={{ marginBottom: 28 }}>
        <span className="eyebrow">FAQ</span>
        <h2>Questions we hear often.</h2>
      </div>

      <div className="faq-list">
        {faqs.map(item => (
          <details key={item.question} className="faq-item">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>

      <div style={{ height: 28 }} />

      <div className="callout-banner">
        <h2>{ctaTitle}</h2>
        <p>{ctaDescription}</p>
      </div>

      <div id="contact-form" style={{ marginTop: 24 }}>
        <GuidedEnquiry
          page={formPage}
          title={formTitle}
          subtitle="Share your details and we'll call you back with the right next step."
          serviceOptions={serviceOptions}
        />
      </div>
    </div>
  )
}
