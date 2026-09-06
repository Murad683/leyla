import { useReveal } from "../../lib/useReveal";
import { useParallax } from "../../lib/useParallax";
import styles from "./Intro.module.css";

export default function Intro() {
  const ref = useReveal({ stagger: 0.12 });
  const panel = useParallax(120, 60);

  return (
    <section className={`${styles.section} section`} ref={ref}>
      <div className={`${styles.grid} shell`}>
        <div className={styles.left}>
          <span className="mono reveal">01 — Yanaşma</span>
          <p className={`${styles.statement} reveal`}>
            Kontent gözəl görünə bilər — amma <span className={styles.ital}>satmırsa</span>,
            işini görmür.
          </p>
        </div>

        <div className={styles.right}>
          <p className={`${styles.p} reveal`}>
            Mən sosial media hesablarını marketinq sistemi kimi qururam: auditoriya
            araşdırması, mövqeləndirmə, məzmun xətti və satış qıfı — hamısı bir-birinə
            bağlı.
          </p>
          <p className={`${styles.p} reveal`}>
            Nəticə görünüş deyil, rəqəmdir: daha keyfiyyətli izləyici, daha çox sorğu,
            daha çox bağlanan satış.
          </p>
          <div className={`${styles.tags} reveal`}>
            {["Strategiya", "Kontent", "Şəxsi brend", "Satış qıfı", "Analitika"].map(
              (t) => (
                <span key={t}>{t}</span>
              )
            )}
          </div>
        </div>

        <div className={styles.panelCol} aria-hidden="true">
          <div className={styles.panel} ref={panel} />
        </div>
      </div>
    </section>
  );
}
