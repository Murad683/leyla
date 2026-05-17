import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Blog.module.css';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LazyImage from '../../components/ui/LazyImage';

const BlogCard = ({ post, isFeatured }) => {
  const dateStr = new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  return (
    <Card variant={isFeatured ? "elevated" : "default"} className={`${styles.card} ${isFeatured ? styles.featuredCard : ''}`}>
      <Link to={`/blog/${post.slug}`} className={styles.imageLink}>
        <LazyImage src={post.coverImage} alt={post.title} />
      </Link>
      <div className={styles.cardContent}>
        <Badge className={styles.categoryBadge}>{post.category}</Badge>
        <Link to={`/blog/${post.slug}`} className={styles.titleLink}>
          <h3 className={styles.cardTitle}>{post.title}</h3>
        </Link>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.metaRow}>
          <div className={styles.authorInfo}>
            {/* Avatar placeholder */}
            <div className={styles.avatarMini}>{post.author.name[0]}</div>
            <span>{post.author.name}</span>
          </div>
          <div className={styles.timeInfo}>
            <span>{dateStr}</span>
            <span className={styles.dot}>•</span>
            <span>{post.readTime} dəqiqəlik mütaliə</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default BlogCard;
