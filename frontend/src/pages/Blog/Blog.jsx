import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styles from './Blog.module.css';
import { getBlogPosts } from '../../services/blogService';
import useSEO from '../../hooks/useSEO';
import Section from '../../components/ui/Section';
import RevealOnScroll from '../../components/ui/RevealOnScroll';
import BlogCard from './BlogCard';
import FaqAccordion from './FaqAccordion';
import Pagination from '../../components/ui/Pagination';
import Skeleton from '../../components/ui/Skeleton';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import { LinkedInIcon, InstagramIcon, XIcon } from '../../assets/icons';

const ITEMS_PER_PAGE = 6;

const faqs = [
  { q: 'Leyla kimdir?', a: 'Marketinq sahəsində təlimçi və mentoram. İştirakçılara performans reklamları, SMM və data analitikası bacarıqlarını praktik təlimlər vasitəsilə öyrədirəm.', link: { href: '/about', label: 'Haqqımda səhifəsinə keçid edin →' } },
  { q: 'Hansı mövzularda yazılar hazırlayırsınız?', a: 'Performans marketinqi, SMM strategiyası, SEO, kopiraytinq və rəqəmsal artım mövzularında praktiki bələdçilər və nümunələr paylaşıram.' },
  { q: 'Təlimləriniz haqqında necə məlumat ala bilərəm?', a: 'Təlimlər səhifəsindən ətraflı məlumat ala, ya da birbaşa əlaqə formu vasitəsilə bizimlə yazışa bilərsiniz.' }
];

const Blog = () => {
  useSEO({ title: 'Bloq və İnsaytlar | LeylaDigital', description: 'Marketinq təlimləri, praktik bələdçilər və rəqəmsal strategiya haqqında düşüncələr.' });
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

  const mostRead = useMemo(() => (data?.posts || []).slice(0, 5), [data]);
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
        <div className={styles.layout}>
          <div className={styles.main}>
            {isLoading && (
              <div className={styles.grid}>
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <div key={i} style={{ height: '400px' }}><Skeleton /></div>
                ))}
              </div>
            )}

            {isError && (
              <div className={styles.errorState}>
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
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.widget}>
              <h4 className={styles.widgetTitle}>Haqqımda</h4>
              <div className={styles.authorCard}>
                <Avatar size="xl" alt="Leyla" />
                <h5 className={styles.authorName}>Leyla</h5>
                <p className={styles.authorRole}>Marketinq Təlimçisi</p>
                <p className={styles.authorBio}>Praktik təlimlər və mentorluqla iştirakçıların marketinq bacarıqlarını inkişaf etdirirəm.</p>
                <Button as={Link} to="/about" variant="secondary" size="sm">Haqqımda</Button>
              </div>
            </div>

            <div className={styles.widget}>
              <h4 className={styles.widgetTitle}>Sosial'da İzlə</h4>
              <div className={styles.widgetSocials}>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
                <a href="https://www.instagram.com/digitaleyla/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"><XIcon /></a>
              </div>
            </div>

            {mostRead.length > 0 && (
              <div className={styles.widget}>
                <h4 className={styles.widgetTitle}>Ən Çox Oxunan Yazılar</h4>
                <ul className={styles.mostReadList}>
                  {mostRead.map((post) => (
                    <li key={post.id}>
                      <Link to={`/blog/${post.slug}`} className={styles.mostReadLink}>
                        <span className={styles.mostReadDate}>{new Date(post.publishedAt).toLocaleDateString('az-AZ', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        <span className={styles.mostReadTitle}>{post.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Section>

      <Section bg="secondary" spacing="xl">
        <RevealOnScroll>
          <h2 className={styles.faqHeading}>Tez-Tez Soruşulan Suallar</h2>
        </RevealOnScroll>
        <RevealOnScroll delay={100}>
          <FaqAccordion items={faqs} />
        </RevealOnScroll>
      </Section>
    </div>
  );
};
export default Blog;
