import React from 'react';
import styles from './ValueItem.module.css';
import * as Icons from '../../../../assets/icons';

const ValueItem = ({ value }) => {
  const IconComponent = Icons[value.icon] || Icons.StrategyIcon;
  return (
    <div className={styles.item}>
      <div className={styles.iconWrapper}><IconComponent /></div>
      <h5 className={styles.title}>{value.title}</h5>
      <p className={styles.description}>{value.description}</p>
    </div>
  );
};
export default ValueItem;
