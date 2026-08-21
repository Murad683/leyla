import { useState, useEffect, useRef } from 'react';

export const useScrollDirection = ({ threshold = 150 } = {}) => {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.pageYOffset;
    const onScroll = () => {
      const y = window.pageYOffset;
      if (y > lastY.current && y > threshold) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return hidden;
};

export default useScrollDirection;
