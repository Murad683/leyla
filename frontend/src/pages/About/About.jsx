import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAbout } from '../../services/settingsService';
import { getImageUrl } from '../../utils/imageUrl';
import styles from './About.module.css';
import useSEO from '../../hooks/useSEO';
import Section from '../../components/ui/Section';
import RevealOnScroll from '../../components/ui/RevealOnScroll';
import SectionLabel from '../../components/ui/SectionLabel';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LazyImage from '../../components/ui/LazyImage';
import Skeleton from '../../components/ui/Skeleton';

const About = () => {
  useSEO({
    title: 'Haqqımızda | LeylaDigital',
    description: 'LeylaDigital Akademiya haqqında öyrənin — praktik marketinq təlimləri və mentorluqla bacarıq qazandıran təlim proqramı.'
  });

  const { data: aboutData, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: getAbout,
  });

  if (isLoading) {
    return (
      <div className={styles.page}>
        <section className={styles.hero}>
          <Section spacing="xl">
            <div className={styles.heroContent} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Skeleton width="60%" height="48px" style={{ marginBottom: '1.5rem' }} />
              <Skeleton width="80%" height="24px" style={{ marginBottom: '0.5rem' }} />
              <Skeleton width="70%" height="24px" />
            </div>
          </Section>
        </section>
        <Section spacing="xl">
          <div className={styles.storyGrid}>
            <Skeleton width="100%" height="400px" style={{ borderRadius: 'var(--radius-2xl)' }} />
            <div className={styles.storyText}>
              <Skeleton width="120px" height="24px" style={{ marginBottom: '1rem' }} />
              <Skeleton width="250px" height="32px" style={{ marginBottom: '2rem' }} />
              <Skeleton width="100%" height="20px" style={{ marginBottom: '0.5rem' }} />
              <Skeleton width="100%" height="20px" style={{ marginBottom: '0.5rem' }} />
              <Skeleton width="80%" height="20px" style={{ marginBottom: '2rem' }} />
            </div>
          </div>
        </Section>
      </div>
    );
  }

  const storyText = aboutData?.story || "Marketinq biliklərinin sadəcə nəzəriyyədə qalmaması lazım olduğu inancı ilə başlayan LeylaDigital Akademiya, praktik təlim proqramları hazırlayan bir mərkəzə çevrildi. Biz sadəcə mövzu izah etmirik; hər iştirakçının real layihə üzərində işləyərək öyrənməsini təmin edirik. Hazırladığımız hər bir təlim modulu, sənayedə qazanılmış real təcrübəyə əsaslanır və məzunlarımızın işə tətbiq edə biləcəyi konkret bacarıqlar üzərində qurulub. Yanaşmamız sadədir: kiçik qruplar, fərdi rəy və davamlı dəstək.";
  const mainImage = getImageUrl(aboutData?.mainImage);
  const experienceYears = aboutData?.experienceYears || 8;

  const defaultValues = [
    {
      icon: "QualityIcon",
      title: "Praktik Fokus",
      desc: "Hər mövzu real tapşırıq və nümunə layihə ilə möhkəmləndirilir — sadəcə nəzəriyyə ilə kifayətlənmirik."
    },
    {
      icon: "SeoIcon",
      title: "Sənayeyə Uyğun Kurikulum",
      desc: "Təlim proqramları real bazar tələblərinə və güncəl alqoritmlərə uyğun daim yenilənir."
    },
    {
      icon: "InnovationIcon",
      title: "Fərdi İnkişaf",
      desc: "Kiçik qrup ölçüləri sayəsində hər iştirakçının irəliləyişini yaxından izləyirik."
    }
  ];

  const values = aboutData?.values?.map(v => ({
    icon: v.icon,
    title: v.title,
    desc: v.description
  })) || defaultValues;

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <Section spacing="xl">
          <RevealOnScroll>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>Praktik bacarıqların memarı</h1>
              <p className={styles.heroLead}>
                LeylaDigital Akademiya, marketinq öyrənmək istəyənlərə praktik təlim proqramları və fərdi mentorluqla real bacarıq qazandıran bir təlim mərkəzidir.
              </p>
            </div>
          </RevealOnScroll>
        </Section>
      </section>

      {/* Story Section */}
      <Section spacing="xl">
        <div className={styles.storyGrid}>
          <RevealOnScroll className={styles.storyMeta}>
            {mainImage && (
              <div className={styles.storyImage}>
                <LazyImage src={mainImage} alt="LeylaDigital Akademiya" aspectRatio="4/3" />
              </div>
            )}
            <span className={styles.storyStat}>{experienceYears}+</span>
            <span className={styles.storyStatLabel}>İllik Təcrübə</span>
          </RevealOnScroll>
          <RevealOnScroll delay={200} className={styles.storyText}>
            <SectionLabel overline="Hekayəmiz" heading="Vizyondan Reallığa" />
            <div className={styles.storyParagraphs}>
              {storyText.split('\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </Section>

      {/* Values Section */}
      <Section bg="secondary" spacing="xl">
        <RevealOnScroll>
          <SectionLabel overline="Fəlsəfəmiz" heading="Bizi İdarə Edən Əsas Dəyərlər" align="left" />
        </RevealOnScroll>

        <div className={styles.valuesGrid}>
          {values.map((value, idx) => (
            <RevealOnScroll key={idx} delay={idx * 100}>
              <div className={styles.valueCard}>
                <span className={styles.valueIndex}>{String(idx + 1).padStart(2, '0')}</span>
                <h4 className={styles.valueTitle}>{value.title}</h4>
                <p className={styles.valueDesc}>{value.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </Section>

      {/* Expertise & Stats */}
      <Section spacing="xl" className={styles.expertiseSection}>
        <div className={styles.expertiseGrid}>
          <RevealOnScroll>
            <SectionLabel overline="Ekspertiza" heading="Öyrədilən Sahələr" />
            <div className={styles.skillsList}>
              {["Performans Reklamları", "SMM Strategiyası", "Kopiraytinq", "SEO və Growth", "Data Analitika", "Brendinq"].map((skill, idx) => (
                <Badge key={idx}>{skill}</Badge>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={300} className={styles.statsWrapper}>
            <div className={styles.statsGrid}>
              {[
                { label: "Məzun", value: "500+" },
                { label: "Məmnuniyyət", value: "99%" },
                { label: "İllik Təcrübə", value: `${experienceYears}+` },
                { label: "Təlim Proqramı", value: "10+" }
              ].map((stat, idx) => (
                <div key={idx} className={styles.statItem}>
                  <h4>{stat.value}</h4>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </Section>

      {/* CTA Section */}
      <Section spacing="xl">
        <RevealOnScroll>
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Bacarıqlarınızı inkişaf etdirməyə hazırsınız?</h2>
            <p className={styles.ctaDesc}>
              İstər sıfırdan başlayın, istərsə də mövcud biliklərinizi dərinləşdirin — sizə uyğun təlimi birlikdə tapaq.
            </p>
            <Button as={Link} to="/services" variant="primary" size="lg">
              Təlimlərə Bax
            </Button>
          </div>
        </RevealOnScroll>
      </Section>
    </div>
  );
};

export default About;

