import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getServices } from '../../services/settingsService';
import styles from './Services.module.css';
import { services as servicesFallback } from '../../data/services';
import useSEO from '../../hooks/useSEO';
import Section from '../../components/ui/Section';
import SectionLabel from '../../components/ui/SectionLabel';
import RevealOnScroll from '../../components/ui/RevealOnScroll';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import * as Icons from '../../assets/icons';

const Services = () => {
  useSEO({
    title: 'Təlimlər | LeylaDigital',
    description: 'Sosial Media, Performans Marketinqi, SEO və Kopiraytinq daxil olmaqla praktik, nəticə yönümlü marketinq təlimləri.'
  });

  const { data: servicesList, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });

  if (isLoading) {
    return (
      <div className={styles.page}>
        <section className={styles.hero}>
          <Section spacing="xl">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Skeleton width="60%" height="48px" style={{ marginBottom: '1.5rem' }} />
              <Skeleton width="80%" height="24px" style={{ marginBottom: '0.5rem' }} />
              <Skeleton width="70%" height="24px" />
            </div>
          </Section>
        </section>
        <section className={styles.detailSection}>
          <Section spacing="lg">
            <div className={styles.detailGrid}>
              <div className={styles.detailContent}>
                <Skeleton width="120px" height="24px" style={{ marginBottom: '1rem' }} />
                <Skeleton width="250px" height="32px" style={{ marginBottom: '1.5rem' }} />
                <Skeleton width="100%" height="60px" style={{ marginBottom: '2rem' }} />
                <Skeleton width="60%" height="20px" style={{ marginBottom: '0.5rem' }} />
                <Skeleton width="50%" height="20px" style={{ marginBottom: '0.5rem' }} />
                <Skeleton width="70%" height="20px" />
              </div>
              <Skeleton width="100%" height="300px" style={{ borderRadius: 'var(--radius-3xl)' }} />
            </div>
          </Section>
        </section>
      </div>
    );
  }

  const services = servicesList || servicesFallback;
  const mainServices = services.slice(0, 4);

  const workflow = [
    { number: '01', title: 'Qeydiyyat', desc: 'Sizə uyğun təlimi seçin və formu doldurub yerinizi bron edin.' },
    { number: '02', title: 'Təlim', desc: 'Canlı və praktik dərslərlə addım-addım nəzəriyyəni tətbiqlə birləşdirin.' },
    { number: '03', title: 'Praktika', desc: 'Real layihə üzərində işləyərək öyrəndiklərinizi tətbiq edin.' },
    { number: '04', title: 'Nəticə', desc: 'Sertifikatınızı əldə edin və qazandığınız bacarıqları işə tətbiq edin.' }
  ];

  const faqs = [
    { q: "Təlimlər onlayn, yoxsa canlı keçirilir?", a: "Təlimlərin əksəriyyəti canlı (onlayn/oflayn) formatda keçirilir, dərs qeydləri iştirakçılarla paylaşılır ki, istənilən vaxt təkrar baxıla bilsin." },
    { q: "Təlim üçün əvvəlcədən təcrübə lazımdırmı?", a: "Xeyr. Hər təlimin proqramı sıfırdan başlayanlar üçün nəzərdə tutulub, tapşırıqlar isə mövcud səviyyənizə uyğun dərinləşdirilir." },
    { q: "Qiymət və qrup tarixləri haqqında necə məlumat ala bilərəm?", a: "Aşağıdakı formu doldurun — komandamız 24 saat ərzində sizinlə əlaqə saxlayıb aktual qiymət, tarix və qeydiyyat detallarını göndərəcək." }
  ];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <Section spacing="xl">
          <RevealOnScroll>
            <h1 className={styles.heroTitle}>Bacarıqlarınızı<br />inkişaf etdirən təlimlər</h1>
            <p className={styles.heroDesc}>
              Nəzəriyyəni praktika ilə birləşdirən, real layihələr üzərində işlədən və ölçülə bilən nəticə verən marketinq təlim proqramları.
            </p>
          </RevealOnScroll>
        </Section>
      </section>

      {/* Detailed Services */}
      {mainServices.map((service, idx) => (
        <section key={service.id || idx} className={styles.detailSection}>
          <Section spacing="lg">
            <div className={styles.detailGrid}>
              <RevealOnScroll className={styles.detailContent} delay={idx % 2 === 0 ? 0 : 200}>
                <SectionLabel overline={`Təlim ${String(idx + 1).padStart(2, '0')}`} heading={service.title} />
                <p className={styles.detailText}>{service.description}</p>
                <ul className={styles.featureList}>
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx} className={styles.featureItem}>
                      <span className={styles.checkIcon}><Icons.CheckIcon /></span> {feature}
                    </li>
                  ))}
                </ul>
              </RevealOnScroll>

              <RevealOnScroll className={styles.detailImage} delay={idx % 2 === 0 ? 200 : 0}>
                <span className={styles.detailNumber}>{String(idx + 1).padStart(2, '0')}</span>
              </RevealOnScroll>
            </div>
          </Section>
        </section>
      ))}

      {/* Workflow Section */}
      <Section bg="secondary" spacing="xl" className={styles.processSection}>
        <RevealOnScroll>
          <SectionLabel overline="Proses" heading="Qeydiyyatdan Sertifikata Qədər" align="center" />
        </RevealOnScroll>

        <div className={styles.processGrid}>
          {workflow.map((item, idx) => (
            <RevealOnScroll key={idx} delay={idx * 150} className={styles.processItem}>
              <span className={styles.processNumber}>{item.number}</span>
              <h4 className={styles.processTitle}>{item.title}</h4>
              <p className={styles.processDesc}>{item.desc}</p>
            </RevealOnScroll>
          ))}
        </div>
      </Section>

      {/* FAQ Section */}
      <Section spacing="xl">
        <RevealOnScroll>
          <SectionLabel overline="Tez-tez Verilən Suallar" heading="Bilməli olduğunuz hər şey" align="center" />
        </RevealOnScroll>

        <div className={styles.faqSection}>
          {faqs.map((faq, idx) => (
            <RevealOnScroll key={idx} delay={idx * 100} className={styles.faqItem}>
              <h4 className={styles.faqQuestion}>{faq.q}</h4>
              <p className={styles.faqAnswer}>{faq.a}</p>
            </RevealOnScroll>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section spacing="xl">
        <RevealOnScroll>
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Hansı təlim sizə uyğundur?</h2>
            <p className={styles.ctaText}>
              Səviyyənizi və hədəflərinizi bizimlə paylaşın — komandamız sizə ən uyğun proqramı və qrup tarixini tövsiyə etsin.
            </p>
            <Button as={Link} to="/contact" variant="primary" size="lg">Pulsuz məsləhət alın</Button>
          </div>
        </RevealOnScroll>
      </Section>
    </div>
  );
};

export default Services;
