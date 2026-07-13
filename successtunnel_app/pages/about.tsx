import Link from 'next/link'
import { HiArrowRight, HiCheck, HiLightningBolt, HiPuzzle, HiSupport } from 'react-icons/hi'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const principles = [
  { icon: HiPuzzle, title: 'Connected, not complicated', text: 'Business decisions rarely live in one department. We make the connections visible.' },
  { icon: HiLightningBolt, title: 'Momentum over theatre', text: 'Useful next steps matter more than elaborate presentations or unnecessary process.' },
  { icon: HiSupport, title: 'A partner who stays close', text: 'We do not disappear after the first answer. Good outcomes need continuity.' },
]

const disciplines = ['Business & compliance', 'Finance & capital', 'Learning & capability', 'Investment decisions', 'Property & workspaces']

export default function About() {
  return (
    <div className="about-page">
      <Nav />
      <main>
        <section className="about-hero">
          <div className="container about-hero-grid">
            <div>
              <span className="eyebrow">Why SuccessTunnel exists</span>
              <h1>Progress should not feel <em>fragmented.</em></h1>
              <p>We are building a smarter kind of professional partner: one place where the decisions around business, money, people and space can finally work together.</p>
              <Link href="/contact" className="btn btn-primary">Start with your next question <HiArrowRight /></Link>
            </div>
            <div className="about-manifesto">
              <span>OUR AMBITION</span>
              <strong>To turn the everyday complexity of growth into a more confident way forward.</strong>
              <p>Not more advice. Better connection between the advice that matters.</p>
            </div>
          </div>
        </section>

        <section className="about-belief"><div className="container about-belief-grid">
          <div className="belief-number">01</div>
          <div><span className="eyebrow">The belief behind the work</span><h2>When the right people see the whole picture, better decisions follow.</h2></div>
          <p>Most clients come to us with a specific need. But behind it is usually a bigger move: starting, expanding, protecting, investing, learning, or finding the right place to work. We are designed to see that bigger move.</p>
        </div></section>

        <section className="about-disciplines"><div className="container">
          <div className="section-intro"><span className="eyebrow">One ecosystem</span><h2>Different disciplines.<br /><em>One direction.</em></h2></div>
          <div className="discipline-list">{disciplines.map((discipline, index) => <div key={discipline}><span>0{index + 1}</span><h3>{discipline}</h3><HiArrowRight /></div>)}</div>
        </div></section>

        <section className="about-principles"><div className="container">
          <div className="section-intro"><span className="eyebrow">What clients can expect</span><h2>A more human way<br />to get serious work <em>done.</em></h2></div>
          <div className="principles-grid">{principles.map(({ icon: Icon, title, text }) => <article key={title}><Icon /><h3>{title}</h3><p>{text}</p><span><HiCheck /> Built into every engagement</span></article>)}</div>
        </div></section>

        <section className="about-next"><div className="container about-next-inner"><div><span>YOUR NEXT CHAPTER CAN START SMALL</span><h2>Bring the question.<br />We’ll find the path.</h2></div><div><p>From a single conversation to an integrated long-term partnership, we meet you where you are.</p><Link href="/services" className="btn btn-secondary">Explore the ecosystem <HiArrowRight /></Link></div></div></section>
      </main>
      <Footer />
    </div>
  )
}
