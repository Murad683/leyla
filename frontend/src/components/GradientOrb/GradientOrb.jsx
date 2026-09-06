import { useEffect, useRef } from "react";
import styles from "./GradientOrb.module.css";

/**
 * Canvas "orb" — soft drifting colour fields that ease toward the pointer.
 * Stands in for a hero photograph; cheap, GPU-light, pauses when offscreen.
 */
export default function GradientOrb() {
  const canvas = useRef(null);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w, h, dpr;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      w = cv.offsetWidth;
      h = cv.offsetHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const blobs = [
      { c: "#c0492c", x: 0.36, y: 0.42, r: 0.54, px: 0.36, py: 0.42, s: 0.00022, a: 0 },
      { c: "#d98c4a", x: 0.62, y: 0.52, r: 0.46, px: 0.62, py: 0.52, s: 0.00016, a: 2 },
      { c: "#caa24b", x: 0.5, y: 0.68, r: 0.4, px: 0.5, py: 0.68, s: 0.00019, a: 3 },
      { c: "#5b57c9", x: 0.82, y: 0.24, r: 0.16, px: 0.82, py: 0.24, s: 0.00024, a: 4 },
    ];

    let mx = 0.5;
    let my = 0.5;
    const onMove = (e) => {
      const b = cv.getBoundingClientRect();
      mx = (e.clientX - b.left) / b.width;
      my = (e.clientY - b.top) / b.height;
    };
    window.addEventListener("mousemove", onMove);

    let raf;
    let running = true;
    const io = new IntersectionObserver(([en]) => {
      running = en.isIntersecting;
      if (running && !reduce) loop();
    });
    io.observe(cv);

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#f4f1e9";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "multiply";

      blobs.forEach((b) => {
        const driftX = b.x + Math.sin(t * b.s + b.a) * 0.06;
        const driftY = b.y + Math.cos(t * b.s * 1.3 + b.a) * 0.06;
        const tgtX = driftX + (mx - 0.5) * 0.12;
        const tgtY = driftY + (my - 0.5) * 0.12;
        b.px += (tgtX - b.px) * 0.04;
        b.py += (tgtY - b.py) * 0.04;

        const cx = b.px * w;
        const cy = b.py * h;
        const rad = b.r * Math.min(w, h);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, b.c + "cc");
        g.addColorStop(1, b.c + "00");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const loop = () => {
      if (!running) return;
      draw(performance.now());
      raf = requestAnimationFrame(loop);
    };

    if (reduce) {
      draw(0);
    } else {
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={canvas} className={styles.orb} aria-hidden="true" />;
}
