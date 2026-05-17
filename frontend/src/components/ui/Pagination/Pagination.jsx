import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  if (totalPages <= 1) return null;
  return (
    <nav className={`${styles.pagination} ${className}`} aria-label="Pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className={styles.button}>Prev</button>
      <span className={styles.info}>{currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className={styles.button}>Next</button>
    </nav>
  );
};
export default Pagination;
