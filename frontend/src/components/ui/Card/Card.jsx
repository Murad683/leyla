import React from 'react';
import styles from './Card.module.css';

/**
 * Reusable Card component
 * @param {Object} props
 * @param {'default'|'elevated'|'bordered'} [props.variant='default']
 */
const Card = ({ variant = 'default', children, className = '', ...props }) => (
  <div className={`${styles.card} ${styles[variant]} ${className}`} {...props}>
    {children}
  </div>
);
export default Card;
