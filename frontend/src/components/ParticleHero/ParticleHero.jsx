import { useEffect, useRef } from "react";
import styles from "./ParticleHero.module.css";

/**
 * Full-bleed hero canvas:
 *  - a slow, always-moving warm "aurora" (soft colour fields drifting
 *    on their own; they also lean toward the cursor)
 *  - the centred headline, sampled from drawn text into dots that
 *    assemble on load, repel from the cursor and spring home; click
 *    sends a shockwave
 *
 * A real <h1> stays in the DOM for assistive tech / SEO and replaces
 * the canvas under reduced motion.
 *
 * lines: [{ text: string, accent?: boolean }]
 */
export default function ParticleHero({ lines, ariaLabel }) {
  const host = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const el = host.current;
    const cv = canvas.current;
    const ctx = cv.getContext("2d");

    const INK = "#100e08";
    const ACCENT = "#a63a1f";
    const REPEL_R = 116;
    const REPEL_PUSH = 3.4;
    const SPRING = 0.17;
    const DAMP = 0.72;
    const MAX_PARTICLES = 13000;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let heads = [];
    let raf = 0;
    let running = true;
    let startedAt = 0;
    let lastT = 0;
    const mouse = { x: -9999, y: -9999, ex: 0.5, ey: 0.5 };
    let shock = null;

    // offscreen aurora, rendered at low res then scaled up (free blur)
    const aur = document.createElement("canvas");
    const actx = aur.getContext("2d");
    const AUR_W = 240;
    let AUR_H = 140;
    const blobs = [
      { c: "244,201,120", x: 0.28, y: 0.44, r: 0.66, sx: 0.00019, sy: 0.00024, px: 0, py: 0 },
      { c: "214,120,58", x: 0.66, y: 0.4, r: 0.56, sx: 0.00024, sy: 0.00016, px: 1.7, py: 0.5 },
      { c: "176,58,38", x: 0.74, y: 0.68, r: 0.46, sx: 0.00016, sy: 0.00027, px: 3.1, py: 2.0 },
      { c: "212,150,168", x: 0.4, y: 0.74, r: 0.5, sx: 0.00027, sy: 0.00019, px: 4.6, py: 1.1 },
      { c: "120,110,168", x: 0.52, y: 0.24, r: 0.4, sx: 0.00021, sy: 0.00029, px: 2.2, py: 3.4 },
    ];

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

      AUR_H = Math.round((AUR_W * H) / W);
      aur.width = AUR_W;
      aur.height = AUR_H;

      // headline text -> dot field, centred
      const off = document.createElement("canvas");
      const octx = off.getContext("2d");
      const colLimit = Math.min(W * 0.9, 1200);
      const wAt100 = measure(octx, 100);
      let fs = Math.min(112, (colLimit * 0.98) / (wAt100 / 100));
      fs = Math.max(26, fs);
      const lh = fs * 1.06;
      const blockH = lh * lines.length;
      const originY = (H - blockH) / 2;

      off.width = W * dpr;
      off.height = blockH * dpr;
      octx.scale(dpr, dpr);
      octx.font = `300 ${fs}px "Fraunces", Georgia, serif`;
      octx.textAlign = "center";
      octx.textBaseline = "top";
      octx.fillStyle = "#000";
      const accentBands = [];
      lines.forEach((l, i) => {
        const y = i * lh + fs * 0.12;
        octx.fillText(l.text, W / 2, y);
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
              const hx = lx;
              const hy = originY + ly;
              out.push({
                hx,
                hy,
                x: hx + (Math.random() - 0.5) * 55,
                y: hy + 22 + Math.random() * 66,
                vx: 0,
                vy: 0,
                accent: accentBands.some((b) => ly >= b[0] && ly <= b[1]),
                delay: Math.abs(lx - W / 2) * 0.4 + Math.random() * 150,
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

    const drawAurora = (t) => {
      actx.globalCompositeOperation = "source-over";
      actx.fillStyle = "#f2eee4";
      actx.fillRect(0, 0, AUR_W, AUR_H);
      actx.globalCompositeOperation = "multiply";
      mouse.ex += ((mouse.x < 0 ? 0.5 : mouse.x / W) - mouse.ex) * 0.05;
      mouse.ey += ((mouse.y < 0 ? 0.5 : mouse.y / H) - mouse.ey) * 0.05;

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        const dx = Math.sin(t * b.sx + b.px) * 0.26;
        const dy = Math.cos(t * b.sy + b.py) * 0.24;
        const lean = i % 2 ? 0.2 : -0.14;
        const tx = b.x + dx + (mouse.ex - 0.5) * lean;
        const ty = b.y + dy + (mouse.ey - 0.5) * lean;
        const cx = tx * AUR_W;
        const cy = ty * AUR_H;
        const rad = b.r * AUR_W * (0.85 + Math.sin(t * 0.0004 + b.px) * 0.22);
        const g = actx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, `rgba(${b.c},0.9)`);
        g.addColorStop(0.5, `rgba(${b.c},0.34)`);
        g.addColorStop(1, `rgba(${b.c},0)`);
        actx.fillStyle = g;
        actx.beginPath();
        actx.arc(cx, cy, rad, 0, Math.PI * 2);
        actx.fill();
      }

      // bright bloom that trails the cursor
      const bx = mouse.ex * AUR_W;
      const by = mouse.ey * AUR_H;
      const br = AUR_W * 0.34;
      const bg = actx.createRadialGradient(bx, by, 0, bx, by, br);
      bg.addColorStop(0, "rgba(255,244,214,0.5)");
      bg.addColorStop(1, "rgba(255,244,214,0)");
      actx.globalCompositeOperation = "screen";
      actx.fillStyle = bg;
      actx.beginPath();
      actx.arc(bx, by, br, 0, Math.PI * 2);
      actx.fill();

      actx.globalCompositeOperation = "source-over";
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

      drawAurora(t);
      ctx.globalAlpha = 0.82;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(aur, 0, 0, AUR_W, AUR_H, 0, 0, W, H);
      ctx.globalAlpha = 1;

      // soft light scrim behind the headline so the dots stay legible
      const sc = ctx.createRadialGradient(
        W / 2,
        H / 2,
        0,
        W / 2,
        H / 2,
        Math.min(W, H) * 0.62
      );
      sc.addColorStop(0, "rgba(244,241,233,0.62)");
      sc.addColorStop(0.55, "rgba(244,241,233,0.32)");
      sc.addColorStop(1, "rgba(244,241,233,0)");
      ctx.fillStyle = sc;
      ctx.fillRect(0, 0, W, H);

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
      <h1 className={styles.sr}>
        {ariaLabel || lines.map((l) => l.text).join(" ")}
      </h1>
    </div>
  );
}
