import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import FlowField from "../../components/FlowField/FlowField";
import styles from "./Hero.module.css";

const LINE1 = ["Sosial", "media —"];
const LINE2 = ["marketoloq"];
const LINE3 = ["təfəkkürü", "ilə."];

export default function Hero() {
  const root = useRef(null);
  const title = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = root.current.querySelectorAll(`.${styles.w}`);

    if (reduce) {
      gsap.set(words, { opacity: 1, y: 0, filter: "blur(0)" });
      return;
    }

    const ctx = gsap.context(() => {
      // reveal: blur -> clear, rising, staggered
      gsap.from(words, {
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
      words.forEach((w, i) => {
        gsap.to(w, {
          y: "+=6",
          duration: 3.4 + (i % 3) * 0.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1.2 + i * 0.15,
        });
      });

      // soft parallax toward the cursor
      const qx = gsap.quickTo(title.current, "x", { duration: 0.9, ease: "power3" });
      const qy = gsap.quickTo(title.current, "y", { duration: 0.9, ease: "power3" });
      const onMove = (e) => {
        const cx = (e.clientX / window.innerWidth - 0.5) * 14;
        const cy = (e.clientY / window.innerHeight - 0.5) * 12;
        qx(cx);
        qy(cy);
      };
      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.hero} ref={root}>
      <FlowField line="23,21,15" fade="244,241,233" />

      <h1 className={styles.title} ref={title}>
        <span className={styles.line}>
          {LINE1.map((w) => (
            <span className={styles.w} key={w}>
              {w}&nbsp;
            </span>
          ))}
        </span>
        <span className={styles.line}>
          {LINE2.map((w) => (
            <span className={`${styles.w} ${styles.ital}`} key={w}>
              {w}
            </span>
          ))}
        </span>
        <span className={styles.line}>
          {LINE3.map((w) => (
            <span className={styles.w} key={w}>
              {w}&nbsp;
            </span>
          ))}
        </span>
      </h1>

      <span className={styles.cue} aria-hidden="true" />
    </section>
  );
}
