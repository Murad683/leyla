import { useEffect, useRef } from "react";
import styles from "./ParticleHeadline.module.css";

/**
 * Renders a headline as a field of dots sampled from the drawn text.
 * Dots repel from the cursor and spring back home; on load they
 * assemble from a scattered state. A real <h1> stays in the DOM for
 * assistive tech / SEO and is shown instead when motion is reduced.
 *
 * lines: [{ text: string, accent?: boolean }]
 */
export default function ParticleHeadline({ lines, ariaLabel }) {
  const wrap = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const host = wrap.current;
    const cv = canvas.current;
    const ctx = cv.getContext("2d", { alpha: true });

    const INK = "#17150f";
    const ACCENT = "#b8452b";
    const REPEL_R = 112;
    const REPEL_PUSH = 3.2;
    const SPRING = 0.16;
    const DAMP = 0.74;
    const MAX_PARTICLES = 13000;

    let dpr = 1;
    let W = 0;
    let H = 0;
    let particles = [];
    let raf = 0;
    let running = true;
    let startedAt = 0;
    let lastT = 0;
    const mouse = { x: -9999, y: -9999 };
    let shock = null;

    const measure = (offctx, fs) => {
      offctx.font = `300 ${fs}px "Fraunces", Georgia, serif`;
      return Math.max(...lines.map((l) => offctx.measureText(l.text).width));
    };

    const build = () => {
      const cssW = host.clientWidth;
      if (!cssW) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      // pick a font size so the widest line fills the column
      const off = document.createElement("canvas");
      const octx = off.getContext("2d");
      const wAt100 = measure(octx, 100);
      let fs = Math.min(190, (cssW * 0.98) / (wAt100 / 100));
      fs = Math.max(34, fs);
      const lh = fs * 0.98;

      W = cssW;
      H = Math.ceil(lh * lines.length + fs * 0.3);

      host.style.height = `${H}px`;
      cv.width = W * dpr;
      cv.height = H * dpr;
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;

      // draw text to an offscreen buffer and sample it
      off.width = W * dpr;
      off.height = H * dpr;
      octx.scale(dpr, dpr);
      octx.font = `300 ${fs}px "Fraunces", Georgia, serif`;
      octx.textBaseline = "top";
      octx.fillStyle = "#000";
      const accentRanges = [];
      lines.forEach((l, i) => {
        const y = i * lh + fs * 0.12;
        octx.fillText(l.text, 0, y);
        if (l.accent) accentRanges.push([y, y + lh]);
      });

      const img = octx.getImageData(0, 0, off.width, off.height).data;
      let step = Math.max(2, Math.round(2.4 * dpr));
      let next = [];
      const sample = (st) => {
        const out = [];
        for (let y = 0; y < off.height; y += st) {
          for (let x = 0; x < off.width; x += st) {
            if (img[(y * off.width + x) * 4 + 3] > 130) {
              const hx = x / dpr;
              const hy = y / dpr;
              const accent = accentRanges.some((r) => hy >= r[0] && hy <= r[1]);
              out.push({
                hx,
                hy,
                x: hx + (Math.random() - 0.5) * 60,
                y: hy + 26 + Math.random() * 80,
                vx: 0,
                vy: 0,
                accent,
                ph: Math.random() * Math.PI * 2,
                delay: (hx / W) * 320 + Math.random() * 160,
              });
            }
          }
        }
        return out;
      };
      next = sample(step);
      while (next.length > MAX_PARTICLES) {
        step += 1;
        next = sample(step);
      }
      particles = next;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      startedAt = performance.now();
    };

    const frame = (t) => {
      raf = requestAnimationFrame(frame);
      if (!running) return;
      if (!lastT) lastT = t;
      let dt = (t - lastT) / 16.667;
      lastT = t;
      if (dt > 2.5) dt = 2.5;
      if (dt <= 0) dt = 1;

      const elapsed = t - startedAt;
      const dot = Math.max(1.4, W / 1100 + 1.4);
      const damp = Math.pow(DAMP, dt);

      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (elapsed > p.delay) {
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
        }
      }

      ctx.fillStyle = INK;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.accent) continue;
        const wob = Math.sin(t * 0.001 + p.ph) * 0.5;
        ctx.fillRect(p.x + wob, p.y - wob, dot, dot);
      }
      ctx.fillStyle = ACCENT;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.accent) continue;
        const wob = Math.sin(t * 0.001 + p.ph) * 0.5;
        ctx.fillRect(p.x + wob, p.y - wob, dot, dot);
      }

      if (shock) {
        shock.r += 26;
        shock.power *= 0.82;
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
      shock = {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        r: 8,
        power: 4.2,
      };
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

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(boot);
    } else {
      boot();
    }

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
    <div className={styles.wrap} ref={wrap}>
      <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
      <h1 className={styles.sr}>
        {ariaLabel || lines.map((l) => l.text).join(" ")}
      </h1>
    </div>
  );
}
