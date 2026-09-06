import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { useReveal } from "../../lib/useReveal";
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

/* ---------- mobile: clean centred stack ---------- */
function ServicesMobile() {
  const ref = useReveal({ stagger: 0.1 });
  return (
    <section className={styles.section}>
      <div className={`${styles.mShell} shell`} ref={ref}>
        <header className={styles.mHead}>
          <span className={`mono reveal`}>02 — Xidmətlər</span>
          <p className={`${styles.mTitle} reveal`}>
            Dörd addım, <span className={styles.ital}>bir sistem</span>.
          </p>
        </header>

        <ol className={styles.mList}>
          {ITEMS.map((it) => (
            <li className={`${styles.mItem} reveal`} key={it.n}>
              <span className={styles.mN}>{it.n}</span>
              <h3 className={styles.mItemTitle}>{it.title}</h3>
              <p className={styles.mItemText}>{it.text}</p>
              <ul className={styles.mTags}>
                {it.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- desktop: sticky rail + rotating dial ---------- */
function ServicesDesktop() {
  const root = useRef(null);
  const gref = useRef(null);
  const [af, setAf] = useState(0);

  const cx = -210;
  const cy = 340;
  const r = 512;
  const step = 13;
  const nums = ITEMS.map((_, i) => {
    const ang = i * step * (Math.PI / 180);
    return {
      x: cx + (r - 44) * Math.cos(ang),
      y: cy + (r - 44) * Math.sin(ang),
      rot: i * step,
    };
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const total = (N - 1) * step;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          setAf(p * (N - 1));
          gsap.set(gref.current, { rotation: -p * total, svgOrigin: `${cx} ${cy}` });
        },
      });
    }, root);
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(id);
      ctx.revert();
    };
  }, []);

  const active = Math.round(af);

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
          <div className={styles.dialWrap}>
            <svg
              className={styles.dial}
              viewBox="0 0 340 680"
              preserveAspectRatio="xMinYMid slice"
              aria-hidden="true"
            >
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--rule-strong)" strokeWidth="1" />
              <g ref={gref}>
                {nums.map((p, i) => (
                  <text
                    key={i}
                    x={p.x}
                    y={p.y}
                    transform={`rotate(${p.rot} ${p.x} ${p.y})`}
                    textAnchor="end"
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
              <circle className={styles.dot} cx={cx + r} cy={cy} r="4.5" />
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

export default function ServicesArc() {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" && window.matchMedia(MQ).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(MQ);
    const on = () => setMobile(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return mobile ? <ServicesMobile /> : <ServicesDesktop />;
}
