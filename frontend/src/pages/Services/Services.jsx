import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Services.module.css';
import { services } from '../../data/services';
import useSEO from '../../hooks/useSEO';
import Section from '../../components/ui/Section';
import SectionLabel from '../../components/ui/SectionLabel';
import RevealOnScroll from '../../components/ui/RevealOnScroll';
import Button from '../../components/ui/Button';

const Services = () => {
  useSEO({
    title: 'Xidmətlər | LeylaDigital',
    description: 'Brend Strategiyası, Performans Marketinqi, SMM və Reklam Optimizasiyası daxil olmaqla peşəkar marketinq xidmətləri.'
  });

  const mainServices = services.slice(0, 4);

  const workflow = [
    { number: '01', title: 'Audit', desc: 'Mövcud bazar vəziyyətinizin və rəqiblərin dərindən analizi.' },
    { number: '02', title: 'Strategiya', desc: 'Hədəf auditoriyanın müəyyən edilməsi və reklam kanallarının seçilməsi.' },
    { number: '03', title: 'Kampaniya', desc: 'Kreativlərin hazırlanması və reklam kampaniyalarının işə salınması.' },
    { number: '04', title: 'Optimizasiya', desc: 'Maksimum ROI üçün davamlı testlər və nəticələrin yaxşılaşdırılması.' }
  ];

  const faqs = [
    { q: "Reklam kampaniyasından nə vaxt nəticə gözləməliyəm?", a: "Performans reklamlarında ilk nəticələr adətən 48-72 saat ərzində görünür, lakin tam optimallaşdırma 2-4 həftə çəkir." },
    { q: "Aylıq reklam büdcəsi nə qədər olmalıdır?", a: "Büdcə biznes hədəflərinizə və rəqabətə görə dəyişir. Biz sizə optimal büdcə bölüşdürülməsi üçün məsləhət veririk." },
    { q: "Hesabatlılıq necə aparılır?", a: "Hər həftə və ya ay sonu bütün əsas göstəriciləri (ROAS, CPA, CTR) əks etdirən ətraflı analitik hesabatlar təqdim edirik." }
  ];

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <Section spacing="xl">
          <RevealOnScroll>
            <h1 className={styles.heroTitle}>Rəqəmsal Artım üçün Strateji Xidmətlər</h1>
            <p className={styles.heroDesc}>
              Biz yaradıcı baxışı texniki dəqiqliklə birləşdirərək, nişanlılığı artıran və ölçülə bilən biznes dəyəri verən rəqəmsal məhsullar qururuq.
            </p>
          </RevealOnScroll>
        </Section>
      </section>

      {/* Detailed Services */}
      {mainServices.map((service, idx) => (
        <section key={service.id} className={styles.detailSection}>
          <Section spacing="lg">
            <div className={styles.detailGrid}>
              <RevealOnScroll className={styles.detailContent} delay={idx % 2 === 0 ? 0 : 200}>
                <SectionLabel overline={`Xidmət ${idx + 1}`} heading={service.title} />
                <p className={styles.detailText}>{service.description}</p>
                <ul className={styles.featureList}>
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx} className={styles.featureItem}>
                      <span className={styles.checkIcon}>✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </RevealOnScroll>

              <RevealOnScroll className={styles.detailImage} delay={idx % 2 === 0 ? 200 : 0}>
                {/* Visual representation */}
                <div className={styles.largeIcon}>
                  {idx === 0 ? "📈" : idx === 1 ? "💻" : idx === 2 ? "🎨" : "⚡"}
                </div>
              </RevealOnScroll>
            </div>
          </Section>
        </section>
      ))}

      {/* Workflow Section */}
      <Section bg="secondary" spacing="xl" className={styles.processSection}>
        <RevealOnScroll>
          <SectionLabel overline="Proses" heading="İdeyaları Necə Həyata Keçiririk" align="center" />
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
          <div style={{ textAlign: 'center', background: 'var(--color-surface)', padding: 'var(--space-16)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-border)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-4)' }}>
              Xüsusi tələbiniz var?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)', maxWidth: '600px', marginInline: 'auto' }}>
              Biz həmçinin sizin xüsusi ehtiyaclarınıza uyğunlaşdırılmış fərdi konsaltinq və texniki dəstək paketləri təklif edirik.
            </p>
            <Button as={Link} to="/contact" variant="primary" size="lg">Məsləhət alın</Button>
          </div>
        </RevealOnScroll>
      </Section>
    </div>
  );
};

export default Services;
