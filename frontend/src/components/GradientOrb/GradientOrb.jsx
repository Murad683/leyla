import { useEffect, useRef } from "react";
import styles from "./GradientOrb.module.css";

/**
 * Canvas "light" — a warm luminous glow that drifts slowly and eases
 * toward the pointer. Stands in for a hero photograph; cheap, GPU-light,
 * pauses when offscreen.
 */
export default function GradientOrb() {
  const canvas = useRef(null);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w, h, dpr;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = cv.offsetWidth;
      h = cv.offsetHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // warm-only palette, layered light → deep
    const blobs = [
      { c: "#f0c98c", x: 0.52, y: 0.62, r: 0.42, px: 0.52, py: 0.62, s: 0.00016, a: 0 },
      { c: "#d98c4a", x: 0.6, y: 0.5, r: 0.52, px: 0.6, py: 0.5, s: 0.00013, a: 1.6 },
      { c: "#bd4c2c", x: 0.68, y: 0.66, r: 0.4, px: 0.68, py: 0.66, s: 0.00018, a: 3.1 },
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
        const driftX = b.x + Math.sin(t * b.s + b.a) * 0.045;
        const driftY = b.y + Math.cos(t * b.s * 1.25 + b.a) * 0.045;
        const tgtX = driftX + (mx - 0.5) * 0.08;
        const tgtY = driftY + (my - 0.5) * 0.08;
        b.px += (tgtX - b.px) * 0.035;
        b.py += (tgtY - b.py) * 0.035;

        const cx = b.px * w;
        const cy = b.py * h;
        const rad = b.r * Math.min(w, h);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, b.c + "9a");
        g.addColorStop(0.5, b.c + "3a");
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

    if (reduce) draw(0);
    else loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={canvas} className={styles.orb} aria-hidden="true" />;
}
