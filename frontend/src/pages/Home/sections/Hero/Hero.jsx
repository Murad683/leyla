import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.leftCol}>
          <div className={styles.staggered}>
            <Badge className={styles.badge}>Layihələr üçün əlçatandır</Badge>
          </div>
          <div className={styles.staggered} style={{ animationDelay: '50ms' }}>
            <h1 className={styles.title}>Strateji Marketinq vasitəsilə Brendlərin böyüməsinə kömək edirəm</h1>
          </div>
          <div className={styles.staggered} style={{ animationDelay: '100ms' }}>
            <p className={styles.subtitle}>
              Mən yaradıcı baxış və data analitikasını birləşdirərək, hədəf auditoriyanı sadiq müştərilərə çevirən yüksək effektivlikli reklam kampaniyaları yaradıram.
            </p>
          </div>
          <div className={`${styles.ctaGroup} ${styles.staggered}`} style={{ animationDelay: '150ms' }}>
            <Button variant="primary" size="lg" onClick={() => navigate('/portfolio')}>Kampaniyalarıma baxın</Button>
          </div>
          <div className={`${styles.trustRow} ${styles.staggered}`} style={{ animationDelay: '200ms' }}>
            <div className={styles.stat}><span className={styles.statNumber}>100+</span><span className={styles.statLabel}>Uğurlu Kampaniya</span></div>
            <div className={styles.divider}></div>
            <div className={styles.stat}><span className={styles.statNumber}>8</span><span className={styles.statLabel}>İllik Təcrübə</span></div>
            <div className={styles.divider}></div>
            <div className={styles.stat}><span className={styles.statNumber}>1M+</span><span className={styles.statLabel}>Reklam Büdcəsi</span></div>
          </div>
        </div>
        <div className={styles.rightCol}>
          <div className={styles.visualContainer}>
             <img src="/hero_visual.png" alt="Digital Marketing" className={styles.heroImage} />
             <div className={styles.accentCard}>
               <span className={styles.accentText}>Son Kampaniya &rarr;<br/><strong>E-ticarət Satışları</strong></span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
