import { useCounter } from "../../lib/useCounter";
import { useReveal } from "../../lib/useReveal";
import { useHomeContent } from "../../lib/useContent";
import styles from "./Numbers.module.css";

const DEFAULTS = {
  numbersEyebrow: "03 — Rəqəmlər",
  stats: [
    { value: 16, suffix: "K+", label: "İzləyici auditoriya" },
    { value: 40, suffix: "+", label: "Tamamlanmış layihə" },
    { value: 6, suffix: " il", label: "Sahədə təcrübə" },
    { value: 95, suffix: "%", label: "Təkrar müraciət" },
  ],
};

function Stat({ end, suffix, label }) {
  const [ref, val] = useCounter(Number(end) || 0);
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
  const { numbersEyebrow, stats } = useHomeContent(DEFAULTS);
  const list = Array.isArray(stats) && stats.length ? stats : DEFAULTS.stats;
  return (
    <section className={styles.section}>
      <div className="shell" ref={ref}>
        <span className={`mono ${styles.cue} reveal`}>{numbersEyebrow}</span>
        <div className={styles.grid}>
          {list.map((s, i) => (
            <Stat key={i} end={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
