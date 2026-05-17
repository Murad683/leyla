import React from 'react';
import styles from './Badge.module.css';

/**
 * Badge / Tag component
 * @param {Object} props
 */
const Badge = ({ children, className = '' }) => (
  <span className={`${styles.badge} ${className}`}>{children}</span>
);
export default Badge;
