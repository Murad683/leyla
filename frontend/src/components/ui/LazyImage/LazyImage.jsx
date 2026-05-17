import React, { useState, useEffect, useRef } from 'react';
import styles from './LazyImage.module.css';

const LazyImage = ({ src, alt, className = '', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={`${styles.placeholder} ${isLoaded ? styles.hidden : ''}`} />
      {src ? (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`${styles.image} ${isLoaded ? styles.visible : ''}`}
          {...props}
        />
      ) : (
        <div className={styles.emptyPlaceholder} />
      )}
    </div>
  );
};
export default LazyImage;
