import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../../../services/settingsService';
import { LinkedInIcon, InstagramIcon, XIcon } from '../../../assets/icons';
import { getImageUrl } from '../../../utils/imageUrl';
import Skeleton from '../../ui/Skeleton';
import styles from './Footer.module.css';

const navLinks = [
  { path: '/', label: 'Ana Səhifə' },
  { path: '/services', label: 'Xidmətlər' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/blog', label: 'Bloq' },
  { path: '/about', label: 'Haqqımızda' },
  { path: '/contact', label: 'Əlaqə' },
];

const Footer = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  if (isLoading) {
    return (
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.col1}>
              <Skeleton width="150px" height="32px" />
              <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <Skeleton width="100%" height="20px" />
                <Skeleton width="80%" height="20px" style={{ marginTop: '4px' }} />
              </div>
              <Skeleton width="200px" height="20px" />
            </div>
            <div className={styles.col2}>
              <Skeleton width="120px" height="24px" className={styles.colTitle} />
              <ul className={styles.links}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={i}><Skeleton width="80px" height="20px" /></li>
                ))}
              </ul>
            </div>
            <div className={styles.col3}>
              <Skeleton width="80px" height="24px" className={styles.colTitle} />
              <div className={styles.socials}>
                <Skeleton width="32px" height="32px" variant="circular" />
                <Skeleton width="32px" height="32px" variant="circular" />
                <Skeleton width="32px" height="32px" variant="circular" />
              </div>
              <div style={{ marginTop: '1rem' }}>
                <Skeleton width="130px" height="20px" />
                <Skeleton width="160px" height="20px" style={{ marginTop: '4px' }} />
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  const logoContent = settings?.logoUrl ? (
    <img src={getImageUrl(settings.logoUrl)} alt="Logo" className={styles.logoImage} style={{ height: '32px' }} />
  ) : (
    "LeylaDigital"
  );

  const phone = settings?.phone || "+994 50 831 48 08";
  const email = settings?.email || "hello@leyladigital.com";
  const facebookUrl = settings?.facebookUrl || "https://facebook.com";
  const instagramUrl = settings?.instagramUrl || "https://www.instagram.com/digitaleyla/";
  const linkedinUrl = settings?.linkedinUrl || "https://linkedin.com";
  const twitterUrl = settings?.twitterUrl || "https://x.com";
  const description = settings?.metaDescription || "Brendləri ucaldan və biznesləri böyüdən rəqəmsal təcrübələr yaradırıq.";

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.col1}>
            <Link to="/" className={styles.logo}>{logoContent}</Link>
            <p className={styles.description}>{description}</p>
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
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="X (Twitter)">
                <XIcon />
              </a>
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                <InstagramIcon />
              </a>
            </div>
            <a href={`tel:${phone.replace(/\s+/g, '')}`} className={styles.email}>{phone}</a>
            <br />
            <a href={`mailto:${email}`} className={styles.email}>{email}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
