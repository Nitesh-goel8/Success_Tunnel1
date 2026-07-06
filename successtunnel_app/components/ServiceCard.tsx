import React from 'react';
import Link from 'next/link';
import styles from './ServiceCard.module.css';

export default function ServiceCard({
  service,
  href,
}: {
  service: { title: string; slug: string; excerpt?: string; description?: string; icon?: any }
  href?: string
}) {
  const descriptionText = service.excerpt || service.description || '';
  const targetHref = href || `/services/${service.slug}`;
  
  const getIcon = (slug: string) => {
    switch (slug) {
      case 'consultancy': return '💼';
      case 'finance': return '📊';
      case 'education': return '🎓';
      case 'investment': return '📈';
      case 'real-estate': return '🏢';
      case 'rental-space': return '🔑';
      default: return '✨';
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.icon}>{getIcon(service.slug)}</div>
      <h3 className={styles.title}>{service.title}</h3>
      <p className={styles.desc}>{descriptionText}</p>
      <Link href={targetHref} className={styles.link}>
        Learn More →
      </Link>
    </div>
  );
}
