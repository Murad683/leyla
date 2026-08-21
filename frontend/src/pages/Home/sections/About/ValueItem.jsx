import React from 'react';
import styles from './ValueItem.module.css';

const ValueItem = ({ value, index = 0 }) => (
  <div className={styles.item}>
    <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
    <h5 className={styles.title}>{value.title}</h5>
    <p className={styles.description}>{value.description}</p>
  </div>
);
export default ValueItem;
