import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Portfolio.module.css';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LazyImage from '../../components/ui/LazyImage';

const PortfolioCard = ({ project, isFeatured }) => (
  <Card variant="elevated" className={`${styles.card} ${isFeatured ? styles.featuredCard : ''}`}>
    <div className={styles.imageArea}>
      <LazyImage src={project.thumbnail} alt={project.title} />
    </div>
    <div className={styles.cardContent}>
      <div className={styles.tagsRow}>
        {project.tags.slice(0, 3).map(tag => <Badge key={tag} className={styles.tag}>{tag}</Badge>)}
      </div>
      <h3 className={styles.cardTitle}>{project.title}</h3>
      <p className={styles.summary}>{project.summary}</p>
      <div className={styles.metaRow}>
        <span>{project.year}</span>
        <span className={styles.dot}>•</span>
        <span>{project.client}</span>
      </div>
      <Link to={`/portfolio/${project.slug}`} className={styles.link}>Layihəni araşdır &rarr;</Link>
    </div>
  </Card>
);
export default PortfolioCard;
