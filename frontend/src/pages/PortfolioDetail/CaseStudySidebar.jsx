import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PortfolioDetail.module.css';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const CaseStudySidebar = ({ project }) => (
  <div className={styles.sidebarContent}>
    <div className={styles.sidebarSection}>
      <h4 className={styles.sidebarLabel}>Məzun</h4>
      <p className={styles.sidebarValue}>{project.client}</p>
    </div>
    <div className={styles.sidebarSection}>
      <h4 className={styles.sidebarLabel}>İl</h4>
      <p className={styles.sidebarValue}>{project.year}</p>
    </div>
    <div className={styles.sidebarSection}>
      <h4 className={styles.sidebarLabel}>Müddət</h4>
      <p className={styles.sidebarValue}>{project.duration}</p>
    </div>
    <div className={styles.sidebarSection}>
      <h4 className={styles.sidebarLabel}>İstifadə Olunan Alətlər</h4>
      <div className={styles.toolsList}>
        {project.tools.map(t => <Badge key={t}>{t}</Badge>)}
      </div>
    </div>
    <div className={styles.sidebarCta}>
      <Button as={Link} to="/contact" variant="primary" size="md" className={styles.ctaButton}>
        Bu Təlimə Qeydiyyatdan Keç
      </Button>
    </div>
  </div>
);
export default CaseStudySidebar;
