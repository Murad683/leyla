import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import styles from "./ServicesArc.module.css";

const ITEMS = [
  {
    n: "01",
    title: "Strategiya",
    text: "Auditoriya, mövqeləndirmə və məzmun istiqaməti — hər qərarın arxasında ölçülə bilən məqsəd.",
    tags: ["Auditoriya", "Positioning", "Funnel"],
  },
  {
    n: "02",
    title: "Kontent",
    text: "Reels, karusel və hekayə formatları üçün ssenari, çəkiliş rejissurası və montaj rəhbərliyi.",
    tags: ["Ssenari", "Prodakşn", "Montaj"],
  },
  {
    n: "03",
    title: "Şəxsi brend",
    text: "Ekspert obrazının qurulması: ton, vizual dil və daimi mövzu xətti.",
    tags: ["Ton", "Vizual", "Rubrika"],
  },
  {
    n: "04",
    title: "Satış",
    text: "Məzmunu gəlirə bağlayan sistem — lead axını, offer strukturu və konversiya təhlili.",
    tags: ["Lead", "Offer", "Analitika"],
  },
];

const N = ITEMS.length;
const MQ = "(max-width: 900px)";
const D2R = Math.PI / 180;

export default function ServicesArc() {
  const root = useRef(null);
  const gref = useRef(null);
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" && window.matchMedia(MQ).matches
  );
  const [af, setAf] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia(MQ);
    const on = () => setMobile(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const geo = useMemo(() => {
    if (mobile) {
      // circle far below the viewport -> only a shallow top arc shows;
      // numbers sweep horizontally under a dot fixed at top-centre
      const cx = 180;
      const cy = 760;
      const r = 700;
      const step = 9; // deg between numbers
      const nums = ITEMS.map((_, i) => {
        const a = (-90 + i * step) * D2R;
        return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), rot: i * step };
      });
      return {
        vb: { w: 360, h: 132 },
        preserve: "xMidYMin slice",
        cx,
        cy,
        r,
        step,
        dot: { x: cx, y: 30 },
        nums,
      };
    }
    // desktop: circle off to the left -> vertical arc on the right edge
    const cx = -210;
    const cy = 340;
    const r = 512;
    const step = 13;
    const nums = ITEMS.map((_, i) => {
      const a = i * step * D2R;
      return {
        x: cx + (r - 44) * Math.cos(a),
        y: cy + (r - 44) * Math.sin(a),
        rot: i * step,
      };
    });
    return {
      vb: { w: 340, h: 680 },
      preserve: "xMinYMid slice",
      cx,
      cy,
      r,
      step,
      dot: { x: cx + r, y: cy },
      nums,
    };
  }, [mobile]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAf(0);
      return;
    }
    const total = (N - 1) * geo.step;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          setAf(p * (N - 1));
          gsap.set(gref.current, {
            rotation: -p * total,
            svgOrigin: `${geo.cx} ${geo.cy}`,
          });
        },
      });
    }, root);
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(id);
      ctx.revert();
    };
  }, [geo]);

  const active = Math.round(af);

  return (
    <section className={`${styles.section} ${mobile ? styles.isMobile : ""}`} ref={root}>
      <div className={`${styles.grid} shell`}>
        <div className={styles.rail}>
          <div className={styles.railHead}>
            <span className="mono">02 — Xidmətlər</span>
            <p className={styles.railTitle}>
              Dörd addım, <span className={styles.ital}>bir sistem</span>.
            </p>
          </div>

          <div className={styles.dialWrap}>
            <svg
              className={styles.dial}
              viewBox={`0 0 ${geo.vb.w} ${geo.vb.h}`}
              preserveAspectRatio={geo.preserve}
              aria-hidden="true"
            >
              <circle
                cx={geo.cx}
                cy={geo.cy}
                r={geo.r}
                fill="none"
                stroke="var(--rule-strong)"
                strokeWidth="1"
              />
              <g ref={gref}>
                {geo.nums.map((p, i) => (
                  <g key={i} transform={`rotate(${p.rot} ${p.x} ${p.y})`}>
                    {mobile && (
                      <rect
                        x={p.x - 30}
                        y={p.y - 24}
                        width="60"
                        height="48"
                        fill="var(--paper-raised)"
                      />
                    )}
                    <text
                      x={p.x}
                      y={p.y}
                      textAnchor={mobile ? "middle" : "end"}
                      dominantBaseline="middle"
                      className={styles.num}
                      style={{
                        fill: i === active ? "var(--ink)" : "var(--ink-faint)",
                        opacity: Math.max(0.12, 1 - Math.abs(i - af) * 0.55),
                      }}
                    >
                      {ITEMS[i].n}
                    </text>
                  </g>
                ))}
              </g>
              <circle className={styles.dot} cx={geo.dot.x} cy={geo.dot.y} r="4.5" />
            </svg>
          </div>
        </div>

        <div className={styles.content}>
          {ITEMS.map((it, i) => (
            <article
              key={it.n}
              className={`${styles.card} ${i === active ? styles.on : ""}`}
            >
              <span className={styles.cardN}>{it.n}</span>
              <h3 className={styles.cardTitle}>{it.title}</h3>
              <p className={styles.cardText}>{it.text}</p>
              <ul className={styles.tags}>
                {it.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
