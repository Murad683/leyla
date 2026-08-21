import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../../../services/settingsService';
import { getImageUrl } from '../../../utils/imageUrl';
import styles from './Navbar.module.css';
import useScrollPosition from '../../../hooks/useScrollPosition';
import useScrollDirection from '../../../hooks/useScrollDirection';
import useClickOutside from '../../../hooks/useClickOutside';
import Button from '../../ui/Button';
import Skeleton from '../../ui/Skeleton';
import { MenuIcon, CloseIcon } from '../../../assets/icons';

const navLinks = [
  { path: '/', label: 'Ana Səhifə' },
  { path: '/services', label: 'Xidmətlər' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/blog', label: 'Bloq' },
  { path: '/about', label: 'Haqqımızda' },
  { path: '/contact', label: 'Əlaqə' },
];

const Navbar = () => {
  const scrollPosition = useScrollPosition();
  const isHidden = useScrollDirection({ threshold: 160 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = scrollPosition > 60;
  const navRef = useRef(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  useClickOutside(navRef, () => {
    if (isMenuOpen) setIsMenuOpen(false);
  });

  const logoContent = isLoading ? (
    <Skeleton width="120px" height="32px" />
  ) : settings?.logoUrl ? (
    <img src={getImageUrl(settings.logoUrl)} alt="Logo" className={styles.logoImage} style={{ height: '32px' }} />
  ) : (
    "LeylaDigital"
  );

  const effectiveHidden = isHidden && !isMenuOpen;

  return (
    <header ref={navRef} className={`${styles.header} ${effectiveHidden ? styles.hidden : ''}`}>
      <div className={`${styles.pill} ${isScrolled ? styles.scrolled : ''}`}>
        <Link to="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
          {logoContent}
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Button as={Link} to="/contact" variant="secondary" size="sm" className={styles.ctaButton}>
            Gəlin danışaq
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className={styles.mobileToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ''}`}>
        <ul className={styles.mobileNavList}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className={styles.mobileActions}>
          <Button as={Link} to="/contact" variant="primary" size="lg" className={styles.mobileButton} onClick={() => setIsMenuOpen(false)}>
            Gəlin danışaq
          </Button>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
