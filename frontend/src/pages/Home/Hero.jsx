import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import styles from "./Hero.module.css";

function useClock() {
  const [t, setT] = useState("--:--");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setT(
        d.toLocaleTimeString("az-AZ", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000 * 30);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function Hero() {
  const root = useRef(null);
  const clock = useClock();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(`.${styles.word} > span`, { y: 0, opacity: 1 });
        gsap.set([`.${styles.meta}`, `.${styles.lead}`, `.${styles.cue}`], {
          opacity: 1,
          y: 0,
        });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(`.${styles.meta} > *`, {
        y: 14,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
      })
        .from(
          `.${styles.word} > span`,
          { yPercent: 115, duration: 1.05, stagger: 0.09 },
          "-=0.35"
        )
        .from(
          `.${styles.lead}`,
          { y: 20, opacity: 0, duration: 0.8 },
          "-=0.6"
        )
        .from(
          `.${styles.cue}`,
          { opacity: 0, duration: 0.6 },
          "-=0.4"
        );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.hero} ref={root}>
      <div className={`${styles.inner} shell`}>
        <div className={styles.meta}>
          <span className="mono">Bakı 40.4°N</span>
          <span className="mono">Yerli vaxt {clock}</span>
          <span className="mono">SMM / Strategiya</span>
        </div>

        <h1 className={styles.title}>
          <span className={styles.word}>
            <span>Sosial</span>
          </span>{" "}
          <span className={styles.word}>
            <span>media —</span>
          </span>
          <br />
          <span className={styles.word}>
            <span className={styles.ital}>marketoloq</span>
          </span>{" "}
          <span className={styles.word}>
            <span>təfəkkürü</span>
          </span>{" "}
          <span className={styles.word}>
            <span>ilə.</span>
          </span>
        </h1>

        <p className={`${styles.lead} lead`}>
          Strategiya, kontent və satış bir sistemdə. Şəxsi brendini qur, auditoriyanı
          müştəriyə çevir.
        </p>

        <div className={styles.cue}>
          <span className="mono">Aşağı</span>
          <span className={styles.line} />
        </div>
      </div>
    </section>
  );
}
