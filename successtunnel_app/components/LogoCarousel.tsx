import React from 'react';
import styles from './LogoCarousel.module.css';
import { logos } from '../data/logos';

export const LogoCarousel: React.FC = () => {
  return (
    <div className={styles.carousel}>
      <div className={styles.track}>
        {logos.map((src, i) => (
          <img key={i} src={src} alt={`Partner ${i + 1}`} className={styles.logo} />
        ))}
      </div>
    </div>
  );
};

export default LogoCarousel;
