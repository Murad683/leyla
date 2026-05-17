import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './PageTransition.module.css';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('fadeOut');
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fadeIn');
      }, 300); // matches var(--transition-base)
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  return (
    <div className={`${styles.wrapper} ${styles[transitionStage]}`}>
      {children}
    </div>
  );
};
export default PageTransition;
