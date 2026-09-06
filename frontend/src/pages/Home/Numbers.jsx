import { useCounter } from "../../lib/useCounter";
import styles from "./Numbers.module.css";

function Stat({ end, suffix, label }) {
  const [ref, val] = useCounter(end);
  return (
    <div className={styles.stat} ref={ref}>
      <span className={styles.num}>
        {val}
        <i>{suffix}</i>
      </span>
      <span className="mono">{label}</span>
    </div>
  );
}

export default function Numbers() {
  return (
    <section className={styles.section}>
      <div className={`${styles.grid} shell`}>
        <span className={`mono ${styles.cue}`}>03 — Rəqəmlər</span>
        <Stat end={16} suffix="K+" label="İzləyici auditoriya" />
        <Stat end={40} suffix="+" label="Tamamlanmış layihə" />
        <Stat end={6} suffix=" il" label="Sahədə təcrübə" />
        <Stat end={95} suffix="%" label="Təkrar müraciət" />
      </div>
    </section>
  );
}
