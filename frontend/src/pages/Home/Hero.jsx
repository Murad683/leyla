import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import ParticleHero from "../../components/ParticleHero/ParticleHero";
import styles from "./Hero.module.css";

const LINES = [
  { text: "Sosial media —" },
  { text: "marketoloq", accent: true },
  { text: "təfəkkürü ilə." },
];

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rest = root.current.querySelectorAll("[data-fade]");
    if (reduce) {
      gsap.set(rest, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(rest, {
        y: 14,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.14,
        delay: 0.45,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.hero} ref={root}>
      <ParticleHero
        lines={LINES}
        ariaLabel="Sosial media — marketoloq təfəkkürü ilə."
      />

      <div className={`${styles.inner} shell`}>
        <span className={`mono ${styles.tag}`} data-fade>
          SMM · Strategiya · Bakı
        </span>
      </div>

      <span className={styles.cue} data-fade aria-hidden="true" />
    </section>
  );
}
