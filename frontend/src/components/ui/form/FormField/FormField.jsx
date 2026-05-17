import React from 'react';
import styles from './FormField.module.css';

const FormField = ({ label, id, error, children, className = '' }) => (
  <div className={`${styles.field} ${className}`}>
    {label && <label htmlFor={id} className={styles.label}>{label}</label>}
    {children}
    {error && <span className={styles.error} role="alert">{error}</span>}
  </div>
);
export default FormField;
