import React from 'react';
import styles from './SectionLabel.module.css';

/**
 * SectionLabel component
 * @param {Object} props
 */
const SectionLabel = ({ overline, heading, align = 'left', className = '' }) => (
  <div className={`${styles.wrapper} ${styles[align]} ${className}`}>
    {overline && <span className={styles.overline}>{overline}</span>}
    {heading && <h2 className={styles.heading}>{heading}</h2>}
  </div>
);
export default SectionLabel;
