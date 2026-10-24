import Link from 'next/link'
import GuidedEnquiry from './GuidedEnquiry'
import { HiArrowRight } from 'react-icons/hi'

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
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <div className="editorial-tag" style={{ marginBottom: '16px' }}>
          <span className="editorial-tag-dot" />
          {eyebrow}
        </div>
        <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 12px' }}>{title}</h2>
        <p style={{ maxWidth: 640, margin: '0 auto', color: 'var(--muted)', fontSize: '1.02rem', lineHeight: '1.65' }}>{description}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '44px' }}>
        {stats.map(item => (
          <div key={item.label} style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: '14px', padding: '22px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Sora, sans-serif' }}>{item.value}</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {cards.map(card => {
          const iconText = card.icon || card.title.slice(0, 2).toUpperCase()
          const href = card.href || '#contact-form'
          return (
            <div key={card.title} className="expertise-card" style={{ padding: '28px' }}>
              <div className="expertise-icon-wrapper" style={{ fontSize: '1rem', fontWeight: 800 }}>
                {iconText}
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{card.title}</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--muted)', margin: '0 0 18px' }}>{card.excerpt}</p>
              <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--line)' }}>
                <Link href={href} className="expertise-card-link">
                  Consult Practice Desk <HiArrowRight size={14} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ height: 48 }} />

      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="editorial-tag" style={{ marginBottom: '14px' }}>
          <span className="editorial-tag-dot" />
          Execution Methodology
        </div>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 800, margin: '8px 0 0' }}>Our Structured Approach</h2>
        <p style={{ maxWidth: 600, margin: '8px auto 0', color: 'var(--muted)', fontSize: '0.98rem' }}>Direct accountability and transparent procedural checkpoints.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {steps.map(step => (
          <div key={step.number} style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: '14px', padding: '24px 20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'Sora, sans-serif', marginBottom: '8px' }}>
              STEP {step.number}
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', margin: '0 0 8px' }}>
              {step.title}
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: '1.55', margin: 0 }}>
              {step.text}
            </p>
          </div>
        ))}
      </div>

      <div style={{ height: 48 }} />

      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="editorial-tag" style={{ marginBottom: '14px' }}>
            <span className="editorial-tag-dot" />
            Advisory FAQs
          </div>
          <h2 style={{ fontSize: '1.9rem', color: 'var(--primary)', fontWeight: 800, margin: 0 }}>Questions We Answer Often</h2>
        </div>

        <div className="faq-list">
          {faqs.map(item => (
            <details key={item.question} style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: '12px', padding: '16px 20px', marginBottom: '12px' }}>
              <summary style={{ fontWeight: 700, color: 'var(--primary)', cursor: 'pointer', outline: 'none' }}>
                {item.question}
              </summary>
              <p style={{ marginTop: '10px', color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6', margin: '10px 0 0' }}>
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>

      <div style={{ height: 40 }} />

      <div style={{ background: 'var(--primary)', color: '#ffffff', borderRadius: '18px', padding: '40px 36px', textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ color: '#ffffff', fontSize: '1.8rem', fontWeight: 800, margin: '0 0 10px' }}>{ctaTitle}</h2>
        <p style={{ color: '#cbd5e1', fontSize: '1rem', margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>{ctaDescription}</p>
      </div>

      <div id="contact-form" style={{ maxWidth: '720px', margin: '0 auto' }}>
        <GuidedEnquiry
          page={formPage}
          title={formTitle}
          subtitle="Share your requirement and our designated practice head will follow up directly."
          serviceOptions={serviceOptions}
        />
      </div>
    </div>
  )
}
