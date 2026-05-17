import React from 'react';
import useInView from '../../../hooks/useInView';
import styles from './RevealOnScroll.module.css';

const RevealOnScroll = ({ children, delay = 0, className = '' }) => {
  const [ref, isInView] = useInView();
  const style = isInView ? { transitionDelay: `${delay}ms` } : {};
  return (
    <div ref={ref} className={`${styles.reveal} ${isInView ? styles.visible : ''} ${className}`} style={style}>
      {children}
    </div>
  );
};
export default RevealOnScroll;
