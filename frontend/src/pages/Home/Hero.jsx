import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import GradientOrb from "../../components/GradientOrb/GradientOrb";
import styles from "./Hero.module.css";

const LINE1 = ["Sosial", "media —"];
const LINE2 = ["marketoloq"];
const LINE3 = ["təfəkkürü", "ilə."];

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = root.current.querySelectorAll(`.${styles.w} > span`);
    const rest = root.current.querySelectorAll(`[data-fade]`);

    if (reduce) {
      gsap.set(words, { yPercent: 0 });
      gsap.set(rest, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "expo.out" } });
      tl.from(`[data-hud] > *`, { y: 12, opacity: 0, duration: 0.7, stagger: 0.05 })
        .from(words, { yPercent: 118, duration: 1.1, stagger: 0.08 }, "-=0.3")
        .from(`.${styles.orbWrap}`, { opacity: 0, scale: 1.08, duration: 1.4 }, "-=1")
        .from(rest, { y: 22, opacity: 0, duration: 0.9, stagger: 0.1 }, "-=0.7");
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.hero} ref={root}>
      <div className={styles.orbWrap}>
        <GradientOrb />
      </div>

      <div className={`${styles.inner} shell`}>
        <div className={styles.hud} data-hud>
          <span className="mono">SMM · Strategiya · Bakı</span>
        </div>

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

        <div className={styles.foot}>
          <p className={`${styles.lead} lead`} data-fade>
            Strategiya, kontent və satış — bir sistemdə. Şəxsi brendini qur,
            auditoriyanı müştəriyə çevir.
          </p>
          <ul className={styles.proof} data-fade>
            <li>
              <b>16K+</b> <span className="mono">auditoriya</span>
            </li>
            <li>
              <b>40+</b> <span className="mono">layihə</span>
            </li>
            <li>
              <b>6 il</b> <span className="mono">təcrübə</span>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.cue} data-fade>
        <span className="mono">Aşağı</span>
        <span className={styles.line2} />
      </div>
    </section>
  );
}
