import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import styles from "./WorkGallery.module.css";

const WORK = [
  { n: "01", name: "Nərgiz Kosmetika", cat: ["Şəxsi brend", "Reels"], field: "var(--field-1)", fg: "#f4f1e9", result: "3 ayda +48K izləyici" },
  { n: "02", name: "Baku Coffee Lab", cat: ["Strategiya", "Kontent"], field: "var(--field-2)", fg: "#f4f1e9", result: "Sifarişlərdə 2.1× artım" },
  { n: "03", name: "Studio Mās", cat: ["Vizual dil", "Satış qıfı"], field: "var(--field-3)", fg: "#17150f", result: "Ayda 120+ sorğu" },
  { n: "04", name: "Terra Wellness", cat: ["Kontent", "Analitika"], field: "var(--field-4)", fg: "#f4f1e9", result: "Kursda 340 qeydiyyat" },
  { n: "05", name: "Lumen Estetika", cat: ["Şəxsi brend", "Reels"], field: "var(--field-5)", fg: "#f4f1e9", result: "Reels-də 1.4M baxış" },
];

export default function WorkGallery() {
  const root = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const scrollLen = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -scrollLen(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + scrollLen(),
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} ref={root}>
      <div className={styles.head}>
        <span className="mono">02 — Seçilmiş işlər</span>
        <p className={styles.headline}>
          Nəticə ilə <span className={styles.ital}>ölçülən</span> layihələr.
        </p>
        <span className={`mono ${styles.hint}`}>Sürüşdür →</span>
      </div>

      <div className={styles.viewport}>
        <div className={styles.track} ref={trackRef}>
          {WORK.map((w) => (
            <article
              className={styles.card}
              key={w.n}
              style={{ background: w.field, color: w.fg }}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardN}>{w.n}</span>
                <span className={styles.cardResult}>{w.result}</span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{w.name}</h3>
                <ul className={styles.cardCats}>
                  {w.cat.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}

          <article className={`${styles.card} ${styles.cardEnd}`}>
            <p className={styles.endText}>
              Sənin brendin <span className={styles.ital}>növbəti</span> ola bilər.
            </p>
            <a
              href="https://www.instagram.com/leiylamammadly/"
              target="_blank"
              rel="noreferrer"
              className={styles.endLink}
            >
              İş birliyi →
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
