import React from 'react';
import styles from './Textarea.module.css';

const Textarea = React.forwardRef(({ className = '', hasError, ...props }, ref) => (
  <textarea ref={ref} className={`${styles.textarea} ${hasError ? styles.error : ''} ${className}`} {...props} />
));
Textarea.displayName = 'Textarea';
export default Textarea;
