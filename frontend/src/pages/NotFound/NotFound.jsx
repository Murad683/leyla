import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';
import Button from '../../components/ui/Button';

const NotFound = () => (
  <div className={styles.container}>
    <div className={styles.graphic}><span className={styles.title}>404</span></div>
    <p className={styles.message}>Səhifə tapılmadı</p>
    <p className={styles.description}>Axtardığınız səhifə mövcud deyil və ya başqa yerə köçürülüb.</p>
    <Button as={Link} to="/" variant="primary">Ana Səhifəyə qayıt</Button>
  </div>
);

export default NotFound;
