import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../../../services/settingsService';
import { LinkedInIcon, InstagramIcon, XIcon } from '../../../assets/icons';
import { getImageUrl } from '../../../utils/imageUrl';
import Skeleton from '../../ui/Skeleton';
import styles from './Footer.module.css';

const navLinks = [
  { path: '/services', label: 'Təlimlər' },
  { path: '/portfolio', label: 'Nəticələr' },
  { path: '/blog', label: 'Bloq' },
  { path: '/about', label: 'Haqqımızda' },
  { path: '/contact', label: 'Əlaqə' },
];

const Footer = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  const logoContent = settings?.logoUrl ? (
    <img src={getImageUrl(settings.logoUrl)} alt="Logo" className={styles.logoImage} style={{ height: '28px' }} />
  ) : (
    "LeylaDigital"
  );

  const phone = settings?.phone || "+994 50 831 48 08";
  const email = settings?.email || "hello@leyladigital.com";
  const instagramUrl = settings?.instagramUrl || "https://www.instagram.com/digitaleyla/";
  const linkedinUrl = settings?.linkedinUrl || "https://linkedin.com";
  const twitterUrl = settings?.twitterUrl || "https://x.com";

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <Link to="/contact" className={styles.ctaBlock}>
          <span className={styles.ctaText}>Növbəti addımı atın</span>
          <span className={styles.ctaArrow}>&rarr;</span>
        </Link>

        <div className={styles.bottomRow}>
          <div className={styles.bottomLeft}>
            {isLoading ? <Skeleton width="140px" height="24px" /> : (
              <Link to="/" className={styles.logo}>{logoContent}</Link>
            )}
            <p className={styles.copyright}>&copy; {new Date().getFullYear()} LeylaDigital Akademiya. Bütün hüquqlar qorunur.</p>
          </div>

          <nav className={styles.navCol}>
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={styles.link}>{link.label}</Link>
            ))}
          </nav>

          <div className={styles.contactCol}>
            <a href={`mailto:${email}`} className={styles.link}>{email}</a>
            <a href={`tel:${phone.replace(/\s+/g, '')}`} className={styles.link}>{phone}</a>
            <div className={styles.socials}>
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"><XIcon /></a>
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
