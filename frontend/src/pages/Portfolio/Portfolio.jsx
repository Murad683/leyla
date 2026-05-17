import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import styles from './Portfolio.module.css';
import { getPortfolioItems } from '../../services/portfolioService';
import useSEO from '../../hooks/useSEO';
import Section from '../../components/ui/Section';
import RevealOnScroll from '../../components/ui/RevealOnScroll';
import PortfolioCard from './PortfolioCard';
import FilterBar from './FilterBar';
import Pagination from '../../components/ui/Pagination';
import Skeleton from '../../components/ui/Skeleton';

const Portfolio = () => {
  useSEO({ title: 'Portfolio | LeylaDigital', description: 'Ən son keys-stadilərimizi və rəqəmsal transformasiya layihələrimizi araşdırın.' });
  const [activeCategory, setActiveCategory] = useState('Hamısı');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['portfolio', 'list'],
    queryFn: () => getPortfolioItems(),
    staleTime: 1000 * 60 * 5,
  });

  const portfolioProjects = data?.items || [];

  const categories = useMemo(() => {
    const cats = new Set(portfolioProjects.map(p => p.category));
    return ['Hamısı', ...Array.from(cats)];
  }, [portfolioProjects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'Hamısı') return portfolioProjects;
    return portfolioProjects.filter(p => p.category === activeCategory);
  }, [activeCategory, portfolioProjects]);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  const currentProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredProjects]);

  // Reset to page 1 on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Section bg="secondary" spacing="xl">
          <RevealOnScroll>
            <h1 className={styles.title}>Seçilmiş İşlər</h1>
            <p className={styles.subtitle}>Artımı təmin etmək və istifadəçiləri cəlb etmək üçün hazırlanmış rəqəmsal təcrübələr kolleksiyası.</p>
          </RevealOnScroll>
        </Section>
      </header>

      <Section spacing="lg">
        <FilterBar categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
        
        {isLoading && (
          <div className={styles.grid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: '300px' }}><Skeleton /></div>
            ))}
          </div>
        )}

        {isError && (
          <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <h3>Xəta baş verdi</h3>
            <p>{error.message}</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className={styles.grid}>
            {currentProjects.map((project, idx) => (
              <RevealOnScroll key={project.id} delay={idx * 100} className={project.featured && activeCategory === 'Hamısı' && idx === 0 ? styles.featuredWrapper : ''}>
                <PortfolioCard project={project} isFeatured={project.featured && activeCategory === 'Hamısı' && idx === 0} />
              </RevealOnScroll>
            ))}
            {currentProjects.length === 0 && (
              <div className={styles.emptyState}>Bu kateqoriya üçün layihə tapılmadı.</div>
            )}
          </div>
        )}
        
        {!isLoading && totalPages > 1 && (
          <div style={{ marginTop: 'var(--space-16)' }}>
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
          </div>
        )}
      </Section>
    </div>
  );
};
export default Portfolio;
