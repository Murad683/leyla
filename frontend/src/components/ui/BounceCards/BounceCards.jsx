import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './BounceCards.module.css';

/**
 * Adapted from the React Bits "BounceCards" pattern: instead of photographic
 * images (none of which exist for this brand), each tile renders an icon + label.
 */
const BounceCards = ({
  className = '',
  items = [],
  containerWidth = 460,
  containerHeight = 300,
  animationDelay = 0.3,
  animationStagger = 0.08,
  easeType = 'elastic.out(1, 0.6)',
  transformStyles = [],
  enableHover = true,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        `.${styles.tile}`,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: animationStagger, ease: easeType, delay: animationDelay }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [animationStagger, easeType, animationDelay]);

  const getNoRotationTransform = (transformStr) => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
    if (hasRotate) return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
    return transformStr === 'none' ? 'rotate(0deg)' : `${transformStr} rotate(0deg)`;
  };

  const getPushedTransform = (baseTransform, offsetX) => {
    const match = baseTransform.match(/translate\(([-0-9.]+)px\)/);
    if (match) {
      const newX = parseFloat(match[1]) + offsetX;
      return baseTransform.replace(/translate\(([-0-9.]+)px\)/, `translate(${newX}px)`);
    }
    return baseTransform === 'none' ? `translate(${offsetX}px)` : `${baseTransform} translate(${offsetX}px)`;
  };

  const pushSiblings = (hoveredIdx) => {
    if (!enableHover || !containerRef.current) return;
    const q = gsap.utils.selector(containerRef);
    items.forEach((_, i) => {
      const target = q(`[data-idx="${i}"]`);
      gsap.killTweensOf(target);
      const baseTransform = transformStyles[i] || 'none';
      if (i === hoveredIdx) {
        gsap.to(target, { transform: getNoRotationTransform(baseTransform), duration: 0.4, ease: 'back.out(1.4)', overwrite: 'auto' });
      } else {
        const offsetX = i < hoveredIdx ? -60 : 60;
        const distance = Math.abs(hoveredIdx - i);
        gsap.to(target, { transform: getPushedTransform(baseTransform, offsetX), duration: 0.4, ease: 'back.out(1.4)', delay: distance * 0.05, overwrite: 'auto' });
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return;
    const q = gsap.utils.selector(containerRef);
    items.forEach((_, i) => {
      const target = q(`[data-idx="${i}"]`);
      gsap.killTweensOf(target);
      gsap.to(target, { transform: transformStyles[i] || 'none', duration: 0.4, ease: 'back.out(1.4)', overwrite: 'auto' });
    });
  };

  return (
    <div
      className={`${styles.container} ${className}`}
      ref={containerRef}
      style={{ width: containerWidth, height: containerHeight }}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            data-idx={idx}
            className={styles.tile}
            style={{ transform: transformStyles[idx] ?? 'none' }}
            onMouseEnter={() => pushSiblings(idx)}
            onMouseLeave={resetSiblings}
          >
            {Icon && <span className={styles.tileIcon}><Icon /></span>}
            <span className={styles.tileLabel}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BounceCards;
