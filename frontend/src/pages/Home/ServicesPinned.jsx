import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import styles from "./ServicesPinned.module.css";

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

export default function ServicesPinned() {
  const root = useRef(null);
  const stage = useRef(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(1);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => "+=" + window.innerHeight * (ITEMS.length - 0.5),
        pin: stage.current,
        anticipatePin: 1,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);
          const i = Math.min(ITEMS.length - 1, Math.floor(p * ITEMS.length));
          setActive(i);
        },
      });
    }, root);

    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(id);
      ctx.revert();
    };
  }, []);

  return (
    <section className={styles.section} ref={root}>
      <div className={styles.stage} ref={stage}>
        <div className={`${styles.inner} shell`}>
          <header className={styles.head}>
            <span className="mono">02 — Xidmətlər</span>
            <p className={styles.headline}>
              Dörd addım, <span className={styles.ital}>bir sistem</span>.
            </p>
          </header>

          <div className={styles.body}>
            <div className={styles.numbers} aria-hidden="true">
              {ITEMS.map((it, i) => (
                <span
                  key={it.n}
                  className={`${styles.num} ${i === active ? styles.numOn : ""}`}
                >
                  {it.n}
                </span>
              ))}
            </div>

            <div className={styles.panels}>
              {ITEMS.map((it, i) => (
                <article
                  key={it.n}
                  className={`${styles.panel} ${i === active ? styles.panelOn : ""}`}
                >
                  <h3 className={styles.title}>{it.title}</h3>
                  <p className={styles.text}>{it.text}</p>
                  <ul className={styles.tags}>
                    {it.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.progress} aria-hidden="true">
            <span
              className={styles.progressFill}
              style={{ transform: `scaleX(${Math.max(0.02, progress)})` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
