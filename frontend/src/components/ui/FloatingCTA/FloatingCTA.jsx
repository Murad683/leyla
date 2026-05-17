import { WhatsAppIcon } from '../../../assets/icons';
import styles from './FloatingCTA.module.css';

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
        <span className={styles.icon}><WhatsAppIcon /></span>
        <span className={styles.tooltip}>WhatsApp ilə əlaqə</span>
      </a>
    </div>
  );
};

export default FloatingCTA;
