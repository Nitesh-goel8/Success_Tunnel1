import React from 'react';
import Link from 'next/link';
import styles from './Hero.module.css';

interface ButtonProps {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

interface HeroProps {
  headline: string;
  subHeadline?: string;
  buttons: ButtonProps[];
  backgroundImage?: string;
}

export const Hero: React.FC<HeroProps> = ({ headline, subHeadline, buttons, backgroundImage }) => {
  return (
    <section className={styles.hero} style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.headline}>{headline}</h1>
        {subHeadline && <p className={styles.sub}>{subHeadline}</p>}
        <div className={styles.actions}>
          {buttons.map((btn, i) => (
            <Link key={i} href={btn.href} className={btn.variant === 'secondary' ? styles.btnSecondary : styles.btnPrimary}>
              {btn.text}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
