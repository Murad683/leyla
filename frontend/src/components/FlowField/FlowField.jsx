import { useEffect, useRef } from "react";
import styles from "./FlowField.module.css";

/**
 * A living "contour drawing": particles ride a slowly evolving flow
 * field and leave fading trails, so the whole surface reads as ink
 * lines drifting like wind currents. The cursor adds a soft vortex.
 * Always moving; cheap; pauses offscreen; skipped for reduced motion.
 */
export default function FlowField({
  line = "23,21,15",
  fade = "244,241,233",
  count = 900,
}) {
  const host = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = host.current;
    const cv = canvas.current;
    const ctx = cv.getContext("2d");

    let W = 0;
    let H = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    let parts = [];
    const mouse = { x: -9999, y: -9999 };

    const field = (x, y, t) =>
      Math.sin(x * 0.0016 + t * 0.00016) * 1.5 +
      Math.cos(y * 0.0019 - t * 0.00012) * 1.4 +
      Math.sin((x + y) * 0.0011 + t * 0.00026) * 0.9;

    const spawn = () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      life: 60 + Math.random() * 160,
    });

    const build = () => {
      W = el.clientWidth;
      H = el.clientHeight;
      if (!W || !H) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = W * dpr;
      cv.height = H * dpr;
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = `rgb(${fade})`;
      ctx.fillRect(0, 0, W, H);
      const n = Math.round(count * Math.min(1.4, (W * H) / (1440 * 900)));
      parts = Array.from({ length: n }, spawn);
    };

    const frame = (t) => {
      raf = requestAnimationFrame(frame);
      if (!running) return;

      // gentle fade of the previous frame -> trails
      ctx.fillStyle = `rgba(${fade},0.055)`;
      ctx.fillRect(0, 0, W, H);

      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${line},0.06)`;
      ctx.beginPath();

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const a = field(p.x, p.y, t);
        let vx = Math.cos(a) * 1.1;
        let vy = Math.sin(a) * 1.1;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 190 * 190) {
          const d = Math.sqrt(d2) || 1;
          const k = (1 - d / 190) * 2.4;
          vx += (-dy / d) * k + (dx / d) * k * 0.35;
          vy += (dx / d) * k + (dy / d) * k * 0.35;
        }

        const nx = p.x + vx;
        const ny = p.y + vy;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        p.x = nx;
        p.y = ny;
        p.life -= 1;

        if (
          p.life <= 0 ||
          p.x < -20 ||
          p.x > W + 20 ||
          p.y < -20 ||
          p.y > H + 20
        ) {
          Object.assign(p, spawn());
        }
      }
      ctx.stroke();
    };

    const onMove = (e) => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    let rt;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(build, 180);
    };
    const io = new IntersectionObserver(([en]) => {
      running = en.isIntersecting;
    });

    build();
    raf = requestAnimationFrame(frame);
    io.observe(cv);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [line, fade, count]);

  return (
    <div className={styles.host} ref={host} aria-hidden="true">
      <canvas ref={canvas} className={styles.canvas} />
    </div>
  );
}
