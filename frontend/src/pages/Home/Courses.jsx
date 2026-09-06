import { useReveal } from "../../lib/useReveal";
import Marquee from "../../components/Marquee/Marquee";
import FlowCanvas from "../../components/FlowCanvas/FlowCanvas";
import styles from "./Courses.module.css";

const WARM = ["244,201,120", "214,120,58", "205,162,120"];

const COURSES = [
  { t: "SMM Sistemi", d: "Sıfırdan strategiya, kontent və satış qıfı. 6 həftə, canlı." },
  { t: "Reels Laboratoriyası", d: "Ssenari, çəkiliş, montaj və trend oxuma. 3 həftə." },
  { t: "Şəxsi Brend Intensiv", d: "Ekspert obrazı və mövqeləndirmə. 2 həftəlik sprint." },
];

export default function Courses() {
  const ref = useReveal({ stagger: 0.1 });

  return (
    <section className={styles.section} ref={ref}>
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
          <span className={`mono ${styles.cue} reveal`}>05 — Kurslar</span>
          <h2 className={`${styles.headline} reveal`}>
            Öyrən, tətbiq et, <span className={styles.accent}>satışa çevir</span>.
          </h2>
          <p className={`${styles.sub} reveal`}>
            Nəzəriyyə yox — hər dərsdən sonra hesabında tətbiq edəcəyin addım.
          </p>
        </div>

        <ul className={styles.list}>
          {COURSES.map((c, i) => (
            <li className={`${styles.item} reveal`} key={c.t}>
              <span className={styles.itemN}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className={styles.itemT}>{c.t}</h3>
                <p className={styles.itemD}>{c.d}</p>
              </div>
              <span className={styles.itemArrow}>→</span>
            </li>
          ))}
        </ul>

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
      </div>
    </section>
  );
}
