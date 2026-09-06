import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import FlowCanvas from "../../components/FlowCanvas/FlowCanvas";
import styles from "./Hero.module.css";

const WARM = ["244,201,120", "214,120,58", "176,58,38", "212,150,168", "120,110,168"];

const LINE1 = ["Sosial", "media —"];
const LINE2 = ["marketoloq"];
const LINE3 = ["təfəkkürü", "ilə."];

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = root.current.querySelectorAll(`.${styles.w} > span`);
    const rest = root.current.querySelectorAll("[data-fade]");

    if (reduce) {
      gsap.set(words, { yPercent: 0 });
      gsap.set(rest, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.35, defaults: { ease: "expo.out" } });
      tl.from(`[data-fade="tag"]`, { y: 12, opacity: 0, duration: 0.7 })
        .from(words, { yPercent: 120, duration: 1.05, stagger: 0.07 }, "-=0.2")
        .from(`[data-fade="cue"]`, { opacity: 0, duration: 0.6 }, "-=0.5");
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.hero} ref={root}>
      <FlowCanvas
        palette={WARM}
        base="#f2eee4"
        scrim="244,241,233"
        bloom="255,244,214"
        opacity={0.82}
        scrimStrength={0.6}
      />

      <div className={`${styles.inner} shell`}>
        <span className={`mono ${styles.tag}`} data-fade="tag">
          SMM · Strategiya · Bakı
        </span>

        <h1 className={styles.title}>
          <span className={styles.line}>
            {LINE1.map((w) => (
              <span className={`${styles.w} mask`} key={w}>
                <span>{w}</span>
              </span>
            ))}
          </span>
          <span className={styles.line}>
            {LINE2.map((w) => (
              <span className={`${styles.w} ${styles.ital} mask`} key={w}>
                <span>{w}</span>
              </span>
            ))}
          </span>
          <span className={styles.line}>
            {LINE3.map((w) => (
              <span className={`${styles.w} mask`} key={w}>
                <span>{w}</span>
              </span>
            ))}
          </span>
        </h1>
      </div>

      <span className={styles.cue} data-fade="cue" aria-hidden="true" />
    </section>
  );
}
