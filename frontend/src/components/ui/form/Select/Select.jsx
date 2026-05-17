import React from 'react';
import styles from './Select.module.css';

const Select = React.forwardRef(({ options, className = '', hasError, ...props }, ref) => (
  <select ref={ref} className={`${styles.select} ${hasError ? styles.error : ''} ${className}`} {...props}>
    {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
  </select>
));
Select.displayName = 'Select';
export default Select;
