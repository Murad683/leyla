import { useNavigate } from 'react-router-dom';
import styles from './Services.module.css';
import Button from '../../../../components/ui/Button';
import * as Icons from '../../../../assets/icons';

const ServiceCard = ({ service, index = 0 }) => {
  const navigate = useNavigate();
  const IconComponent = Icons[service.icon] || Icons.StrategyIcon;
  const number = String(index + 1).padStart(2, '0');

  return (
    <div className={styles.row}>
      <span className={styles.rowNumber}>{number}</span>
      <div className={styles.rowMain}>
        <div className={styles.rowHeader}>
          <span className={styles.rowIcon}><IconComponent /></span>
          <h3 className={styles.title}>{service.title}</h3>
        </div>
        <p className={styles.description}>{service.description}</p>
        <ul className={styles.featureList}>
          {service.features.map((feature, i) => (
            <li key={i} className={styles.featureItem}>{feature}</li>
          ))}
        </ul>
      </div>
      <div className={styles.rowCta}>
        <Button variant="link" onClick={() => navigate(service.ctaHref)}>{service.ctaLabel} &rarr;</Button>
      </div>
    </div>
  );
};
export default ServiceCard;
