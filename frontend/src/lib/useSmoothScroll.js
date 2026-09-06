import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

/** Live Lenis instance (null while reduced-motion or before mount). */
let lenisInstance = null;
export const getLenis = () => lenisInstance;

/** Jump to the top instantly - used on route changes. */
export function scrollToTop() {
  if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

/**
 * Boots Lenis smooth scrolling and keeps GSAP ScrollTrigger in sync.
 * Mount once, near the root. Respects prefers-reduced-motion.
 * Also schedules ScrollTrigger.refresh() once late-loading things
 * (web fonts, images, a hidden→visible viewport) settle, so pinned
 * sections measure against the final layout.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      new URLSearchParams(location.search).has("nosmooth");

    let lenis;
    let onRaf;
    if (!reduce) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
      });
      lenis.on("scroll", ScrollTrigger.update);
      lenisInstance = lenis;
      onRaf = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(onRaf);
      gsap.ticker.lagSmoothing(0);
    }

    const refresh = () => ScrollTrigger.refresh();
    const timers = [300, 900, 1800, 3600].map((ms) => setTimeout(refresh, ms));
    window.addEventListener("load", refresh);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh);
    }
    // Guards the dev/preview case where the pane starts at 0×0 and only
    // gains real dimensions once shown.
    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== lastW) {
        lastW = window.innerWidth;
        refresh();
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", onResize);
      if (onRaf) gsap.ticker.remove(onRaf);
      if (lenis) lenis.destroy();
      if (lenisInstance === lenis) lenisInstance = null;
    };
  }, []);
}
