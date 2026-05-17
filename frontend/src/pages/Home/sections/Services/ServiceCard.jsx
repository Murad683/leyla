import { useNavigate } from 'react-router-dom';
import styles from './Services.module.css';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Divider from '../../../../components/ui/Divider';
import * as Icons from '../../../../assets/icons';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const IconComponent = Icons[service.icon] || Icons.StrategyIcon;
  return (
    <Card variant="elevated" className={styles.serviceCard} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className={styles.iconArea}><IconComponent /></div>
      <h3 className={styles.title}>{service.title}</h3>
      <p className={styles.description}>{service.description}</p>
      <Divider className={styles.divider} />
      <ul className={styles.featureList}>
        {service.features.map((feature, i) => (
          <li key={i} className={styles.featureItem}>
            <Icons.CheckIcon /> <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 'auto', paddingTop: 'var(--space-6)' }}>
        <Button variant="link" onClick={() => navigate(service.ctaHref)}>{service.ctaLabel} &rarr;</Button>
      </div>
    </Card>
  );
};
export default ServiceCard;
