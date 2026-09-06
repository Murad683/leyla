import { useEffect, useRef } from "react";
import styles from "./FlowField.module.css";

/**
 * Hero background: a single full-screen WebGL fragment shader that
 * renders a slowly drifting field of warm paper tones with a terracotta
 * whisper (the site palette: #f4f2ee / #c9a24b / #b8452b). The flow
 * bends gently toward the cursor with an eased delay — no swirl, no
 * doodles. One draw call, ~0.7x resolution, DPR capped. Pauses when
 * off-screen or the tab is hidden; static single frame for reduced
 * motion; a soft 2D gradient when WebGL is unavailable.
 *
 * Drop-in replacement for <FlowField />.
 */
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 c0, c1, c2, c3;
uniform float uMix, uAmp;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1, 0)), cc = hash(i + vec2(0, 1)), d = hash(i + vec2(1, 1));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (cc - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = uv;
  float ar = uRes.x / uRes.y;
  p.x *= ar;
  float t = uTime * 0.069;
  vec2 m = uMouse; m.x *= ar;
  vec2 toM = m - p;
  float md = length(toM);
  vec2 drift = vec2(t * 0.42, -t * 0.22);
  vec2 warp = vec2(
    fbm(p * 1.5 + vec2(t * 1.1, -t * 0.8) + drift),
    fbm(p * 1.5 + vec2(-t * 0.9, t * 0.6) + drift + 3.1)
  );
  warp += toM * 0.16 * exp(-md * 1.5);
  float f = fbm(p * 1.35 + warp * 1.7 * uAmp + drift + vec2(t * 0.6, t * 0.25));
  f = smoothstep(0.16, 0.92, f);
  float pool = exp(-md * 2.4) * 0.06;
  vec3 col = mix(c0, c1, smoothstep(0.0, 0.53, f));
  col = mix(col, c2, smoothstep(0.44, 0.82, f));
  col = mix(col, c3, smoothstep(0.8, 1.0, f) * 0.44);
  col = mix(c0, col, uMix);
  col += pool;
  gl_FragColor = vec4(col, 1.0);
}
`;
const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}";

/* The public site is light-only — one fixed warm-neutral palette,
   drawn from the site tokens: #f4f2ee (paper) / #c9a24b (ochre) /
   #b8452b (terracotta accent). Kept deliberately pale so the type
   always leads. */
const PAL = {
  c0: [0.960, 0.953, 0.939],
  c1: [0.936, 0.905, 0.845],
  c2: [0.868, 0.775, 0.560],
  c3: [0.772, 0.360, 0.255],
  mix: 0.4,
  amp: 0.92,
};

export default function FlowGradient() {
  const host = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    const el = host.current;
    const cv = canvas.current;
    if (!el || !cv) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const SCALE = 0.7;
    let W = 0;
    let H = 0;
    let raf = 0;
    let running = true;
    let simTime = 12;
    let last = performance.now();
    const mouse = { x: 0.5, y: 0.55 };
    const target = { x: 0.5, y: 0.55 };

    const gl = cv.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });

    /* ---------- 2D fallback ---------- */
    if (!gl) {
      const ctx = cv.getContext("2d");
      const P = PAL;
      const paint = () => {
        const w = cv.width;
        const h = cv.height;
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, rgb(P.c0));
        g.addColorStop(1, rgb(P.c1));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        const rg = ctx.createRadialGradient(
          mouse.x * w, mouse.y * h, 0,
          mouse.x * w, mouse.y * h, Math.max(w, h) * 0.6
        );
        rg.addColorStop(0, rgba(P.c3, 0.08));
        rg.addColorStop(1, rgba(P.c3, 0));
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, w, h);
      };
      const sizeFallback = () => {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        W = el.clientWidth;
        H = el.clientHeight;
        cv.width = Math.max(1, Math.round(W * dpr * SCALE));
        cv.height = Math.max(1, Math.round(H * dpr * SCALE));
        paint();
      };
      sizeFallback();
      const onMoveF = (e) => {
        const r = cv.getBoundingClientRect();
        target.x = (e.clientX - r.left) / r.width;
        target.y = (e.clientY - r.top) / r.height;
      };
      const loopF = () => {
        raf = requestAnimationFrame(loopF);
        if (!running) return;
        mouse.x += (target.x - mouse.x) * 0.05;
        mouse.y += (target.y - mouse.y) * 0.05;
        paint();
      };
      let rtF;
      const onResizeF = () => {
        clearTimeout(rtF);
        rtF = setTimeout(sizeFallback, 150);
      };
      const roF = new ResizeObserver(onResizeF);
      roF.observe(el);
      window.addEventListener("mousemove", onMoveF);
      if (!reduce) raf = requestAnimationFrame(loopF);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(rtF);
        roF.disconnect();
        window.removeEventListener("mousemove", onMoveF);
      };
    }

    /* ---------- WebGL ---------- */
    const compile = (src, type) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(VERT, gl.VERTEX_SHADER));
    gl.attachShader(prog, compile(FRAG, gl.FRAGMENT_SHADER));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uMouse = u("uMouse");
    const uc0 = u("c0");
    const uc1 = u("c1");
    const uc2 = u("c2");
    const uc3 = u("c3");
    const uMix = u("uMix");
    const uAmp = u("uAmp");

    gl.uniform3fv(uc0, PAL.c0);
    gl.uniform3fv(uc1, PAL.c1);
    gl.uniform3fv(uc2, PAL.c2);
    gl.uniform3fv(uc3, PAL.c3);
    gl.uniform1f(uMix, PAL.mix);
    gl.uniform1f(uAmp, PAL.amp);

    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(1, Math.round(el.clientWidth * dpr * SCALE));
      H = Math.max(1, Math.round(el.clientHeight * dpr * SCALE));
      cv.width = W;
      cv.height = H;
      gl.viewport(0, 0, W, H);
      gl.uniform2f(uRes, W, H);
    };

    const render = (time) => {
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, 1.0 - mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!running) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      simTime += dt;
      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;
      render(simTime);
    };

    const onMove = (e) => {
      const r = cv.getBoundingClientRect();
      if (!r.width || !r.height) return;
      target.x = (e.clientX - r.left) / r.width;
      target.y = (e.clientY - r.top) / r.height;
    };
    const onLeave = () => {
      target.x = 0.5;
      target.y = 0.55;
    };
    let rt;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(size, 150);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(el);
    const io = new IntersectionObserver(([en]) => {
      running = en.isIntersecting && !document.hidden;
    });
    const onVis = () => {
      running = !document.hidden;
      last = performance.now();
    };

    size();
    io.observe(cv);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    document.addEventListener("visibilitychange", onVis);

    if (reduce) {
      render(simTime);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, []);

  return (
    <div className={styles.host} ref={host} aria-hidden="true">
      <canvas ref={canvas} className={styles.canvas} />
    </div>
  );
}

function rgb(a) {
  return "rgb(" + ((a[0] * 255) | 0) + "," + ((a[1] * 255) | 0) + "," + ((a[2] * 255) | 0) + ")";
}
function rgba(a, al) {
  return "rgba(" + ((a[0] * 255) | 0) + "," + ((a[1] * 255) | 0) + "," + ((a[2] * 255) | 0) + "," + al + ")";
}
