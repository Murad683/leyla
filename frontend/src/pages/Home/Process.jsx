import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { useHomeContent } from "../../lib/useContent";
import styles from "./Process.module.css";

const DEFAULTS = {
  processEyebrow: "04 — Necə işləyirik",
  processHeadline: "Kaosdan aydınlığa — üç mərhələ.",
  processSteps: [
    {
      title: "Kəşf",
      text: "Biznesin, auditoriyan və rəqiblərin dərin təhlili. Harada olduğunu dəqiq bilmədən hara gedəcəyini planlaya bilmərik.",
      tags: ["Audit", "Auditoriya", "Rəqib təhlili"],
    },
    {
      title: "Sistem",
      text: "Mövqeləndirmə, məzmun sütunları, vizual dil və satış qıfı — hamısı sənədləşdirilmiş bir plan halında.",
      tags: ["Positioning", "Rubrikalar", "Qıf"],
    },
    {
      title: "İcra",
      text: "Həftəlik kontent ritmi, çəkiliş rejissurası, montaj standartı və rəqəmlərə görə davamlı düzəliş.",
      tags: ["Ritm", "Prodakşn", "Optimizasiya"],
    },
  ],
};

/** Split a headline like "Kaosdan aydınlığa — üç mərhələ." so the part after
 *  the em-dash renders italic, matching the original design. */
function Headline({ text }) {
  const i = text.indexOf("—");
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i + 1)} <span className={styles.ital}>{text.slice(i + 1).trim()}</span>
    </>
  );
}

export default function Process() {
  const root = useRef(null);
  const pin = useRef(null);
  const { processEyebrow, processHeadline, processSteps } = useHomeContent(DEFAULTS);
  const STEPS = (Array.isArray(processSteps) && processSteps.length
    ? processSteps
    : DEFAULTS.processSteps
  ).map((s, i) => ({ ...s, n: String(i + 1).padStart(2, "0") }));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(`.${styles.card}`);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * (cards.length - 0.3),
          scrub: 0.5,
          pin: pin.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, i) => {
        if (i === 0) return;
        tl.fromTo(
          card,
          { yPercent: 110, rotate: 1.4 },
          { yPercent: 0, rotate: 0, ease: "none" },
          i - 1
        );
        tl.to(
          cards[i - 1],
          { scale: 0.93, yPercent: -4, opacity: 0.4, ease: "none" },
          i - 1
        );
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
      <div className={styles.pin} ref={pin}>
        <div className={`${styles.inner} shell`}>
          <header className={styles.head}>
            <span className="mono">{processEyebrow}</span>
            <p className={styles.headline}>
              <Headline text={processHeadline} />
            </p>
          </header>

          <div className={styles.stack}>
            {STEPS.map((s, i) => (
              <article className={styles.card} key={s.n} style={{ zIndex: i + 1 }}>
                <div className={styles.cardTop}>
                  <span className={styles.cardN}>{s.n}</span>
                  <span className="mono">
                    Mərhələ {i + 1} / {STEPS.length}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{s.title}</h3>
                <p className={styles.cardText}>{s.text}</p>
                <ul className={styles.tags}>
                  {s.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
