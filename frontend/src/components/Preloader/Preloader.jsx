import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import styles from "./Preloader.module.css";

export default function Preloader({ onDone }) {
  const root = useRef(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("booting");

    let ended = false;
    const finish = () => {
      if (ended) return;
      ended = true;
      document.documentElement.classList.remove("booting");
      onDone?.();
    };

    const failsafe = setTimeout(finish, 3500);

    if (reduce) {
      setN(100);
      const id = setTimeout(finish, 200);
      return () => {
        clearTimeout(id);
        clearTimeout(failsafe);
      };
    }

    const obj = { v: 0 };
    const tl = gsap.timeline({ onComplete: finish });
    tl.from(`.${styles.name} span`, {
      yPercent: 120,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.03,
    })
      .to(
        obj,
        {
          v: 100,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: () => setN(Math.round(obj.v)),
        },
        0.1
      )
      .to(`.${styles.line}`, { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0.1)
      .to(`.${styles.inner}`, { opacity: 0, duration: 0.3 }, "+=0.15")
      .to(root.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
      })
      .set(root.current, { display: "none" });

    return () => {
      clearTimeout(failsafe);
      tl.kill();
    };
  }, [onDone]);

  const NAME = "Leyla Məmmədli";

  return (
    <div className={styles.root} ref={root} aria-hidden="true">
      <div className={styles.inner}>
        <div className={styles.name}>
          {NAME.split("").map((ch, i) => (
            <span key={i}>{ch === " " ? " " : ch}</span>
          ))}
        </div>
        <div className={styles.line} />
        <div className={styles.count}>
          {String(n).padStart(3, "0")} <i>/ 100</i>
        </div>
      </div>
    </div>
  );
}
