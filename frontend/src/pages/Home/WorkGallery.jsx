import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { usePortfolio } from "../../lib/useContent";
import styles from "./WorkGallery.module.css";

const DEFAULT_WORK = [
  { n: "01", name: "Nərgiz Kosmetika", cats: ["Şəxsi brend", "Reels"], img: "/work-1.webp", tint: "var(--field-1)", result: "3 ayda +48K izləyici" },
  { n: "02", name: "Baku Coffee Lab", cats: ["Strategiya", "Kontent"], img: "/work-2.webp", tint: "var(--field-2)", result: "Sifarişlərdə 2.1× artım" },
  { n: "03", name: "Studio Mās", cats: ["Vizual dil", "Satış qıfı"], img: "/work-3.webp", tint: "var(--field-3)", result: "Ayda 120+ sorğu" },
  { n: "04", name: "Terra Wellness", cats: ["Kontent", "Analitika"], img: "/work-4.webp", tint: "var(--field-4)", result: "Kursda 340 qeydiyyat" },
  { n: "05", name: "Lumen Estetika", cats: ["Şəxsi brend", "Reels"], img: "/work-5.webp", tint: "var(--field-5)", result: "Reels-də 1.4M baxış" },
];

export default function WorkGallery() {
  const root = useRef(null);
  const WORK = usePortfolio(DEFAULT_WORK);
  const pinWrap = useRef(null);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const distance = () => {
        const track = trackRef.current;
        const vp = viewportRef.current;
        if (!track || !vp) return 0;
        return Math.max(0, track.scrollWidth - vp.clientWidth);
      };

      gsap.to(trackRef.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + distance(),
          pin: pinWrap.current,
          anticipatePin: 1,
          scrub: 0.5,
          invalidateOnRefresh: true,
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
      <div className={styles.pinWrap} ref={pinWrap}>
        <div className={styles.head}>
          <span className="mono">02 — Seçilmiş işlər</span>
          <p className={styles.headline}>
            Nəticə ilə <span className={styles.ital}>ölçülən</span> layihələr.
          </p>
          <span className={`mono ${styles.hint}`}>Sürüşdür →</span>
        </div>

        <div className={styles.viewport} ref={viewportRef}>
          <div className={styles.track} ref={trackRef}>
            {WORK.map((w) => (
              <article className={styles.card} key={w.n}>
                <div
                  className={styles.cardMedia}
                  style={{ backgroundImage: `url(${w.img})` }}
                />
                <div
                  className={styles.cardTint}
                  style={{ background: w.tint }}
                />
                <div className={styles.cardTop}>
                  <span className={styles.cardN}>{w.n}</span>
                  <span className={styles.cardResult}>{w.result}</span>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardName}>{w.name}</h3>
                  <ul className={styles.cardCats}>
                    {(w.cats || []).map((c) => (
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
              <Link to="/elaqe" className={styles.endLink}>
                İş birliyi →
              </Link>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
