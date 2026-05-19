import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getServices } from '../../../../services/settingsService';
import styles from './Services.module.css';
import Section from '../../../../components/ui/Section';
import SectionLabel from '../../../../components/ui/SectionLabel';
import RevealOnScroll from '../../../../components/ui/RevealOnScroll';
import ServiceCard from './ServiceCard';
import { services as servicesFallback } from '../../../../data/services';

const Services = () => {
  const { data: servicesList } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });

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
      <div className={styles.grid}>
        {services.map((service, index) => (
          <RevealOnScroll key={service.id || index} delay={index * 80} className={styles.cardWrapper}>
            <ServiceCard service={service} />
          </RevealOnScroll>
        ))}
      </div>
    </Section>
  );
};
export default Services;
