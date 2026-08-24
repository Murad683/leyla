import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import FloatingCTA from '../../ui/FloatingCTA';
import ClickSpark from '../../ui/ClickSpark';
import styles from './PageLayout.module.css';

const PageLayout = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isFullBleed = pathname === '/';

  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={`${styles.main} ${isFullBleed ? styles.mainFullBleed : ''}`}>
        <ClickSpark sparkColor="#5B65B3">
          <Outlet />
        </ClickSpark>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
};
export default PageLayout;
