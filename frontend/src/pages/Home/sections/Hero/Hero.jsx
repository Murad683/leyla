import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHero } from '../../../../services/settingsService';
import { getImageUrl } from '../../../../utils/imageUrl';
import styles from './Hero.module.css';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import Skeleton from '../../../../components/ui/Skeleton';

const Hero = () => {
  const navigate = useNavigate();

  const { data: heroData, isLoading } = useQuery({
    queryKey: ['hero'],
    queryFn: getHero,
  });

  if (isLoading) {
    return (
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.leftCol}>
            <Skeleton width="150px" height="30px" className={styles.badge} style={{ marginBottom: '1rem' }} />
            <Skeleton width="100%" height="48px" className={styles.title} style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="80%" height="48px" className={styles.title} style={{ marginBottom: '1.5rem' }} />
            <Skeleton width="90%" height="24px" className={styles.subtitle} style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="70%" height="24px" className={styles.subtitle} style={{ marginBottom: '2rem' }} />
            <div className={styles.ctaGroup}>
              <Skeleton width="200px" height="50px" />
            </div>
            <div className={styles.trustRow} style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
              <div>
                <Skeleton width="80px" height="40px" style={{ marginBottom: '0.5rem' }} />
                <Skeleton width="100px" height="20px" />
              </div>
              <div className={styles.divider}></div>
              <div>
                <Skeleton width="80px" height="40px" style={{ marginBottom: '0.5rem' }} />
                <Skeleton width="100px" height="20px" />
              </div>
              <div className={styles.divider}></div>
              <div>
                <Skeleton width="80px" height="40px" style={{ marginBottom: '0.5rem' }} />
                <Skeleton width="100px" height="20px" />
              </div>
            </div>
          </div>
          <div className={styles.rightCol}>
            <Skeleton width="100%" height="500px" style={{ borderRadius: 'var(--radius-3xl)' }} />
          </div>
        </div>
      </section>
    );
  }

  const badgeText = heroData?.subtitle || 'Layihələr üçün əlçatandır';
  const titleText = heroData?.title || 'Strateji Marketinq vasitəsilə Brendlərin böyüməsinə kömək edirəm';
  const descText = heroData?.description || 'Mən yaradıcı baxış və data analitikasını birləşdirərək, hədəf auditoriyanı sadiq müştərilərə çevirən yüksək effektivlikli reklam kampaniyaları yaradıram.';
  const ctaLabel = heroData?.ctaLabel || 'Kampaniyalarıma baxın';
  const ctaHref = heroData?.ctaHref || '/portfolio';
  const imageUrl = getImageUrl(heroData?.backgroundImage) || '/hero_visual.png';

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.leftCol}>
          <div className={styles.staggered}>
            <Badge className={styles.badge}>{badgeText}</Badge>
          </div>
          <div className={styles.staggered} style={{ animationDelay: '50ms' }}>
            <h1 className={styles.title}>{titleText}</h1>
          </div>
          <div className={styles.staggered} style={{ animationDelay: '100ms' }}>
            <p className={styles.subtitle}>{descText}</p>
          </div>
          <div className={`${styles.ctaGroup} ${styles.staggered}`} style={{ animationDelay: '150ms' }}>
            <Button variant="primary" size="lg" onClick={() => navigate(ctaHref)}>{ctaLabel}</Button>
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
             <img src={imageUrl} alt="Digital Marketing" className={styles.heroImage} />
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
