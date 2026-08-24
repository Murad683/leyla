import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
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
  { path: '/services', label: 'Təlimlər' },
  { path: '/portfolio', label: 'Nəticələr' },
  { path: '/blog', label: 'Bloq' },
  { path: '/about', label: 'Haqqımızda' },
  { path: '/contact', label: 'Əlaqə' },
];

const Navbar = () => {
  const scrollPosition = useScrollPosition();
  const isHidden = useScrollDirection({ threshold: 160 });
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = scrollPosition > 40;
  const isOnDarkHero = location.pathname === '/' && !isScrolled && !isMenuOpen;
  const effectiveHidden = isHidden && !isMenuOpen;
  const navRef = useRef(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  useClickOutside(navRef, () => {
    if (isMenuOpen) setIsMenuOpen(false);
  });

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const logoContent = isLoading ? (
    <Skeleton width="140px" height="28px" />
  ) : settings?.logoUrl ? (
    <img src={getImageUrl(settings.logoUrl)} alt="Logo" className={styles.logoImage} style={{ height: '28px' }} />
  ) : (
    "LeylaDigital"
  );

  return (
    <header ref={navRef} className={`${styles.header} ${isOnDarkHero ? styles.onDark : ''} ${effectiveHidden ? styles.hidden : ''}`}>
      <div className={styles.bar}>
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
          <Button as={Link} to="/contact" variant="primary" size="sm" className={styles.ctaButton}>
            Qeydiyyatdan keç
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className={`${styles.mobileToggle} ${isMenuOpen ? styles.mobileToggleOpen : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Bağla' : 'Menyu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Nav — full-screen overlay */}
      <div className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ''}`}>
        <ul className={styles.mobileNavList}>
          {navLinks.map((link, i) => (
            <li key={link.path} style={{ transitionDelay: isMenuOpen ? `${i * 40}ms` : '0ms' }}>
              <NavLink
                to={link.path}
                className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className={styles.mobileNavIndex}>{String(i + 1).padStart(2, '0')}</span>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className={styles.mobileActions}>
          <Button as={Link} to="/contact" variant="primary" size="lg" className={styles.mobileButton} onClick={() => setIsMenuOpen(false)}>
            Qeydiyyatdan keç
          </Button>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
