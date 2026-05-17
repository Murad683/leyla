import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import styles from './Blog.module.css';
import { getBlogPosts } from '../../services/blogService';
import useSEO from '../../hooks/useSEO';
import Section from '../../components/ui/Section';
import RevealOnScroll from '../../components/ui/RevealOnScroll';
import BlogCard from './BlogCard';
import Pagination from '../../components/ui/Pagination';
import Skeleton from '../../components/ui/Skeleton';

const ITEMS_PER_PAGE = 6;

const Blog = () => {
  useSEO({ title: 'Blog & Insights | LeylaDigital', description: 'Thoughts, insights, and technical deep dives into digital strategy.' });
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['blog', 'list', { page: currentPage, limit: ITEMS_PER_PAGE }],
    queryFn: () => getBlogPosts({ page: currentPage, limit: ITEMS_PER_PAGE }),
    staleTime: 1000 * 60 * 5,
  });

  const featuredPost = useMemo(() => {
    if (!data?.posts) return null;
    return data.posts.find(p => p.featured) || data.posts[0];
  }, [data]);

  const currentPosts = useMemo(() => {
    if (!data?.posts || !featuredPost) return [];
    return data.posts.filter(p => p.id !== featuredPost.id);
  }, [data, featuredPost]);

  const totalPages = data?.totalPages || 1;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Section bg="secondary" spacing="xl">
          <RevealOnScroll>
            <h1 className={styles.title}>Bloq və İnsaytlar</h1>
            <p className={styles.subtitle}>Rəqəmsal məhsul yaradılması dünyasına dair düşüncələr, strategiyalar və dərin texniki araşdırmalar.</p>
          </RevealOnScroll>
        </Section>
      </header>

      <Section spacing="lg">
        {isLoading && (
          <div className={styles.grid}>
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <div key={i} style={{ height: '400px' }}><Skeleton /></div>
            ))}
          </div>
        )}

        {isError && (
          <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <h3>Xəta baş verdi</h3>
            <p>{error.message}</p>
          </div>
        )}

        {!isLoading && !isError && featuredPost && currentPage === 1 && (
          <RevealOnScroll className={styles.featuredSection}>
            <h2 className={styles.sectionHeading}>Seçilmiş Məqalə</h2>
            <BlogCard post={featuredPost} isFeatured />
          </RevealOnScroll>
        )}

        {!isLoading && !isError && (
          <div className={styles.grid}>
            {currentPosts.map((post, idx) => (
              <RevealOnScroll key={post.id} delay={idx * 50} className={styles.cardWrapper}>
                <BlogCard post={post} />
              </RevealOnScroll>
            ))}
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className={styles.paginationWrapper}>
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
export default Blog;
