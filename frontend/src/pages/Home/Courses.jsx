import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import Marquee from "../../components/Marquee/Marquee";
import FlowCanvas from "../../components/FlowCanvas/FlowCanvas";
import { useCourses, useHomeContent } from "../../lib/useContent";
import styles from "./Courses.module.css";

const WARM = ["244,201,120", "214,120,58", "205,162,120"];

const DEFAULT_COURSES = [
  { title: "SMM Sistemi", desc: "Sıfırdan strategiya, kontent və satış qıfı. Auditoriyanı oxumaq, offer qurmaq və nəticəni rəqəmlə izləmək.", meta: "6 həftə · canlı" },
  { title: "Reels Laboratoriyası", desc: "Ssenari, çəkiliş rejissurası, montaj standartı və trend oxuma. Hər həftə yeni format, hər format üçün şablon.", meta: "3 həftə · praktiki" },
  { title: "Şəxsi Brend Intensiv", desc: "Ekspert obrazı, mövqeləndirmə və daimi mövzu xətti. İki həftəlik sprint - sonunda hazır kontent planı.", meta: "2 həftə · sprint" },
];

export default function Courses() {
  const root = useRef(null);
  const list = useRef(null);
  const [p, setP] = useState(0);

  const COURSES = useCourses(DEFAULT_COURSES);
  const { coursesEyebrow, coursesHeadline } = useHomeContent({
    coursesEyebrow: "05 - Kurslar",
    coursesHeadline: "Öyrən, tətbiq et, satışa çevir.",
  });
  const H_WORDS = coursesHeadline.split(/\s+/).filter(Boolean);

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
          start: "top 80%",
          end: "top 38%",
          scrub: true,
        },
      });

      ScrollTrigger.create({
        trigger: list.current,
        start: "top 64%",
        end: "bottom 64%",
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
          <span className="mono">{coursesEyebrow}</span>
          <h2 className={styles.headline} aria-label={coursesHeadline}>
            {H_WORDS.map((w, i) => (
              <span className={styles.hMask} key={i}>
                <span
                  className={`${styles.hWord} ${
                    i >= H_WORDS.length - 2 ? styles.accent : ""
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
                key={c.title || i}
                className={`${styles.item} ${i === active ? styles.open : ""}`}
              >
                <span className={styles.itemN}>{String(i + 1).padStart(2, "0")}</span>
                <div className={styles.itemMain}>
                  <div className={styles.itemHead}>
                    <h3 className={styles.itemT}>{c.title}</h3>
                    <span className="mono">{c.meta}</span>
                  </div>
                  <div className={styles.itemReveal}>
                    <p className={styles.itemD}>{c.desc}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.ctaRow}>
          <p className={styles.ctaText}>Növbəti axın üçün qeydiyyat açıqdır.</p>
          <Link to="/elaqe" className={styles.cta}>
            Qeydiyyatdan keç
          </Link>
        </div>
      </div>
    </section>
  );
}
