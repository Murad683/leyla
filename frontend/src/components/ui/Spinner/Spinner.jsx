import React from 'react';
import styles from './Spinner.module.css';

/**
 * Spinner component for loading states
 * @param {Object} props
 * @param {string} [props.className] - Additional classes
 */
const Spinner = ({ className = '' }) => (
  <div className={`${styles.spinner} ${className}`} role="status" aria-label="Loading">
    <span className={styles.visuallyHidden}>Loading...</span>
  </div>
);

export default Spinner;
