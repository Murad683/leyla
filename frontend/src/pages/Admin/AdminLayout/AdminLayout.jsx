import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../../../services/adminService';
import styles from './AdminLayout.module.css';

const navLinks = [
  { path: '/admin/dashboard', label: 'Məlumat Paneli', icon: '📊' },
  { path: '/admin/settings', label: 'Ümumi Parametrlər', icon: '⚙️' },
  { path: '/admin/hero', label: 'Hero Bölməsi', icon: '✨' },
  { path: '/admin/about', label: 'Haqqımızda', icon: '👤' },
  { path: '/admin/services', label: 'Xidmətlər', icon: '💼' },
  { path: '/admin/portfolio', label: 'Portfolio', icon: '🎨' },
  { path: '/admin/blog', label: 'Bloq', icon: '✍️' },
];

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.logoWrapper}>
          <Link to="/" className={styles.logoText}>LeylaDigital</Link>
          <span className={styles.badge}>CMS v1.0</span>
        </div>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.icon}>{link.icon}</span>
              <span className={styles.label}>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <span className={styles.icon}>🚪</span> Çıxış et
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.main}>
        <header className={styles.header}>
          <button className={styles.menuToggle} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? '✕' : '☰'}
          </button>
          
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>İdarəetmə Paneli</h1>
          </div>

          <div className={styles.headerRight}>
            <Link to="/" target="_blank" rel="noopener noreferrer" className={styles.viewSiteBtn}>
              🌐 Saytı Göstər
            </Link>
            <div className={styles.userProfile}>
              <span className={styles.avatar}>A</span>
              <span className={styles.username}>Admin</span>
            </div>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
