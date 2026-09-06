import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.foot}>
      <div className={`${styles.inner} shell`}>
        <div className={styles.top}>
          <p className={styles.cue}>[ Layihə üçün ]</p>
          <h2 className={styles.big}>
            Sosial hesabını <span className={styles.italic}>sistemə</span> çevirək.
          </h2>
          <a
            href="https://www.instagram.com/leiylamammadly/"
            target="_blank"
            rel="noreferrer"
            className={styles.mail}
          >
            instagram.com/leiylamammadly →
          </a>
        </div>

        <div className={styles.grid}>
          <div className={styles.col}>
            <span className="mono">Naviqasiya</span>
            <Link to="/xidmetler">Xidmətlər</Link>
            <Link to="/kurslar">Kurslar</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/elaqe">Əlaqə</Link>
          </div>
          <div className={styles.col}>
            <span className="mono">Sosial</span>
            <a href="https://www.instagram.com/leiylamammadly/" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
          <div className={styles.col}>
            <span className="mono">Ünvan</span>
            <span>Bakı, Azərbaycan</span>
            <span>GMT+4</span>
          </div>
        </div>

        <div className={styles.base}>
          <span>© {year} Leyla Məmmədli</span>
          <span className="mono">SMM · Strategiya · Kontent · Satış</span>
        </div>
      </div>
    </footer>
  );
}
