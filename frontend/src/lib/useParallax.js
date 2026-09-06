import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "./gsap";

/**
 * Vertical parallax on a single element.
 *   distance - px to travel across the scroll span (default 90)
 *   from     - starting offset; element moves from `from` to `from - distance`
 */
export function useParallax(distance = 90, from = 0) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: from },
        {
          y: from - distance,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });
    return () => ctx.revert();
  }, [distance, from]);

  return ref;
}
