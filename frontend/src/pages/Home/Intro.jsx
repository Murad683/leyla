import { useReveal } from "../../lib/useReveal";
import { useParallax } from "../../lib/useParallax";
import { useHomeContent } from "../../lib/useContent";
import styles from "./Intro.module.css";

const DEFAULTS = {
  introEyebrow: "01 — Yanaşma",
  introStatement:
    "Kontent gözəl görünə bilər — amma satmırsa, işini görmür.",
  introAccent: "satmırsa",
  introParagraphs: [
    "Mən sosial media hesablarını marketinq sistemi kimi qururam: auditoriya araşdırması, mövqeləndirmə, məzmun xətti və satış qıfı — hamısı bir-birinə bağlı.",
    "Nəticə görünüş deyil, rəqəmdir: daha keyfiyyətli izləyici, daha çox sorğu, daha çox bağlanan satış.",
  ],
  introTags: ["Strategiya", "Kontent", "Şəxsi brend", "Satış qıfı", "Analitika"],
};

const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

/** Render `text`, wrapping any word that matches `accent` in an italic span. */
function Statement({ text, accent }) {
  if (!accent) return <>{text}</>;
  const set = new Set(accent.split(/\s+/).filter(Boolean).map(norm));
  return text.split(/(\s+)/).map((tok, i) =>
    set.has(norm(tok)) ? (
      <span className={styles.ital} key={i}>
        {tok}
      </span>
    ) : (
      tok
    )
  );
}

export default function Intro() {
  const ref = useReveal({ stagger: 0.12 });
  const panel = useParallax(120, 60);
  const { introEyebrow, introStatement, introAccent, introParagraphs, introTags } =
    useHomeContent(DEFAULTS);
  const paras = introParagraphs?.length ? introParagraphs : DEFAULTS.introParagraphs;
  const tags = introTags?.length ? introTags : DEFAULTS.introTags;

  return (
    <section className={`${styles.section} section`} ref={ref}>
      <div className={`${styles.grid} shell`}>
        <div className={styles.left}>
          <span className="mono reveal">{introEyebrow}</span>
          <p className={`${styles.statement} reveal`}>
            <Statement text={introStatement} accent={introAccent} />
          </p>
        </div>

        <div className={styles.right}>
          {paras.map((p, i) => (
            <p className={`${styles.p} reveal`} key={i}>
              {p}
            </p>
          ))}
          <div className={`${styles.tags} reveal`}>
            {tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div className={styles.panelCol} aria-hidden="true">
          <div className={styles.panel} ref={panel} />
        </div>
      </div>
    </section>
  );
}
