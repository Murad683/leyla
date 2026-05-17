import React from 'react';
import { Link } from 'react-router-dom';
import styles from './About.module.css';
import useSEO from '../../hooks/useSEO';
import Section from '../../components/ui/Section';
import RevealOnScroll from '../../components/ui/RevealOnScroll';
import SectionLabel from '../../components/ui/SectionLabel';
import Button from '../../components/ui/Button';
import LazyImage from '../../components/ui/LazyImage';

// Path to the generated image in public folder
const STORY_IMAGE = "/about_hero_bg.png";

const About = () => {
  useSEO({ 
    title: 'Haqqımızda | LeylaDigital', 
    description: 'LeylaDigital haqqında öyrənin - rəqəmsal strategiya, performans marketinqi və auditoriya analitikasına yönəlmiş yaradıcı reklam agentliyi.' 
  });

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
            <LazyImage 
              src={STORY_IMAGE} 
              alt="Bizim yaradıcı agentliyimiz" 
              aspectRatio="4/3"
            />
          </RevealOnScroll>
          <RevealOnScroll delay={200} className={styles.storyText}>
            <SectionLabel overline="Hekayəmiz" heading="Vizyondan Reallığa" />
            <p>
              Reklam kampaniyalarının həm yaradıcı, həm də gəlir gətirən olmalı olduğu inancı ilə qurulan LeylaDigital, ixtisaslaşmış bir rəqəmsal marketinq agentliyinə çevrildi.
            </p>
            <p>
              Biz sadəcə reklam yerləşdirmirik; davamlı satış gətirən sistemlər yaradırıq. Hazırladığımız hər bir reklam mətni və dizayn etdiyimiz hər bir vizual ölçülə bilən biznes artımı və ROAS (reklam xərclərinin geri dönüşü) göstəricisinə yönəlmiş strategiya ilə idarə olunur.
            </p>
            <p>
              Yanaşmamız məlumatlara əsaslanır. Biz rəqəmsal dünyada sadəcə səs-küy yaratmaq yox, brendinizin real bazar payını artırmaq üçün çalışırıq.
            </p>
          </RevealOnScroll>
        </div>
      </Section>

      {/* Values Section */}
      <Section bg="secondary" spacing="xl">
        <RevealOnScroll>
          <SectionLabel overline="Fəlsəfəmiz" heading="Bizi İdarə Edən Əsas Dəyərlər" align="center" />
        </RevealOnScroll>
        
        <div className={styles.valuesGrid}>
          {[
            {
              icon: "🎯",
              title: "Nəticəyə Fokus",
              desc: "Biz bəyənmə sayı üçün deyil, satış sayı üçün işləyirik. Hər bir kampaniyanın konversiya gətirməsini təmin edirik."
            },
            {
              icon: "📊",
              title: "Data Analitikası",
              desc: "Qərarlarımızı ehtimallar üzərində deyil, dəqiq bazar və istifadəçi davranış məlumatları üzərində qururuq."
            },
            {
              icon: "🚀",
              title: "Sürətli Adaptasiya",
              desc: "Dəyişən bazar trendlərinə və alqoritmlərə anında uyğunlaşaraq kampaniyalarınızı həmişə aktual saxlayırıq."
            }
          ].map((value, idx) => (
            <RevealOnScroll key={idx} delay={idx * 100}>
              <div className={styles.valueCard}>
                <span className={styles.valueIcon}>{value.icon}</span>
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
            <SectionLabel overline="Ekspertiza" heading="Marketinq Sənəti" />
            <div className={styles.skills}>
              {[
                { name: "Performans Reklamları", level: 98 },
                { name: "SMM Strategiyası", level: 92 },
                { name: "Kopiraytinq", level: 90 },
                { name: "SEO və Growth", level: 88 }
              ].map((skill, idx) => (
                <div key={idx} className={styles.skillItem}>
                  <div className={styles.skillLabel}>
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className={styles.skillBar}>
                    <div className={styles.skillProgress} style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll delay={300} className={styles.statsWrapper}>
            <div className={styles.statsGrid}>
              {[
                { label: "Uğurlu Kampaniya", value: "100+" },
                { label: "Müştəri Məmnuniyyəti", value: "99%" },
                { label: "İllik Təcrübə", value: "8+" },
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
