import React from 'react';
import styles from './Portfolio.module.css';

const FilterBar = ({ categories, activeCategory, onSelect }) => (
  <div className={styles.filterBar}>
    {categories.map(cat => (
      <button
        key={cat}
        className={`${styles.filterPill} ${cat === activeCategory ? styles.activePill : ''}`}
        onClick={() => onSelect(cat)}
      >
        {cat}
      </button>
    ))}
  </div>
);
export default FilterBar;
