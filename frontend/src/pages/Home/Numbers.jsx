import { useCounter } from "../../lib/useCounter";
import { useReveal } from "../../lib/useReveal";
import styles from "./Numbers.module.css";

function Stat({ end, suffix, label }) {
  const [ref, val] = useCounter(end);
  return (
    <div className={`${styles.stat} reveal`} ref={ref}>
      <span className={styles.num}>
        {val}
        <i>{suffix}</i>
      </span>
      <span className="mono">{label}</span>
    </div>
  );
}

export default function Numbers() {
  const ref = useReveal({ stagger: 0.09 });
  return (
    <section className={styles.section}>
      <div className="shell" ref={ref}>
        <span className={`mono ${styles.cue} reveal`}>03 — Rəqəmlər</span>
        <div className={styles.grid}>
          <Stat end={16} suffix="K+" label="İzləyici auditoriya" />
          <Stat end={40} suffix="+" label="Tamamlanmış layihə" />
          <Stat end={6} suffix=" il" label="Sahədə təcrübə" />
          <Stat end={95} suffix="%" label="Təkrar müraciət" />
        </div>
      </div>
    </section>
  );
}
