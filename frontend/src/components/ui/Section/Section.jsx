import React from 'react';
import styles from './Section.module.css';

/**
 * Section wrapper
 * @param {Object} props
 * @param {'primary'|'secondary'|'tertiary'|'white'} [props.bg='primary']
 * @param {'sm'|'md'|'lg'|'xl'} [props.spacing='lg']
 */
const Section = ({ id, bg = 'primary', spacing = 'lg', children, className = '' }) => (
  <section id={id} className={`${styles.section} ${styles[`bg-${bg}`]} ${styles[`spacing-${spacing}`]} ${className}`}>
    <div className={styles.container}>
      {children}
    </div>
  </section>
);
export default Section;
