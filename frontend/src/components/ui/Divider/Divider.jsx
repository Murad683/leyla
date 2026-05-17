import React from 'react';
import styles from './Divider.module.css';

const Divider = ({ className = '' }) => <hr className={`${styles.divider} ${className}`} />;
export default Divider;
