import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "./gsap";

/**
 * Reveal-on-scroll. Returns a ref to attach to a container.
 * Every descendant carrying `.reveal` gets an `.is-in` class toggled
 * as it enters the viewport, with a stagger per group.
 *
 * opts:
 *   selector  - what to reveal (default ".reveal")
 *   stagger   - seconds between items (default 0.08)
 *   start     - ScrollTrigger start (default "top 82%")
 */
export function useReveal(opts = {}) {
  const ref = useRef(null);
  const { selector = ".reveal", stagger = 0.08, start = "top 82%" } = opts;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(root.querySelectorAll(selector));
    if (!items.length) return;

    if (reduce) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(items, {
        start,
        onEnter: (batch) =>
          batch.forEach((el, i) =>
            gsap.delayedCall(i * stagger, () => el.classList.add("is-in"))
          ),
      });
    }, root);

    return () => ctx.revert();
  }, [selector, stagger, start]);

  return ref;
}
