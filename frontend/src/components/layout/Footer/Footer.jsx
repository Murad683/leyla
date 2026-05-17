import React from 'react';
import { Link } from 'react-router-dom';
import { LinkedInIcon, InstagramIcon, XIcon } from '../../../assets/icons';
import styles from './Footer.module.css';

const navLinks = [
  { path: '/', label: 'Ana Səhifə' },
  { path: '/services', label: 'Xidmətlər' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/blog', label: 'Bloq' },
  { path: '/about', label: 'Haqqımızda' },
  { path: '/contact', label: 'Əlaqə' },
];

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.col1}>
          <Link to="/" className={styles.logo}>LeylaDigital</Link>
          <p className={styles.description}>Brendləri ucaldan və biznesləri böyüdən rəqəmsal təcrübələr yaradırıq.</p>
          <p className={styles.copyright}>&copy; {new Date().getFullYear()} LeylaDigital. Bütün hüquqlar qorunur.</p>
        </div>
        <div className={styles.col2}>
          <h4 className={styles.colTitle}>Sürətli Keçidlər</h4>
          <ul className={styles.links}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className={styles.link}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.col3}>
          <h4 className={styles.colTitle}>Əlaqə</h4>
          <div className={styles.socials}>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="X (Twitter)">
              <XIcon />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a href="https://www.instagram.com/digitaleyla/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
              <InstagramIcon />
            </a>
          </div>
          <a href="tel:+994508314808" className={styles.email}>+994 50 831 48 08</a>
          <br />
          <a href="mailto:hello@leyladigital.com" className={styles.email}>hello@leyladigital.com</a>
        </div>
      </div>
    </div>
  </footer>
);
export default Footer;
