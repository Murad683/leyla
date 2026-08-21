import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHero } from '../../../../services/settingsService';
import styles from './Hero.module.css';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import Skeleton from '../../../../components/ui/Skeleton';
import { StrategyIcon, SeoIcon, DesignIcon, ContentIcon, ConsultIcon } from '../../../../assets/icons';

const pillars = [
  { icon: StrategyIcon, label: 'Brend Strategiyası' },
  { icon: DesignIcon, label: 'Sosial Media' },
  { icon: SeoIcon, label: 'SEO və Artım' },
  { icon: ContentIcon, label: 'Kopiraytinq' },
  { icon: ConsultIcon, label: 'Konsaltinq' },
];

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
          <Skeleton width="180px" height="28px" style={{ margin: '0 auto 1.5rem', borderRadius: '999px' }} />
          <Skeleton width="80%" height="56px" style={{ margin: '0 auto 0.75rem' }} />
          <Skeleton width="60%" height="56px" style={{ margin: '0 auto 1.75rem' }} />
          <Skeleton width="50%" height="24px" style={{ margin: '0 auto 0.5rem' }} />
          <Skeleton width="40%" height="24px" style={{ margin: '0 auto 2.5rem' }} />
          <Skeleton width="220px" height="52px" style={{ margin: '0 auto', borderRadius: '999px' }} />
        </div>
      </section>
    );
  }

  const badgeText = heroData?.subtitle || 'Layihələr üçün əlçatandır';
  const titleText = heroData?.title || 'Strateji Marketinq vasitəsilə Brendlərin böyüməsinə kömək edirəm';
  const descText = heroData?.description || 'Mən yaradıcı baxış və data analitikasını birləşdirərək, hədəf auditoriyanı sadiq müştərilərə çevirən yüksək effektivlikli reklam kampaniyaları yaradıram.';
  const ctaLabel = heroData?.ctaLabel || 'Kampaniyalarıma baxın';
  const ctaHref = heroData?.ctaHref || '/portfolio';

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.staggered}>
          <Badge className={styles.badge}>{badgeText}</Badge>
        </div>
        <h1 className={`${styles.title} ${styles.staggered}`} style={{ animationDelay: '60ms' }}>{titleText}</h1>
        <div className={styles.staggered} style={{ animationDelay: '140ms' }}>
          <p className={styles.subtitle}>{descText}</p>
        </div>
        <div className={`${styles.ctaGroup} ${styles.staggered}`} style={{ animationDelay: '200ms' }}>
          <Button variant="primary" size="lg" onClick={() => navigate(ctaHref)}>{ctaLabel}</Button>
        </div>
        <div className={`${styles.trustRow} ${styles.staggered}`} style={{ animationDelay: '260ms' }}>
          <div className={styles.stat}><span className={styles.statNumber}>100+</span><span className={styles.statLabel}>Uğurlu Kampaniya</span></div>
          <div className={styles.divider}></div>
          <div className={styles.stat}><span className={styles.statNumber}>8</span><span className={styles.statLabel}>İllik Təcrübə</span></div>
          <div className={styles.divider}></div>
          <div className={styles.stat}><span className={styles.statNumber}>1M+</span><span className={styles.statLabel}>Reklam Büdcəsi</span></div>
        </div>
        <div className={`${styles.pillarRow} ${styles.staggered}`} style={{ animationDelay: '320ms' }}>
          {pillars.map(({ icon: Icon, label }) => (
            <span key={label} className={styles.pillarChip}>
              <Icon />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Hero;
