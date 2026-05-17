import React from 'react';
import styles from './Avatar.module.css';

const Avatar = ({ src, alt, size = 'md', className = '' }) => (
  <div className={`${styles.avatar} ${styles[size]} ${className}`}>
    {src ? <img src={src} alt={alt || ''} /> : <span className={styles.fallback}>{alt ? alt[0] : ''}</span>}
  </div>
);
export default Avatar;
