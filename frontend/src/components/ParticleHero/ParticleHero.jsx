import { useEffect, useRef } from "react";
import styles from "./ParticleHero.module.css";

/**
 * One full-bleed canvas for the hero:
 *  - a faint ambient dot grid across the whole area that ripples near
 *    the cursor
 *  - the headline, sampled from drawn text into dots that assemble on
 *    load, repel from the cursor, and spring home; click sends a wave
 *
 * The headline is placed over an invisible in-flow `anchor` element so
 * it lines up with the page's text column. A real <h1> stays in the DOM
 * for assistive tech / SEO and replaces the canvas under reduced motion.
 *
 * lines: [{ text: string, accent?: boolean }]
 */
export default function ParticleHero({ lines, ariaLabel }) {
  const host = useRef(null);
  const anchor = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const el = host.current;
    const an = anchor.current;
    const cv = canvas.current;
    const ctx = cv.getContext("2d");

    const INK = "#17150f";
    const ACCENT = "#b8452b";
    const REPEL_R = 118;
    const REPEL_PUSH = 3.4;
    const SPRING = 0.17;
    const DAMP = 0.72;
    const MAX_PARTICLES = 13000;
    const GRID_GAP = 44;
    const GRID_R = 165;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let heads = [];
    let grid = [];
    let raf = 0;
    let running = true;
    let startedAt = 0;
    let lastT = 0;
    const mouse = { x: -9999, y: -9999 };
    let shock = null;

    const measure = (octx, fs) => {
      octx.font = `300 ${fs}px "Fraunces", Georgia, serif`;
      return Math.max(...lines.map((l) => octx.measureText(l.text).width));
    };

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

      // ---- ambient grid ----
      grid = [];
      for (let y = GRID_GAP / 2; y < H; y += GRID_GAP) {
        for (let x = GRID_GAP / 2; x < W; x += GRID_GAP) {
          grid.push({ hx: x, hy: y, x, y });
        }
      }

      // ---- headline, positioned over the anchor box ----
      const ar = an.getBoundingClientRect();
      const cr = cv.getBoundingClientRect();
      const originX = ar.left - cr.left;
      const originY = ar.top - cr.top;
      const colW = ar.width;

      const off = document.createElement("canvas");
      const octx = off.getContext("2d");
      const wAt100 = measure(octx, 100);
      let fs = Math.min(118, (colW * 0.96) / (wAt100 / 100));
      fs = Math.max(28, fs);
      const lh = fs * 1.04;
      const blockH = lh * lines.length;

      off.width = colW * dpr;
      off.height = blockH * dpr;
      octx.scale(dpr, dpr);
      octx.font = `300 ${fs}px "Fraunces", Georgia, serif`;
      octx.textBaseline = "top";
      octx.fillStyle = "#000";
      const accentBands = [];
      lines.forEach((l, i) => {
        const y = i * lh + fs * 0.1;
        octx.fillText(l.text, 0, y);
        if (l.accent) accentBands.push([y, y + lh]);
      });

      const data = octx.getImageData(0, 0, off.width, off.height).data;
      let step = Math.max(2, Math.round(2.3 * dpr));
      const sample = (st) => {
        const out = [];
        for (let y = 0; y < off.height; y += st) {
          for (let x = 0; x < off.width; x += st) {
            if (data[(y * off.width + x) * 4 + 3] > 130) {
              const lx = x / dpr;
              const ly = y / dpr;
              const hx = originX + lx;
              const hy = originY + ly;
              out.push({
                hx,
                hy,
                x: hx + (Math.random() - 0.5) * 55,
                y: hy + 24 + Math.random() * 70,
                vx: 0,
                vy: 0,
                accent: accentBands.some((b) => ly >= b[0] && ly <= b[1]),
                delay: (lx / colW) * 300 + Math.random() * 150,
              });
            }
          }
        }
        return out;
      };
      heads = sample(step);
      while (heads.length > MAX_PARTICLES) {
        step += 1;
        heads = sample(step);
      }

      startedAt = performance.now();
      lastT = 0;
    };

    const frame = (t) => {
      raf = requestAnimationFrame(frame);
      if (!running) return;
      if (!lastT) lastT = t;
      let dt = (t - lastT) / 16.667;
      lastT = t;
      if (dt > 2.4) dt = 2.4;
      if (dt <= 0) dt = 1;
      const damp = Math.pow(DAMP, dt);
      const elapsed = t - startedAt;
      const dot = Math.max(1.4, W / 1400 + 1.3);

      ctx.clearRect(0, 0, W, H);

      // ambient grid
      for (let i = 0; i < grid.length; i++) {
        const g = grid[i];
        const gx = g.hx - mouse.x;
        const gy = g.hy - mouse.y;
        const gd = Math.hypot(gx, gy);
        let a = 0.055;
        let s = 1;
        if (gd < GRID_R) {
          const k = 1 - gd / GRID_R;
          a = 0.055 + k * 0.32;
          s = 1 + k * 1.8;
          const ang = Math.atan2(gy, gx);
          g.x += (g.hx + Math.cos(ang) * k * 16 - g.x) * 0.12;
          g.y += (g.hy + Math.sin(ang) * k * 16 - g.y) * 0.12;
        } else {
          g.x += (g.hx - g.x) * 0.1;
          g.y += (g.hy - g.y) * 0.1;
        }
        ctx.fillStyle = `rgba(23,21,15,${a})`;
        ctx.fillRect(g.x, g.y, s, s);
      }

      // headline particles
      for (let i = 0; i < heads.length; i++) {
        const p = heads[i];
        if (elapsed <= p.delay) continue;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL_R * REPEL_R) {
          const d = Math.sqrt(d2) || 1;
          const f = ((REPEL_R - d) / REPEL_R) * REPEL_PUSH * dt;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        if (shock) {
          const sx = p.x - shock.x;
          const sy = p.y - shock.y;
          const sd = Math.sqrt(sx * sx + sy * sy) || 1;
          if (sd < shock.r) {
            const f = (1 - sd / shock.r) * shock.power * dt;
            p.vx += (sx / sd) * f;
            p.vy += (sy / sd) * f;
          }
        }
        p.vx += (p.hx - p.x) * SPRING * dt;
        p.vy += (p.hy - p.y) * SPRING * dt;
        p.vx *= damp;
        p.vy *= damp;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        // settle: pin when home and nearly still
        if (
          Math.abs(p.x - p.hx) < 0.35 &&
          Math.abs(p.y - p.hy) < 0.35 &&
          Math.abs(p.vx) < 0.25 &&
          Math.abs(p.vy) < 0.25
        ) {
          p.x = p.hx;
          p.y = p.hy;
          p.vx = 0;
          p.vy = 0;
        }
      }
      ctx.fillStyle = INK;
      for (let i = 0; i < heads.length; i++) {
        const p = heads[i];
        if (!p.accent) ctx.fillRect(p.x, p.y, dot, dot);
      }
      ctx.fillStyle = ACCENT;
      for (let i = 0; i < heads.length; i++) {
        const p = heads[i];
        if (p.accent) ctx.fillRect(p.x, p.y, dot, dot);
      }

      if (shock) {
        shock.r += 26 * dt;
        shock.power *= Math.pow(0.82, dt);
        if (shock.r > Math.max(W, H) * 1.3 || shock.power < 0.05) shock = null;
      }
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
    const onClick = (e) => {
      const r = cv.getBoundingClientRect();
      shock = { x: e.clientX - r.left, y: e.clientY - r.top, r: 8, power: 4.4 };
    };
    let rt;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(build, 160);
    };
    const io = new IntersectionObserver(([en]) => {
      running = en.isIntersecting;
    });

    const boot = () => {
      build();
      raf = requestAnimationFrame(frame);
      io.observe(cv);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseout", onLeave);
      window.addEventListener("resize", onResize);
      cv.addEventListener("click", onClick);
    };

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
    else boot();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("resize", onResize);
      cv.removeEventListener("click", onClick);
    };
  }, [lines]);

  return (
    <div className={styles.host} ref={host}>
      <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
      <div className={`${styles.anchor} shell`} aria-hidden="true">
        <span className={styles.anchorInner} ref={anchor}>
          {lines.map((l, i) => (
            <span key={i} className={styles.anchorLine}>
              {l.text}
            </span>
          ))}
        </span>
      </div>
      <h1 className={styles.sr}>
        {ariaLabel || lines.map((l) => l.text).join(" ")}
      </h1>
    </div>
  );
}
