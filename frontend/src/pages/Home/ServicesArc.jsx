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

export default function ServicesArc() {
  const root = useRef(null);
  const gref = useRef(null);
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" && window.matchMedia("(max-width: 920px)").matches
  );
  const [af, setAf] = useState(0); // active float 0..N-1

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 920px)");
    const on = () => setMobile(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const geo = useMemo(() => {
    if (mobile) {
      const vb = { w: 340, h: 116 };
      const cx = 170;
      const cy = 980;
      const r = 902;
      const step = 8.5; // deg between numbers
      const dot = { x: cx, y: 34 };
      const nums = ITEMS.map((_, i) => {
        const ang = (-90 + i * step) * (Math.PI / 180);
        return {
          x: cx + (r - 8) * Math.cos(ang),
          y: cy + (r - 8) * Math.sin(ang),
          rot: -90 + i * step + 90,
        };
      });
      return { vb, cx, cy, r, step, dot, nums };
    }
    const vb = { w: 340, h: 680 };
    const cx = -210;
    const cy = 340;
    const r = 512;
    const step = 13;
    const dot = { x: cx + r, y: cy };
    const nums = ITEMS.map((_, i) => {
      const ang = (i * step) * (Math.PI / 180);
      return {
        x: cx + (r - 44) * Math.cos(ang),
        y: cy + (r - 44) * Math.sin(ang),
        rot: i * step,
      };
    });
    return { vb, cx, cy, r, step, dot, nums };
  }, [mobile]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setAf(0);
      return;
    }
    const total = (N - 1) * geo.step;
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
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
      return () => st.kill();
    }, root);
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(id);
      ctx.revert();
    };
  }, [geo]);

  const active = Math.round(af);

  const Dial = (
    <svg
      className={styles.dial}
      viewBox={`0 0 ${geo.vb.w} ${geo.vb.h}`}
      preserveAspectRatio={mobile ? "xMidYMin slice" : "xMinYMid slice"}
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
          <text
            key={i}
            x={p.x}
            y={p.y}
            transform={`rotate(${p.rot} ${p.x} ${p.y})`}
            textAnchor={mobile ? "middle" : "end"}
            dominantBaseline="middle"
            className={styles.num}
            style={{
              fill: i === active ? "var(--ink)" : "var(--ink-faint)",
              opacity: Math.max(0.14, 1 - Math.abs(i - af) * 0.5),
            }}
          >
            {ITEMS[i].n}
          </text>
        ))}
      </g>
      <circle className={styles.dot} cx={geo.dot.x} cy={geo.dot.y} r="4.5" />
    </svg>
  );

  return (
    <section className={styles.section} ref={root}>
      <div className={`${styles.grid} shell`}>
        <div className={styles.rail}>
          <div className={styles.railHead}>
            <span className="mono">02 — Xidmətlər</span>
            <p className={styles.railTitle}>
              Dörd addım, <span className={styles.ital}>bir sistem</span>.
            </p>
          </div>
          <div className={styles.dialWrap}>{Dial}</div>
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
