import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { useReveal } from "../../lib/useReveal";
import Marquee from "../../components/Marquee/Marquee";
import FlowCanvas from "../../components/FlowCanvas/FlowCanvas";
import styles from "./Courses.module.css";

const WARM = ["244,201,120", "214,120,58", "205,162,120"];
const MQ = "(max-width: 760px)";

const COURSES = [
  {
    t: "SMM Sistemi",
    d: "Sıfırdan strategiya, kontent və satış qıfı. Auditoriyanı oxumaq, offer qurmaq və nəticəni rəqəmlə izləmək.",
    meta: "6 həftə · canlı",
  },
  {
    t: "Reels Laboratoriyası",
    d: "Ssenari, çəkiliş rejissurası, montaj standartı və trend oxuma. Hər həftə yeni format, hər format üçün şablon.",
    meta: "3 həftə · praktiki",
  },
  {
    t: "Şəxsi Brend Intensiv",
    d: "Ekspert obrazı, mövqeləndirmə və daimi mövzu xətti. İki həftəlik sprint — sonunda hazır kontent planı.",
    meta: "2 həftə · sprint",
  },
];

const H_WORDS = ["Öyrən,", "tətbiq", "et,", "satışa", "çevir."];

function Frame({ children }) {
  return (
    <section className={styles.section}>
      <FlowCanvas
        palette={WARM}
        base="#f4f2ee"
        scrim="247,246,244"
        bloom="255,244,214"
        opacity={0.4}
        scrimStrength={0.62}
        blend="multiply"
      />
      <Marquee
        items={["Kurslar", "Canlı dərslər", "Praktiki tapşırıq", "İcma", "Sertifikat"]}
        speed={24}
      />
      {children}
    </section>
  );
}

function Cta() {
  return (
    <div className={`${styles.ctaRow} reveal`}>
      <p className={styles.ctaText}>Növbəti axın üçün qeydiyyat açıqdır.</p>
      <a
        href="https://www.instagram.com/leiylamammadly/"
        target="_blank"
        rel="noreferrer"
        className={styles.cta}
      >
        Qeydiyyatdan keç
      </a>
    </div>
  );
}

/* ---------- mobile: centred reveal stack ---------- */
function CoursesMobile() {
  const ref = useReveal({ stagger: 0.12 });
  return (
    <Frame>
      <div className={`${styles.inner} shell`} ref={ref}>
        <div className={styles.top}>
          <span className="mono reveal">05 — Kurslar</span>
          <h2 className={`${styles.headline} reveal`}>
            Öyrən, tətbiq et, <span className={styles.accent}>satışa çevir</span>.
          </h2>
        </div>

        <ul className={styles.mList}>
          {COURSES.map((c, i) => (
            <li className={`${styles.mItem} reveal`} key={c.t}>
              <span className={styles.mN}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.mT}>{c.t}</h3>
              <span className={`mono ${styles.mMeta}`}>{c.meta}</span>
              <p className={styles.mD}>{c.d}</p>
            </li>
          ))}
        </ul>

        <Cta />
      </div>
    </Frame>
  );
}

/* ---------- desktop: scroll accordion ---------- */
function CoursesDesktop() {
  const root = useRef(null);
  const list = useRef(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(0.001);
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.hWord}`, {
        yPercent: 110,
        opacity: 0,
        filter: "blur(10px)",
        stagger: 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top 78%",
          end: "top 34%",
          scrub: true,
        },
      });
      ScrollTrigger.create({
        trigger: list.current,
        start: "top 62%",
        end: "bottom 62%",
        scrub: true,
        onUpdate: (self) => setP(self.progress),
      });
    }, root);
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(id);
      ctx.revert();
    };
  }, []);

  const active = Math.min(COURSES.length - 1, Math.floor(p * COURSES.length));

  return (
    <section className={styles.section} ref={root}>
      <FlowCanvas
        palette={WARM}
        base="#f4f2ee"
        scrim="247,246,244"
        bloom="255,244,214"
        opacity={0.4}
        scrimStrength={0.62}
        blend="multiply"
      />
      <Marquee
        items={["Kurslar", "Canlı dərslər", "Praktiki tapşırıq", "İcma", "Sertifikat"]}
        speed={24}
      />

      <div className={`${styles.inner} shell`}>
        <div className={styles.top}>
          <span className="mono">05 — Kurslar</span>
          <h2 className={styles.headline} aria-label="Öyrən, tətbiq et, satışa çevir.">
            {H_WORDS.map((w, i) => (
              <span className={styles.hMask} key={i}>
                <span
                  className={`${styles.hWord} ${
                    w === "satışa" || w === "çevir." ? styles.accent : ""
                  }`}
                >
                  {w}&nbsp;
                </span>
              </span>
            ))}
          </h2>
        </div>

        <div className={styles.body}>
          <div className={styles.rail} aria-hidden="true">
            <span className={styles.railFill} style={{ height: `${p * 100}%` }} />
            <span className={styles.railDot} style={{ top: `${p * 100}%` }} />
          </div>

          <ul className={styles.list} ref={list}>
            {COURSES.map((c, i) => (
              <li
                key={c.t}
                className={`${styles.item} ${i === active ? styles.open : ""}`}
              >
                <span className={styles.itemN}>{String(i + 1).padStart(2, "0")}</span>
                <div className={styles.itemMain}>
                  <div className={styles.itemHead}>
                    <h3 className={styles.itemT}>{c.t}</h3>
                    <span className="mono">{c.meta}</span>
                  </div>
                  <div className={styles.itemReveal}>
                    <p className={styles.itemD}>{c.d}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Cta />
      </div>
    </section>
  );
}

export default function Courses() {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" && window.matchMedia(MQ).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(MQ);
    const on = () => setMobile(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return mobile ? <CoursesMobile /> : <CoursesDesktop />;
}
