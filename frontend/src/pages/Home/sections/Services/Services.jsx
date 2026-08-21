import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getServices } from '../../../../services/settingsService';
import styles from './Services.module.css';
import Section from '../../../../components/ui/Section';
import SectionLabel from '../../../../components/ui/SectionLabel';
import RevealOnScroll from '../../../../components/ui/RevealOnScroll';
import ServiceCard from './ServiceCard';
import Skeleton from '../../../../components/ui/Skeleton';
import { services as servicesFallback } from '../../../../data/services';

const Services = () => {
  const { data: servicesList, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });

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

  const services = servicesList || servicesFallback;

  return (
    <Section id="services" bg="secondary" spacing="xl">
      <RevealOnScroll>
        <SectionLabel 
          overline="Nə edirəm" 
          heading="Nəticə verən xidmətlər"
          align="center"
        />
      </RevealOnScroll>
      <div className={styles.list}>
        {services.map((service, index) => (
          <RevealOnScroll key={service.id || index} delay={index * 70} className={styles.rowWrapper}>
            <ServiceCard service={service} index={index} />
          </RevealOnScroll>
        ))}
      </div>
    </Section>
  );
};
export default Services;
