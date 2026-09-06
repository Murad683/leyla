import { useReveal } from "../../lib/useReveal";
import styles from "./Quotes.module.css";

const QUOTES = [
  {
    q: "İlk dəfə hesabımın arxasında aydın strategiya olduğunu hiss etdim. Sorğular üç həftəyə ikiqat artdı.",
    a: "Nərgiz A.",
    r: "Kosmetika brendi",
  },
  {
    q: "Kontent çəkməyi dayandırıb sistem qurduq. İndi komanda mənsiz də ritmi saxlayır.",
    a: "Elvin M.",
    r: "Kofe brendi, kurus iştirakçısı",
  },
];

export default function Quotes() {
  const ref = useReveal({ stagger: 0.15 });
  return (
    <section className={`${styles.section} section`} ref={ref}>
      <div className="shell">
        <span className={`mono ${styles.cue} reveal`}>06 — Rəylər</span>
        <div className={styles.grid}>
          {QUOTES.map((item) => (
            <figure className={`${styles.card} reveal`} key={item.a}>
              <blockquote className={styles.q}>“{item.q}”</blockquote>
              <figcaption className={styles.cap}>
                <span className={styles.a}>{item.a}</span>
                <span className="mono">{item.r}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
