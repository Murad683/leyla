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

    if (reduce) {
      setN(100);
      const id = setTimeout(finish, 200);
      return () => clearTimeout(id);
    }

    // Failsafe: if rAF is throttled (backgrounded tab) the timeline can stall.
    // Never trap the user behind the curtain.
    const failsafe = setTimeout(finish, 3500);

    const obj = { v: 0 };
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(obj, {
      v: 100,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => setN(Math.round(obj.v)),
    })
      .to(`.${styles.count}`, { opacity: 0, duration: 0.3 }, "+=0.15")
      .to(
        `.${styles.bar}`,
        { scaleY: 0, transformOrigin: "top", duration: 0.7, stagger: 0.06, ease: "power3.inOut" },
        "-=0.1"
      )
      .set(root.current, { display: "none" });

    return () => {
      clearTimeout(failsafe);
      tl.kill();
    };
  }, [onDone]);

  return (
    <div className={styles.root} ref={root} aria-hidden="true">
      <div className={styles.bars}>
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className={styles.bar} />
        ))}
      </div>
      <div className={styles.inner}>
        <span className={styles.brand}>Leyla Məmmədli</span>
        <span className={styles.count}>
          {String(n).padStart(3, "0")} <i>/ 100</i>
        </span>
      </div>
    </div>
  );
}
