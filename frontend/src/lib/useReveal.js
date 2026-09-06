import { useEffect, useRef } from "react";

/**
 * Reveal-on-scroll. Returns a ref to attach to a container.
 * Every descendant carrying `.reveal` gets `.is-in` once it enters the
 * viewport, staggered per group. Uses a plain IntersectionObserver so
 * it also fires for items already on screen at load, and a failsafe
 * timer guarantees content is never left hidden.
 *
 * opts:
 *   selector - what to reveal (default ".reveal")
 *   stagger  - seconds between items (default 0.08)
 */
export function useReveal(opts = {}) {
  const ref = useRef(null);
  const { selector = ".reveal", stagger = 0.08 } = opts;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll(selector));
    if (!items.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        // reveal intersecting entries in DOM order with a stagger
        const hits = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target)
          .sort((a, b) => items.indexOf(a) - items.indexOf(b));
        hits.forEach((el, i) => {
          setTimeout(() => el.classList.add("is-in"), i * stagger * 1000);
          obs.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));

    // failsafe: if the observer never fired for something already on
    // screen, reveal it anyway (below-the-fold items stay observed)
    const failsafe = setTimeout(() => {
      items.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 1.1) {
          el.classList.add("is-in");
          io.unobserve(el);
        }
      });
    }, 2500);

    return () => {
      clearTimeout(failsafe);
      io.disconnect();
    };
  }, [selector, stagger]);

  return ref;
}
