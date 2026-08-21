import React from 'react';
import useReadingProgress from '../../hooks/useReadingProgress';
import styles from './ReadingProgress.module.css';

const ReadingProgress = () => {
  const progress = useReadingProgress();
  return <div className={styles.bar} style={{ width: `${progress}%` }} />;
};
export default ReadingProgress;
