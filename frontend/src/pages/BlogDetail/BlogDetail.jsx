import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styles from './BlogDetail.module.css';
import { getBlogPost, getBlogPosts } from '../../services/blogService';
import { renderMarkdown } from '../../utils/markdown';
import useSEO from '../../hooks/useSEO';
import Section from '../../components/ui/Section';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import NotFound from '../NotFound/NotFound';
import ReadingProgress from './ReadingProgress';
import BlogCard from '../Blog/BlogCard';
import Skeleton from '../../components/ui/Skeleton';

const BlogDetail = () => {
  const { slug } = useParams();
  
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['blog', 'detail', slug],
    queryFn: () => getBlogPost(slug),
    staleTime: 1000 * 60 * 5,
  });

  const category = post?.category;
  
  const { data: relatedData } = useQuery({
    queryKey: ['blog', 'list', { category }],
    queryFn: () => getBlogPosts({ category, limit: 3 }),
    enabled: !!category,
    staleTime: 1000 * 60 * 5,
  });

  useSEO({
    title: post ? `${post.title} | Blog` : 'Loading...',
    description: post ? post.excerpt : ''
  });

  const relatedPosts = useMemo(() => {
    if (!relatedData?.posts || !post) return [];
    return relatedData.posts.filter(p => p.id !== post.id).slice(0, 2);
  }, [relatedData, post]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Section spacing="xl" bg="white">
          <div className={styles.container}>
            <div style={{ height: '400px' }}><Skeleton /></div>
            <div style={{ height: '20px', marginTop: '20px' }}><Skeleton /></div>
            <div style={{ height: '20px', marginTop: '10px' }}><Skeleton /></div>
            <div style={{ height: '20px', marginTop: '10px', width: '80%' }}><Skeleton /></div>
          </div>
        </Section>
      </div>
    );
  }

  if (isError || !post) return <NotFound />;

  const htmlContent = { __html: renderMarkdown(post.content) };
  const dateStr = new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className={styles.page}>
      <ReadingProgress />
      
      <article className={styles.article}>
        <Section spacing="xl" bg="white">
          <div className={styles.container}>
            <div className={styles.backLinkWrapper}>
              <Link to="/blog" className={styles.backLink}>&larr; Back to Blog</Link>
            </div>
            
            <header className={styles.header}>
              <Badge className={styles.categoryBadge}>{post.category}</Badge>
              <h1 className={styles.title}>{post.title}</h1>
              
              <div className={styles.metaRow}>
                <div className={styles.author}>
                  <Avatar src={post.author.avatar} alt={post.author.name} size="sm" />
                  <span className={styles.authorName}>{post.author.name}</span>
                </div>
                <div className={styles.timeInfo}>
                  <span>{dateStr}</span>
                  <span className={styles.dot}>•</span>
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </header>
            
            <div 
              className={styles.prose}
              dangerouslySetInnerHTML={htmlContent} 
            />
            
            <div className={styles.tagsContainer}>
              <h4 className={styles.tagsHeading}>Tagged in:</h4>
              <div className={styles.tagsList}>
                {post.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
              </div>
            </div>
            
            <div className={styles.shareSection}>
              <h4 className={styles.shareHeading}>Share this post</h4>
              <button 
                className={styles.shareBtn} 
                onClick={() => navigator.clipboard.writeText(window.location.href)}
              >
                Copy Link
              </button>
            </div>
          </div>
        </Section>
      </article>

      {relatedPosts.length > 0 && (
        <Section bg="secondary" spacing="lg">
          <div className={styles.container}>
            <h2 className={styles.relatedTitle}>Read Next</h2>
            <div className={styles.relatedGrid}>
              {relatedPosts.map(p => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </Section>
      )}
    </div>
  );
};
export default BlogDetail;
