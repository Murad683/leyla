import { useEffect, useRef } from "react";
import styles from "./Cursor.module.css";

/**
 * Minimal two-part cursor: a solid dot that tracks 1:1 and a ring
 * that lags behind. Grows over links / [data-cursor]. Desktop only
 * (hidden via CSS on coarse pointers).
 */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const d = dot.current;
    const r = ring.current;
    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let x = rx;
    let y = ry;
    let raf;

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const over = (e) => {
      if (e.target.closest("a, button, [data-cursor]")) {
        r.classList.add(styles.active);
      }
    };
    const out = (e) => {
      if (e.target.closest("a, button, [data-cursor]")) {
        r.classList.remove(styles.active);
      }
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    loop();

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={`${styles.root} cursor-root`} aria-hidden="true">
      <div ref={ring} className={styles.ring} />
      <div ref={dot} className={styles.dot} />
    </div>
  );
}
