import { useEffect, useRef, useState } from "react";
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
  const markers = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number(e.target.dataset.i);
            setActive(i);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    markers.current.forEach((m) => m && io.observe(m));
    return () => io.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.track}>
        {ITEMS.map((_, i) => (
          <div
            key={i}
            className={styles.marker}
            data-i={i}
            ref={(el) => (markers.current[i] = el)}
          />
        ))}

        <div className={styles.stage}>
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
                    style={{ transform: `translateY(${(i - active) * 0.5}em)` }}
                  >
                    {it.n}
                  </span>
                ))}
              </div>

              <div className={styles.panels}>
                {ITEMS.map((it, i) => (
                  <article
                    key={it.n}
                    className={`${styles.panel} ${
                      i === active ? styles.panelOn : ""
                    }`}
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
                style={{ transform: `scaleX(${(active + 1) / ITEMS.length})` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
