import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Blog.module.css';

const FaqAccordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={styles.faqList}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className={styles.faqItem}>
            <button
              className={styles.faqQuestion}
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
              <span className={`${styles.faqChevron} ${isOpen ? styles.faqChevronOpen : ''}`}>⌄</span>
            </button>
            {isOpen && (
              <div className={styles.faqAnswer}>
                {item.a}
                {item.link && <> <Link to={item.link.href} className={styles.faqLink}>{item.link.label}</Link></>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default FaqAccordion;
