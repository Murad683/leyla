import { useEffect, useRef } from "react";
import styles from "./FlowCanvas.module.css";

/**
 * Full-bleed flowing "aurora": soft colour fields that drift and morph
 * on their own (video-like) and lean toward the cursor, with a bright
 * bloom trailing the pointer. Rendered at low res + upscaled for a soft
 * blur. A centre scrim keeps overlaid content legible.
 *
 * props:
 *   base    - solid background colour (hex)
 *   palette - array of "r,g,b" strings for the drifting fields
 *   scrim   - "r,g,b" for the centre readability wash (defaults to base-ish)
 *   bloom   - "r,g,b" for the cursor bloom
 *   opacity - overall field opacity 0..1 (default 0.8)
 *   scrimStrength - 0..1 centre wash strength (default 0.55)
 *   blend   - "multiply" for light bases, "screen" for dark bases
 */
export default function FlowCanvas({
  base = "#f2eee4",
  palette = ["244,201,120", "214,120,58", "176,58,38"],
  scrim = "244,241,233",
  bloom = "255,244,214",
  opacity = 0.8,
  scrimStrength = 0.55,
  blend = "multiply",
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
    let lastT = 0;
    const mouse = { x: -9999, y: -9999, ex: 0.5, ey: 0.5 };

    const aur = document.createElement("canvas");
    const actx = aur.getContext("2d");
    const AW = 240;
    let AH = 140;

    const blobs = palette.map((c, i) => ({
      c,
      x: 0.22 + (i / palette.length) * 0.6 + (i % 2 ? 0.08 : -0.05),
      y: 0.3 + (i % 3) * 0.22,
      r: 0.42 + ((i * 7) % 5) * 0.05,
      sx: 0.00016 + i * 0.00003,
      sy: 0.0002 + ((i * 3) % 5) * 0.00002,
      px: i * 1.7,
      py: i * 0.9 + 0.5,
    }));

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
      AH = Math.round((AW * H) / W);
      aur.width = AW;
      aur.height = AH;
    };

    const frame = (t) => {
      raf = requestAnimationFrame(frame);
      if (!running) return;
      if (!lastT) lastT = t;
      let dt = (t - lastT) / 16.667;
      lastT = t;
      if (dt > 2.6 || dt <= 0) dt = 1;

      mouse.ex += ((mouse.x < 0 ? 0.5 : mouse.x / W) - mouse.ex) * 0.05 * dt;
      mouse.ey += ((mouse.y < 0 ? 0.5 : mouse.y / H) - mouse.ey) * 0.05 * dt;

      actx.globalCompositeOperation = "source-over";
      actx.fillStyle = base;
      actx.fillRect(0, 0, AW, AH);
      actx.globalCompositeOperation = blend;
      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        const dx = Math.sin(t * b.sx + b.px) * 0.26;
        const dy = Math.cos(t * b.sy + b.py) * 0.24;
        const lean = i % 2 ? 0.2 : -0.14;
        const cx = (b.x + dx + (mouse.ex - 0.5) * lean) * AW;
        const cy = (b.y + dy + (mouse.ey - 0.5) * lean) * AH;
        const rad = b.r * AW * (0.85 + Math.sin(t * 0.0004 + b.px) * 0.22);
        const g = actx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, `rgba(${b.c},0.82)`);
        g.addColorStop(0.5, `rgba(${b.c},0.32)`);
        g.addColorStop(1, `rgba(${b.c},0)`);
        actx.fillStyle = g;
        actx.beginPath();
        actx.arc(cx, cy, rad, 0, Math.PI * 2);
        actx.fill();
      }
      const bx = mouse.ex * AW;
      const by = mouse.ey * AH;
      const br = AW * 0.32;
      const bg = actx.createRadialGradient(bx, by, 0, bx, by, br);
      bg.addColorStop(0, `rgba(${bloom},0.42)`);
      bg.addColorStop(1, `rgba(${bloom},0)`);
      actx.globalCompositeOperation = "screen";
      actx.fillStyle = bg;
      actx.beginPath();
      actx.arc(bx, by, br, 0, Math.PI * 2);
      actx.fill();
      actx.globalCompositeOperation = "source-over";

      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = opacity;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(aur, 0, 0, AW, AH, 0, 0, W, H);
      ctx.globalAlpha = 1;

      const sc = ctx.createRadialGradient(
        W / 2,
        H / 2,
        0,
        W / 2,
        H / 2,
        Math.min(W, H) * 0.62
      );
      sc.addColorStop(0, `rgba(${scrim},${scrimStrength})`);
      sc.addColorStop(0.55, `rgba(${scrim},${scrimStrength * 0.5})`);
      sc.addColorStop(1, `rgba(${scrim},0)`);
      ctx.fillStyle = sc;
      ctx.fillRect(0, 0, W, H);
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
      rt = setTimeout(build, 160);
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
  }, [base, palette, scrim, bloom, opacity, scrimStrength, blend]);

  return (
    <div className={styles.host} ref={host} aria-hidden="true">
      <canvas ref={canvas} className={styles.canvas} />
    </div>
  );
}
