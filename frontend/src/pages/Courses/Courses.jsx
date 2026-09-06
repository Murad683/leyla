import { useEffect, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import { useReveal } from "../../lib/useReveal";
import FlowField from "../../components/FlowField/FlowField";
import styles from "./Courses.module.css";

const IG = "https://www.instagram.com/leiylamammadly/";

const COURSES = [
  {
    n: "01",
    title: "SMM Sistemi",
    format: "6 həftə · həftədə 2 canlı dərs · online",
    desc: "Sıfırdan bir SMM sistemi qurursan: auditoriya, mövqeləndirmə, məzmun ritmi və satış qıfı. Nəzəriyyə yox — hər dərsdən sonra öz hesabında tətbiq edirsən.",
    program: [
      "Auditoriya və rəqib təhlili",
      "Mövqeləndirmə və offer",
      "Məzmun sütunları və plan",
      "Reels və format sistemi",
      "Satış qıfı və DM",
      "Analitika və düzəliş",
    ],
    who: "Öz brendini və ya kiçik biznesini idarə edənlər.",
    outcome: "Hazır 90 günlük plan + işləyən satış qıfı.",
  },
  {
    n: "02",
    title: "Reels Laboratoriyası",
    format: "3 həftə · praktiki · həftəlik təhvil",
    desc: "Reels-i sistemə çevirirsən: ssenari, çəkiliş, montaj və trend oxuma. Hər həftə yeni format, hər format üçün şablon.",
    program: [
      "Hook və struktur",
      "Ssenari şablonları",
      "Çəkiliş və işıq",
      "Montaj standartı",
      "Trend oxuma",
      "Yayım və analitika",
    ],
    who: "Kontent çəkən, amma nəticə görməyənlər.",
    outcome: "Həftədə 3–5 hazır Reels, sabit baxış artımı.",
  },
  {
    n: "03",
    title: "Şəxsi Brend Intensiv",
    format: "2 həftə · sprint · fərdi rəy",
    desc: "İki həftədə ekspert obrazını qurursan: ton, vizual dil və daimi mövzu xətti. İzləyici deyil — etibar qazanırsan.",
    program: [
      "Dəyər və ton xəritəsi",
      "Vizual kimlik",
      "Rubrika sistemi",
      "Şəxsi hekayə çərçivəsi",
      "İlk 30 günün planı",
    ],
    who: "Sahəsində tanınmaq istəyən mütəxəssislər.",
    outcome: "Tanınan mövqe + 30 günlük kontent planı.",
  },
];

const HOW = [
  { t: "Canlı dərslər", d: "Hər dərs yazılır, platformada qalır." },
  { t: "Praktiki tapşırıq", d: "Hər dərsdən sonra öz hesabında tətbiq." },
  { t: "Fərdi rəy", d: "Tapşırıqlara birbaşa qeyd və düzəliş." },
  { t: "Bağlı icma", d: "İştirakçılarla ünsiyyət və dəstək." },
];

const FAQ = [
  {
    q: "Dərsləri sonra izləyə bilərəm?",
    a: "Bəli. Bütün canlı dərslər yazılır və platformada açıq qalır.",
  },
  {
    q: "Təcrübə lazımdır?",
    a: "Yox. Kurslar sıfırdan başlayanlar üçün qurulub, mərhələ-mərhələ gedir.",
  },
  {
    q: "Ödəniş necə olur?",
    a: "Qeydiyyatdan sonra sizinlə əlaqə saxlanılır, format və şərtlər razılaşdırılır.",
  },
  {
    q: "Qrup nə qədərdir?",
    a: "Fərdi diqqət üçün hər axın məhdud sayda iştirakçı ilə keçir.",
  },
];

function Hero() {
  const root = useRef(null);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = root.current.querySelectorAll(`.${styles.hWord}`);
    if (reduce) {
      gsap.set(words, { opacity: 1, y: 0, filter: "blur(0)" });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(words, {
        opacity: 0,
        y: 24,
        filter: "blur(12px)",
        duration: 1,
        ease: "power3.out",
        stagger: 0.07,
        delay: 0.15,
      });
      gsap.from(`.${styles.heroSub}`, {
        opacity: 0,
        y: 16,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.5,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const words = "Öyrən, tətbiq et, satışa çevir.".split(" ");
  return (
    <header className={styles.hero} ref={root}>
      <FlowField />
      <div className={`${styles.heroInner} shell`}>
        <span className="mono">Kurslar</span>
        <h1 className={styles.heroTitle}>
          {words.map((w, i) => (
            <span className={styles.hMask} key={i}>
              <span
                className={`${styles.hWord} ${
                  w === "satışa" || w === "çevir." ? styles.accent : ""
                }`}
              >
                {w}&nbsp;
              </span>
            </span>
          ))}
        </h1>
        <p className={`${styles.heroSub} lead`}>
          Canlı, praktiki və nəticəyönümlü. Hər dərsdən sonra hesabında dəyişən
          bir şey olur.
        </p>
      </div>
    </header>
  );
}

function CourseBlock({ c }) {
  const ref = useReveal({ stagger: 0.08 });
  return (
    <article className={styles.block} ref={ref}>
      <div className={styles.blockNum}>
        <span className={`${styles.num} reveal`}>{c.n}</span>
      </div>
      <div className={styles.blockBody}>
        <span className={`mono ${styles.format} reveal`}>{c.format}</span>
        <h2 className={`${styles.blockTitle} reveal`}>{c.title}</h2>
        <p className={`${styles.blockDesc} reveal`}>{c.desc}</p>

        <div className={styles.detail}>
          <div className={`${styles.detailCol} reveal`}>
            <span className="mono">Proqram</span>
            <ul className={styles.list}>
              {c.program.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
          <div className={styles.detailSide}>
            <div className={`${styles.detailCol} reveal`}>
              <span className="mono">Kimə uyğundur</span>
              <p className={styles.small}>{c.who}</p>
            </div>
            <div className={`${styles.detailCol} reveal`}>
              <span className="mono">Nəticə</span>
              <p className={styles.outcome}>{c.outcome}</p>
            </div>
          </div>
        </div>

        <a
          href={IG}
          target="_blank"
          rel="noreferrer"
          className={`${styles.enroll} reveal`}
        >
          Qeydiyyatdan keç →
        </a>
      </div>
    </article>
  );
}

function How() {
  const ref = useReveal({ stagger: 0.1 });
  return (
    <section className={styles.how} ref={ref}>
      <div className="shell">
        <span className="mono reveal">Necə keçir</span>
        <div className={styles.howGrid}>
          {HOW.map((h) => (
            <div className={`${styles.howItem} reveal`} key={h.t}>
              <h3 className={styles.howT}>{h.t}</h3>
              <p className={styles.howD}>{h.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const ref = useReveal({ stagger: 0.08 });
  const [open, setOpen] = useState(0);
  return (
    <section className={styles.faq} ref={ref}>
      <div className="shell">
        <span className="mono reveal">Suallar</span>
        <ul className={styles.faqList}>
          {FAQ.map((f, i) => (
            <li
              key={f.q}
              className={`${styles.faqItem} reveal ${i === open ? styles.faqOpen : ""}`}
            >
              <button
                className={styles.faqQ}
                onClick={() => setOpen(i === open ? -1 : i)}
                aria-expanded={i === open}
              >
                <span>{f.q}</span>
                <span className={styles.faqSign}>{i === open ? "–" : "+"}</span>
              </button>
              <div className={styles.faqA}>
                <p>{f.a}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Cta() {
  const ref = useReveal({ stagger: 0.1 });
  return (
    <section className={styles.cta} ref={ref}>
      <div className="shell">
        <span className="mono reveal">[ Növbəti axın ]</span>
        <p className={`${styles.ctaText} reveal`}>
          Qeydiyyat açıqdır. Uyğun kursu birlikdə seçək.
        </p>
        <a
          href={IG}
          target="_blank"
          rel="noreferrer"
          className={`${styles.ctaBtn} reveal`}
        >
          Qeydiyyatdan keç
        </a>
      </div>
    </section>
  );
}

export default function Courses() {
  useEffect(() => {
    document.title = "Kurslar — Leyla Məmmədli";
  }, []);
  return (
    <div className={styles.page}>
      <Hero />
      <div className={styles.blocks}>
        {COURSES.map((c) => (
          <CourseBlock key={c.n} c={c} />
        ))}
      </div>
      <How />
      <Faq />
      <Cta />
    </div>
  );
}
