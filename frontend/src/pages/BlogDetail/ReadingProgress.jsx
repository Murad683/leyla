import React from 'react';
import useReadingProgress from '../../hooks/useReadingProgress';

const ReadingProgress = () => {
  const progress = useReadingProgress();
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: `${progress}%`, height: '3px', backgroundColor: 'var(--color-accent)', zIndex: 9999, transition: 'width 100ms ease-out' }} />
  );
};
export default ReadingProgress;
