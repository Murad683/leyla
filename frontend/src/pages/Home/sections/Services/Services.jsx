import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getServices } from '../../../../services/settingsService';
import styles from './Services.module.css';
import Section from '../../../../components/ui/Section';
import SectionLabel from '../../../../components/ui/SectionLabel';
import RevealOnScroll from '../../../../components/ui/RevealOnScroll';
import ServiceCard from './ServiceCard';
import Skeleton from '../../../../components/ui/Skeleton';
import { services as servicesFallback } from '../../../../data/services';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const { data: servicesList, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });

  const listWrapRef = useRef(null);
  const lineRef = useRef(null);
  const rowRefs = useRef([]);

  const services = servicesList || servicesFallback;

  useEffect(() => {
    if (isLoading || !listWrapRef.current) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: listWrapRef.current,
              start: 'top 75%',
              end: 'bottom 60%',
              scrub: 0.6,
            },
          }
        );
      }

      rowRefs.current.forEach((row) => {
        if (!row) return;
        ScrollTrigger.create({
          trigger: row,
          start: 'top 72%',
          end: 'bottom 40%',
          toggleClass: { targets: row, className: styles.active },
        });
      });
    }, listWrapRef);

    return () => ctx.revert();
  }, [isLoading, services]);

  if (isLoading) {
    return (
      <Section id="services" bg="secondary" spacing="xl">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Skeleton width="120px" height="24px" style={{ margin: '0 auto 1rem' }} />
          <Skeleton width="300px" height="40px" style={{ margin: '0 auto' }} />
        </div>
        <div className={styles.list}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.rowWrapper}>
              <Skeleton width="100%" height="120px" />
            </div>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section id="services" bg="secondary" spacing="xl">
      <RevealOnScroll>
        <SectionLabel
          overline="Təlimlər"
          heading="Bacarıq qazandıran, nəticə verən proqramlar"
          align="center"
        />
      </RevealOnScroll>
      <div className={styles.listWrap} ref={listWrapRef}>
        <div className={styles.progressTrack}>
          <div className={styles.progressLine} ref={lineRef} />
        </div>
        <div className={styles.list}>
          {services.map((service, index) => (
            <RevealOnScroll key={service.id || index} delay={index * 70} className={styles.rowWrapper}>
              <div className={styles.rowInner} ref={(el) => { rowRefs.current[index] = el; }}>
                <ServiceCard service={service} index={index} />
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </Section>
  );
};
export default Services;
