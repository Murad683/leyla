import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getHero } from '../../../../services/settingsService';
import styles from './Hero.module.css';
import Button from '../../../../components/ui/Button';
import Skeleton from '../../../../components/ui/Skeleton';

const stats = [
  { value: 500, suffix: '+', label: 'Məzun' },
  { value: 10, suffix: '+', label: 'Təlim Proqramı' },
  { value: 4.9, suffix: '/5', label: 'Orta Reytinq', decimals: 1 },
];

const Hero = () => {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const statRefs = useRef([]);

  const { data: heroData, isLoading } = useQuery({
    queryKey: ['hero'],
    queryFn: getHero,
  });

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion && videoRef.current) videoRef.current.pause();
  }, []);

  useEffect(() => {
    if (isLoading || !rootRef.current) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set('[data-hero-word]', { yPercent: 0 });
        gsap.set('[data-hero-anim]', { opacity: 1, y: 0 });
        statRefs.current.forEach((el, i) => { if (el) el.textContent = formatStat(stats[i]); });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('[data-hero-word]', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06 })
        .fromTo('[data-hero-anim]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, '-=0.4');

      statRefs.current.forEach((el, i) => {
        if (!el) return;
        const stat = stats[i];
        const counter = { val: 0 };
        tl.to(counter, {
          val: stat.value,
          duration: 1.1,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = formatStat(stat, counter.val); },
        }, '-=0.5');
      });
    }, rootRef);

    return () => ctx.revert();
  }, [isLoading]);

  if (isLoading) {
    return (
      <section className={styles.hero}>
        <div className={styles.container}>
          <Skeleton width="90%" height="90px" style={{ marginBottom: '0.75rem' }} />
          <Skeleton width="45%" height="24px" />
        </div>
      </section>
    );
  }

  const titleText = heroData?.title || 'Bacarıqlarınızı növbəti səviyyəyə aparan təlimlər';
  const descText = heroData?.description || 'Praktik, nəticə yönümlü təlim proqramları ilə marketinq bacarıqlarınızı inkişaf etdirin, real layihələr üzərində işləyin və karyeranızı irəli aparın.';
  const ctaLabel = heroData?.ctaLabel || 'Təlimlərə bax';
  const ctaHref = heroData?.ctaHref || '/services';
  const secondaryLabel = heroData?.secondaryBtnText || 'Pulsuz məsləhət al';
  const secondaryHref = heroData?.secondaryBtnHref || '/contact';
  const videoSrc = heroData?.videoUrl || '/hero-bg.mp4';
  const words = titleText.split(' ');

  return (
    <section className={styles.hero} ref={rootRef}>
      <video
        ref={videoRef}
        className={styles.bgVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={heroData?.backgroundImage || undefined}
        key={videoSrc}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.container}>
        <h1 className={styles.title}>
          {words.map((word, i) => (
            <span key={i}>
              <span className={styles.wordMask}>
                <span className={styles.word} data-hero-word>{word}</span>
              </span>
              {i < words.length - 1 ? ' ' : null}
            </span>
          ))}
        </h1>

        <div data-hero-anim className={styles.glassPanel}>
          <div className={styles.subtitleCol}>
            <p className={styles.subtitle}>{descText}</p>
            <div className={styles.ctaGroup}>
              <Button variant="primary" size="lg" className={styles.primaryOnDark} onClick={() => navigate(ctaHref)}>{ctaLabel}</Button>
              <Button variant="link" size="lg" className={styles.ghostLink} onClick={() => navigate(secondaryHref)}>{secondaryLabel}</Button>
            </div>
          </div>

          <div className={styles.statCol}>
            {stats.map((stat, i) => (
              <div className={styles.stat} key={stat.label}>
                <span className={styles.statNumber} ref={(el) => { statRefs.current[i] = el; }}>{formatStat(stat)}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

function formatStat(stat, val) {
  const n = val === undefined ? stat.value : val;
  const formatted = stat.decimals ? n.toFixed(stat.decimals) : Math.round(n).toLocaleString('az-AZ');
  return `${formatted}${stat.suffix}`;
}

export default Hero;
