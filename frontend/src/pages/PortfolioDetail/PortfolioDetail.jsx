import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styles from './PortfolioDetail.module.css';
import { getPortfolioItem, getPortfolioItems } from '../../services/portfolioService';
import useSEO from '../../hooks/useSEO';
import Section from '../../components/ui/Section';
import Badge from '../../components/ui/Badge';
import LazyImage from '../../components/ui/LazyImage';
import NotFound from '../NotFound/NotFound';
import CaseStudySidebar from './CaseStudySidebar';
import Skeleton from '../../components/ui/Skeleton';

const PortfolioDetail = () => {
  const { slug } = useParams();
  
  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['portfolio', 'detail', slug],
    queryFn: () => getPortfolioItem(slug),
    staleTime: 1000 * 60 * 5,
  });

  const category = project?.category;

  const { data: relatedData } = useQuery({
    queryKey: ['portfolio', 'list', { category }],
    queryFn: () => getPortfolioItems({ category }),
    enabled: !!category,
    staleTime: 1000 * 60 * 5,
  });

  useSEO({
    title: project ? `${project.title} | Case Study` : 'Loading...',
    description: project ? project.summary : ''
  });

  const relatedProjects = useMemo(() => {
    if (!relatedData?.items || !project) return [];
    return relatedData.items.filter(p => p.id !== project.id).slice(0, 2);
  }, [relatedData, project]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Section spacing="xl">
          <div className={styles.layout}>
            <div className={styles.mainContent}>
              <div style={{ height: '400px' }}><Skeleton /></div>
              <div style={{ height: '20px', marginTop: '20px' }}><Skeleton /></div>
              <div style={{ height: '20px', marginTop: '10px' }}><Skeleton /></div>
            </div>
            <aside className={styles.sidebar}>
              <div style={{ height: '300px' }}><Skeleton /></div>
            </aside>
          </div>
        </Section>
      </div>
    );
  }

  if (isError || !project) return <NotFound />;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Section bg="secondary" spacing="md">
          <div className={styles.backLinkWrapper}>
            <Link to="/portfolio" className={styles.backLink}>&larr; Back to Portfolio</Link>
          </div>
          <Badge className={styles.categoryBadge}>{project.category}</Badge>
          <h1 className={styles.title}>{project.title}</h1>
          <div className={styles.metaRow}>
            <span>{project.client}</span>
            <span className={styles.dot}>•</span>
            <span>{project.year}</span>
            <span className={styles.dot}>•</span>
            <span>{project.role}</span>
            <span className={styles.dot}>•</span>
            <span>{project.duration}</span>
          </div>
        </Section>
      </header>

      <Section spacing="xl">
        <div className={styles.layout}>
          <div className={styles.mainContent}>
            <div className={styles.coverImage}>
              <LazyImage src={project.thumbnail} alt={project.title} />
            </div>

            <div className={styles.resultsRow}>
              {project.results.map((res, i) => (
                <div key={i} className={styles.resultBlock}>
                  <div className={styles.resultValue}>{res.metric}</div>
                  <div className={styles.resultLabel}>{res.value}</div>
                </div>
              ))}
            </div>

            <div className={styles.contentSection}>
              <h2 className={styles.sectionHeading}>The Challenge</h2>
              <p className={styles.paragraph}>{project.challenge}</p>
            </div>

            <div className={styles.contentSection}>
              <h2 className={styles.sectionHeading}>The Solution</h2>
              <p className={styles.paragraph}>{project.solution}</p>
            </div>

            {project.sections.map((sec, i) => (
              <div key={i} className={styles.contentSection}>
                <h2 className={styles.sectionHeading}>{sec.heading}</h2>
                <p className={styles.paragraph}>{sec.body}</p>
              </div>
            ))}
          </div>

          <aside className={styles.sidebar}>
            <CaseStudySidebar project={project} />
          </aside>
        </div>
      </Section>

      {relatedProjects.length > 0 && (
        <Section bg="tertiary" spacing="lg">
          <h2 className={styles.relatedTitle}>More like this</h2>
          <div className={styles.relatedGrid}>
            {relatedProjects.map(p => (
              <Link key={p.id} to={`/portfolio/${p.slug}`} className={styles.relatedCard}>
                <div className={styles.relatedImage}><LazyImage src={p.thumbnail} alt={p.title} /></div>
                <h4 className={styles.relatedCardTitle}>{p.title}</h4>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};
export default PortfolioDetail;
