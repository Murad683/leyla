import { useEffect, useRef, useState } from "react";

/**
 * Counts from 0 to `end` once the element scrolls into view.
 * Returns [ref, value].
 */
export function useCounter(end, { duration = 1600 } = {}) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVal(end);
      return;
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || done.current) return;
        done.current = true;
        const t0 = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(end * eased));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  return [ref, val];
}
