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
import * as Icons from '../../assets/icons';

const About = () => {
  useSEO({ 
    title: 'Haqqımızda | LeylaDigital', 
    description: 'LeylaDigital haqqında öyrənin - rəqəmsal strategiya, performans marketinqi və auditoriya analitikasına yönəlmiş yaradıcı reklam agentliyi.' 
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

  const storyText = aboutData?.story || "Reklam kampaniyalarının həm yaradıcı, həm də gəlir gətirən olmalı olduğu inancı ilə qurulan LeylaDigital, ixtisaslaşmış bir rəqəmsal marketinq agentliyinə çevrildi. Biz sadəcə reklam yerləşdirmirik; davamlı satış gətirən sistemlər yaradırıq. Hazırladığımız hər bir reklam mətni və dizayn etdiyimiz hər bir vizual ölçülə bilən biznes artımı və ROAS (reklam xərclərinin geri dönüşü) göstəricisinə yönəlmiş strategiya ilə idarə olunur. Yanaşmamız məlumatlara əsaslanır. Biz rəqəmsal dünyada sadəcə səs-küy yaratmaq yox, brendinizin real bazar payını artırmaq üçün çalışırıq.";
  const mainImage = getImageUrl(aboutData?.mainImage);
  const experienceYears = aboutData?.experienceYears || 8;

  const defaultValues = [
    {
      icon: "QualityIcon",
      title: "Nəticəyə Fokus",
      desc: "Biz bəyənmə sayı üçün deyil, satış sayı üçün işləyirik. Hər bir kampaniyanın konversiya gətirməsini təmin edirik."
    },
    {
      icon: "SeoIcon",
      title: "Data Analitikası",
      desc: "Qərarlarimizi ehtimallar üzərində deyil, dəqiq bazar və istifadəçi davranış məlumatları üzərində qururuq."
    },
    {
      icon: "InnovationIcon",
      title: "Sürətli Adaptasiya",
      desc: "Dəyişən bazar trendlərinə və alqoritmlərə anında uyğunlaşaraq kampaniyalarınızı həmişə aktual saxlayırıq."
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
              <h1 className={styles.heroTitle}>Məqsədli Reklam Kampaniyalarının Memarı</h1>
              <p className={styles.heroLead}>
                LeylaDigital, perspektivli brendlərin yüksək performanslı reklam strategiyaları və data analitikası vasitəsilə böyüməsinə kömək edən butik marketinq agentliyidir.
              </p>
            </div>
          </RevealOnScroll>
        </Section>
      </section>

      {/* Story Section */}
      <Section spacing="xl">
        <div className={styles.storyGrid}>
          <RevealOnScroll className={styles.storyImage}>
            {mainImage ? (
              <LazyImage src={mainImage} alt="Bizim yaradıcı agentliyimiz" aspectRatio="4/3" />
            ) : (
              <div className={styles.storyGraphic}>
                <span className={styles.storyStat}>{experienceYears}+</span>
                <span className={styles.storyStatLabel}>İllik Təcrübə</span>
              </div>
            )}
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
          <SectionLabel overline="Fəlsəfəmiz" heading="Bizi İdarə Edən Əsas Dəyərlər" align="center" />
        </RevealOnScroll>
        
        <div className={styles.valuesGrid}>
          {values.map((value, idx) => {
            const ValueIcon = Icons[value.icon] || Icons.QualityIcon;
            return (
              <RevealOnScroll key={idx} delay={idx * 100}>
                <div className={styles.valueCard}>
                  <span className={styles.valueIcon}><ValueIcon /></span>
                  <h4 className={styles.valueTitle}>{value.title}</h4>
                  <p className={styles.valueDesc}>{value.desc}</p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </Section>

      {/* Expertise & Stats */}
      <Section spacing="xl" className={styles.expertiseSection}>
        <div className={styles.expertiseGrid}>
          <RevealOnScroll>
            <SectionLabel overline="Ekspertiza" heading="Marketinq Sənəti" />
            <div className={styles.skillsList}>
              {["Performans Reklamları", "SMM Strategiyası", "Kopiraytinq", "SEO və Growth", "Data Analitika", "Brendinq"].map((skill, idx) => (
                <Badge key={idx}>{skill}</Badge>
              ))}
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll delay={300} className={styles.statsWrapper}>
            <div className={styles.statsGrid}>
              {[
                { label: "Uğurlu Kampaniya", value: "100+" },
                { label: "Müştəri Məmnuniyyəti", value: "99%" },
                { label: "İllik Təcrübə", value: `${experienceYears}+` },
                { label: "İdarə Olunan Büdcə", value: "1M+" }
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
            <h2 className={styles.ctaTitle}>Rəqəmsal varlığınızı dəyişdirməyə hazırsınız?</h2>
            <p className={styles.ctaDesc}>
              İstər konkret bir layihəniz olsun, istərsə də sadəcə imkanları araşdırmaq istəyin, gəlin söhbətə başlayaq.
            </p>
            <Button as={Link} to="/contact" variant="primary" size="lg">
              Əlaqə Saxlayın
            </Button>
          </div>
        </RevealOnScroll>
      </Section>
    </div>
  );
};

export default About;

