import { Link } from "react-router-dom";
import styles from "./Placeholder.module.css";

export default function Placeholder({ index = "00", title = "Səhifə", note }) {
  return (
    <section className={styles.wrap}>
      <div className="shell">
        <span className="mono">{index} — {title}</span>
        <h1 className={styles.h}>
          Bu səhifə <span className={styles.ital}>növbəti addımda</span> qurulacaq.
        </h1>
        <p className={styles.p}>
          {note ||
            "Home nümunəsi təsdiqləndikdən sonra bu səhifə eyni dizayn dili ilə hazırlanacaq."}
        </p>
        <Link to="/" className={styles.back}>
          ← Ana səhifə
        </Link>
      </div>
    </section>
  );
}
