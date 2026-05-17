import React from 'react';
import styles from './PortfolioDetail.module.css';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const CaseStudySidebar = ({ project }) => (
  <div className={styles.sidebarContent}>
    <div className={styles.sidebarSection}>
      <h4 className={styles.sidebarLabel}>Client</h4>
      <p className={styles.sidebarValue}>{project.client}</p>
    </div>
    <div className={styles.sidebarSection}>
      <h4 className={styles.sidebarLabel}>Year</h4>
      <p className={styles.sidebarValue}>{project.year}</p>
    </div>
    <div className={styles.sidebarSection}>
      <h4 className={styles.sidebarLabel}>Role</h4>
      <p className={styles.sidebarValue}>{project.role}</p>
    </div>
    <div className={styles.sidebarSection}>
      <h4 className={styles.sidebarLabel}>Tools & Tech</h4>
      <div className={styles.toolsList}>
        {project.tools.map(t => <Badge key={t}>{t}</Badge>)}
      </div>
    </div>
    <div className={styles.sidebarCta}>
      <Button variant="primary" size="md" onClick={() => window.open(project.ctaHref, '_blank')} className={styles.ctaButton}>
        {project.ctaLabel}
      </Button>
    </div>
  </div>
);
export default CaseStudySidebar;
