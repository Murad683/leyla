import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Portfolio.module.css';

const PortfolioCard = ({ project, index = 0, isFeatured }) => {
  const topResult = project.results?.[0];
  return (
    <Link to={`/portfolio/${project.slug}`} className={`${styles.row} ${isFeatured ? styles.featuredRow : ''}`}>
      <span className={styles.rowNumber}>{String(index + 1).padStart(2, '0')}</span>
      <div className={styles.rowMain}>
        <span className={styles.rowKicker}>{project.category}</span>
        <h3 className={styles.rowTitle}>{project.title}</h3>
        <p className={styles.rowSummary}>{project.summary}</p>
        <div className={styles.rowMeta}>
          <span>{project.client}</span>
          <span className={styles.dot}>•</span>
          <span>{project.year}</span>
        </div>
      </div>
      {topResult && (
        <div className={styles.rowResult}>
          <span className={styles.resultValue}>{topResult.metric}</span>
          <span className={styles.resultLabel}>{topResult.value}</span>
        </div>
      )}
    </Link>
  );
};
export default PortfolioCard;
