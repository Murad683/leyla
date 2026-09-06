import { useReveal } from "../../lib/useReveal";
import styles from "./Process.module.css";

const STEPS = [
  {
    n: "A",
    title: "Kəşf",
    text: "Biznesin, auditoriyan və rəqiblərin dərin təhlili. Harada olduğunu dəqiq bilmədən hara gedəcəyini planlaya bilmərik.",
  },
  {
    n: "B",
    title: "Sistem",
    text: "Mövqeləndirmə, məzmun sütunları, vizual dil və satış qıfı — hamısı sənədləşdirilmiş bir plan halında.",
  },
  {
    n: "C",
    title: "İcra",
    text: "Həftəlik kontent ritmi, çəkiliş rejissurası, montaj standartı və rəqəmlərə görə davamlı düzəliş.",
  },
];

export default function Process() {
  const ref = useReveal({ stagger: 0.14 });
  return (
    <section className={`${styles.section} section`} ref={ref}>
      <div className="shell">
        <header className={styles.head}>
          <span className="mono reveal">04 — Necə işləyirik</span>
          <p className={`${styles.headline} reveal`}>
            Kaosdan aydınlığa — <span className={styles.ital}>üç mərhələ</span>.
          </p>
        </header>

        <ol className={styles.list}>
          {STEPS.map((s) => (
            <li className={`${styles.step} reveal`} key={s.n}>
              <span className={styles.n}>{s.n}</span>
              <div className={styles.body}>
                <h3 className={styles.title}>{s.title}</h3>
                <p className={styles.text}>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
