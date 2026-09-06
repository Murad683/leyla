import { useEffect, useMemo, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { useHero } from "../../lib/useContent";
import FlowGradient from "../../components/FlowField/FlowGradient";
import styles from "./Hero.module.css";

const DEFAULTS = {
  title: "Sosial media — marketoloq təfəkkürü ilə.",
  accentText: "marketoloq",
};

const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

export default function Hero() {
  const root = useRef(null);
  const title = useRef(null);

  const hero = useHero(DEFAULTS);
  const headline = hero.title;
  const accent = hero.accentText || DEFAULTS.accentText;

  const words = useMemo(() => {
    const accentSet = new Set(accent.split(/\s+/).filter(Boolean).map(norm));
    return headline
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ w, accent: accentSet.has(norm(w)) }));
  }, [headline, accent]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wEls = root.current.querySelectorAll(`.${styles.w}`);

    if (reduce) {
      gsap.set(wEls, { opacity: 1, y: 0, filter: "blur(0)" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(wEls, {
        opacity: 0,
        y: 26,
        filter: "blur(14px)",
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.3,
      });
      gsap.from(`.${styles.cue}`, { opacity: 0, duration: 0.8, delay: 1.1 });

      // continuous breathing float, per word
      wEls.forEach((w, i) => {
        gsap.to(w, {
          y: "+=6",
          duration: 3.4 + (i % 3) * 0.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1.2 + i * 0.15,
        });
      });

      // headline reacts to the cursor: gradient band + soft parallax
      const el = title.current;
      const bp = { v: 45 };
      const setBp = () => {
        if (el && el.isConnected) el.style.setProperty("--bp", bp.v.toFixed(1) + "%");
      };
      setBp();
      const qbp = gsap.quickTo(bp, "v", { duration: 0.8, ease: "power2", onUpdate: setBp });
      const qx = gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" });
      const qy = gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" });

      let idle = 0;
      const idleTick = () => {
        if (el && el.isConnected)
          el.style.setProperty("--bpi", (Math.sin(idle) * 8).toFixed(1) + "%");
        idle += 0.006;
        raf = requestAnimationFrame(idleTick);
      };
      let raf = requestAnimationFrame(idleTick);

      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth;
        const ny = e.clientY / window.innerHeight;
        qbp(nx * 210 - 45);
        qx((nx - 0.5) * 14);
        qy((ny - 0.5) * 12);
      };
      window.addEventListener("mousemove", onMove);
      return () => {
        window.removeEventListener("mousemove", onMove);
        cancelAnimationFrame(raf);
      };
    }, root);
    return () => ctx.revert();
  }, [words]);

  return (
    <section className={styles.hero} ref={root}>
      <FlowGradient />

      <h1 className={styles.title} ref={title}>
        <span className={styles.line}>
          {words.map(({ w, accent: isAccent }, i) => (
            <span
              className={`${styles.w} ${isAccent ? styles.ital : ""}`}
              key={`${w}-${i}`}
            >
              {w}&nbsp;
            </span>
          ))}
        </span>
      </h1>

      <span className={styles.cue} aria-hidden="true" />
    </section>
  );
}
