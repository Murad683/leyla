import styles from './FloatingCTA.module.css';

const WhatsAppGlyph = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.06c-.24.68-1.4 1.32-1.94 1.4-.5.08-1.11.11-1.79-.11-.41-.13-.94-.31-1.62-.6-2.86-1.24-4.73-4.13-4.87-4.32-.14-.19-1.17-1.55-1.17-2.96 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35h.55c.18 0 .41-.07.64.49.24.57.81 1.97.88 2.11.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.49-.14.14-.28.28-.12.56.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.16-.19.7-.81.88-1.09.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.47.21.53.33.07.12.07.68-.17 1.36z"/>
  </svg>
);

const FloatingCTA = () => {
  return (
    <div className={styles.container}>
      <a
        href="https://wa.me/994508314808"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsapp}
        aria-label="Contact on WhatsApp"
      >
        <span className={styles.icon}><WhatsAppGlyph /></span>
        <span className={styles.tooltip}>WhatsApp ilə əlaqə</span>
      </a>
    </div>
  );
};

export default FloatingCTA;
