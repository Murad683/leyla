import { useNavigate } from 'react-router-dom';
import styles from './Services.module.css';
import Button from '../../../../components/ui/Button';

const ServiceCard = ({ service, index = 0 }) => {
  const navigate = useNavigate();
  const number = String(index + 1).padStart(2, '0');

  return (
    <div className={styles.row}>
      <span className={styles.rowNumber}>{number}</span>
      <div className={styles.rowMain}>
        <h3 className={styles.title}>{service.title}</h3>
        <p className={styles.description}>{service.description}</p>
        <div className={styles.featureList}>
          {service.features.map((feature, i) => (
            <span key={i} className={styles.featureItem}>
              {feature}{i < service.features.length - 1 && <span className={styles.featureDot} />}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.rowCta}>
        <Button variant="link" onClick={() => navigate(service.ctaHref)}>{service.ctaLabel} &rarr;</Button>
      </div>
    </div>
  );
};
export default ServiceCard;
