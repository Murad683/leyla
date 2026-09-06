import { useReveal } from "../../lib/useReveal";
import { useTestimonials, useHomeContent } from "../../lib/useContent";
import styles from "./Quotes.module.css";

const DEFAULT_QUOTES = [
  {
    q: "İlk dəfə hesabımın arxasında aydın strategiya olduğunu hiss etdim. Sorğular üç həftəyə ikiqat artdı.",
    a: "Nərgiz A.",
    r: "Kosmetika brendi",
  },
  {
    q: "Kontent çəkməyi dayandırıb sistem qurduq. İndi komanda mənsiz də ritmi saxlayır.",
    a: "Elvin M.",
    r: "Kofe brendi, kurs iştirakçısı",
  },
];

export default function Quotes() {
  const ref = useReveal({ stagger: 0.15 });
  const quotes = useTestimonials(DEFAULT_QUOTES);
  const { quotesEyebrow } = useHomeContent({ quotesEyebrow: "06 - Rəylər" });
  if (!quotes.length) return null;
  return (
    <section className={`${styles.section} section`} ref={ref}>
      <div className="shell">
        <span className={`mono ${styles.cue} reveal`}>{quotesEyebrow}</span>
        <div className={styles.grid}>
          {quotes.map((item) => (
            <figure className={`${styles.card} reveal`} key={item.a}>
              <blockquote className={styles.q}>"{item.q}"</blockquote>
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
