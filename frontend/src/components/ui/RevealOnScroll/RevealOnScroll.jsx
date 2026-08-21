import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './RevealOnScroll.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-triggered reveal. Set `stagger` to animate each direct child in sequence
 * (e.g. a grid of cards) instead of the wrapper as a single block.
 */
const RevealOnScroll = ({ children, delay = 0, className = '', y = 28, stagger = 0 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { clearProps: 'all' });
      return undefined;
    }

    const targets = stagger ? gsap.utils.toArray(el.children) : el;
    gsap.set(targets, { opacity: 0, y });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: delay / 1000,
          stagger: stagger ? stagger / 1000 : 0,
          ease: 'expo.out',
        });
      },
    });

    return () => trigger.kill();
  }, [delay, y, stagger]);

  return (
    <div ref={ref} className={`${styles.reveal} ${className}`}>
      {children}
    </div>
  );
};
export default RevealOnScroll;
