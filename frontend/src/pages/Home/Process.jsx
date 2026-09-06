import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { useReveal } from "../../lib/useReveal";
import styles from "./Process.module.css";

const STEPS = [
  {
    n: "01",
    title: "Kəşf",
    text: "Biznesin, auditoriyan və rəqiblərin dərin təhlili. Harada olduğunu dəqiq bilmədən hara gedəcəyini planlaya bilmərik.",
    tags: ["Audit", "Auditoriya", "Rəqib təhlili"],
  },
  {
    n: "02",
    title: "Sistem",
    text: "Mövqeləndirmə, məzmun sütunları, vizual dil və satış qıfı — hamısı sənədləşdirilmiş bir plan halında.",
    tags: ["Positioning", "Rubrikalar", "Qıf"],
  },
  {
    n: "03",
    title: "İcra",
    text: "Həftəlik kontent ritmi, çəkiliş rejissurası, montaj standartı və rəqəmlərə görə davamlı düzəliş.",
    tags: ["Ritm", "Prodakşn", "Optimizasiya"],
  },
];

const MQ = "(max-width: 860px)";

function ProcessMobile() {
  const ref = useReveal({ stagger: 0.1 });
  return (
    <section className={styles.section}>
      <div className={`${styles.mShell} shell`} ref={ref}>
        <header className={styles.mHead}>
          <span className="mono reveal">04 — Necə işləyirik</span>
          <p className={`${styles.mHeadline} reveal`}>
            Kaosdan aydınlığa — <span className={styles.ital}>üç mərhələ</span>.
          </p>
        </header>

        <ol className={styles.mList}>
          {STEPS.map((s, i) => (
            <li className={`${styles.mCard} reveal`} key={s.n}>
              <span className={styles.mN}>{s.n}</span>
              <span className={`mono ${styles.mStage}`}>
                Mərhələ {i + 1} / {STEPS.length}
              </span>
              <h3 className={styles.mTitle}>{s.title}</h3>
              <p className={styles.mText}>{s.text}</p>
              <ul className={styles.mTags}>
                {s.tags.map((t) => (
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

function ProcessDesktop() {
  const root = useRef(null);
  const pin = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(`.${styles.card}`);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * (cards.length - 0.35),
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
          { yPercent: 108, rotate: 1.5 },
          { yPercent: 0, rotate: 0, ease: "none" },
          i - 1
        );
        tl.to(
          cards[i - 1],
          { scale: 0.92, yPercent: -5, opacity: 0.35, ease: "none" },
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
            <span className="mono">04 — Necə işləyirik</span>
            <p className={styles.headline}>
              Kaosdan aydınlığa — <span className={styles.ital}>üç mərhələ</span>.
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

export default function Process() {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" && window.matchMedia(MQ).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(MQ);
    const on = () => setMobile(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return mobile ? <ProcessMobile /> : <ProcessDesktop />;
}
