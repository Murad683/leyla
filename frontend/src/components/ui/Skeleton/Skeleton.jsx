import React from 'react';
import styles from './Skeleton.module.css';

const Skeleton = ({ width, height, variant = 'rectangular', className = '' }) => (
  <div className={`${styles.skeleton} ${styles[variant]} ${className}`} style={{ width, height }} />
);
export default Skeleton;
