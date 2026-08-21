import React from 'react';
import styles from './Badge.module.css';

/**
 * Badge / Tag component
 * @param {Object} props
 * @param {'outline'|'solid'} [props.variant='outline']
 */
const Badge = ({ children, variant = 'outline', className = '' }) => (
  <span className={`${styles.badge} ${styles[variant]} ${className}`}>{children}</span>
);
export default Badge;
