import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "../../lib/gsap";
import { useReveal } from "../../lib/useReveal";
import { usePortfolio } from "../../lib/useContent";
import FlowGradient from "../../components/FlowField/FlowGradient";
import styles from "./Portfolio.module.css";

const DEFAULT_PROJECTS = [
  {
    n: "01",
    name: "Nərgiz Kosmetika",
    year: "2024",
    img: "/work-1.webp",
    tint: "var(--field-1)",
    cats: ["Şəxsi brend", "Reels"],
    brief:
      "Sahibkarın öz səsini tapdığı şəxsi brend sistemi. Ton, vizual dil və həftəlik Reels ritmi bir yerə gətirildi.",
    result: "3 ayda +48K izləyici",
    metrics: [
      ["İzləyici artımı", "+48K"],
      ["Orta çatım", "6.2×"],
      ["Reels / həftə", "4"],
    ],
  },
  {
    n: "02",
    name: "Baku Coffee Lab",
    year: "2024",
    img: "/work-2.webp",
    tint: "var(--field-2)",
    cats: ["Strategiya", "Kontent"],
    brief:
      "Menyu təqdimatından sifariş axınına qədər tam məzmun strategiyası. 90 günlük plan komanda tərəfindən icra edildi.",
    result: "Sifarişlərdə 2.1× artım",
    metrics: [
      ["Onlayn sifariş", "2.1×"],
      ["Profil ziyarəti", "+180%"],
      ["Saxlanma", "41%"],
    ],
  },
  {
    n: "03",
    name: "Studio Mās",
    year: "2023",
    img: "/work-3.webp",
    tint: "var(--field-3)",
    cats: ["Vizual dil", "Satış qıfı"],
    brief:
      "Memarlıq studiyası üçün vizual kimlik və lead qıfı. Hər post bir sorğuya aparan aydın yol ilə quruldu.",
    result: "Ayda 120+ sorğu",
    metrics: [
      ["Aylıq sorğu", "120+"],
      ["Qıf konversiyası", "9.4%"],
      ["Cavab vaxtı", "< 2 saat"],
    ],
  },
  {
    n: "04",
    name: "Terra Wellness",
    year: "2023",
    img: "/work-4.webp",
    tint: "var(--field-4)",
    cats: ["Kontent", "Analitika"],
    brief:
      "Onlayn kurs buraxılışı üçün məzmun və analitika dövrü. Hər həftə rəqəmlərə görə düzəliş edildi.",
    result: "Kursda 340 qeydiyyat",
    metrics: [
      ["Kurs qeydiyyatı", "340"],
      ["Səhifə konversiyası", "12%"],
      ["E-poçt siyahısı", "+2.6K"],
    ],
  },
  {
    n: "05",
    name: "Lumen Estetika",
    year: "2022",
    img: "/work-5.webp",
    tint: "var(--field-5)",
    cats: ["Şəxsi brend", "Reels"],
    brief:
      "Həkimin ekspert obrazı: izahedici Reels formatı, sabit rubrikalar və etibar quran hekayə xətti.",
    result: "Reels-də 1.4M baxış",
    metrics: [
      ["Reels baxış", "1.4M"],
      ["Yeni izləyici", "+31K"],
      ["Konsultasiya", "+64%"],
    ],
  },
];

const ALL = "Hamısı";

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

  const words = "İşlər nəticə ilə danışır.".split(" ");
  return (
    <header className={styles.hero} ref={root}>
      <FlowGradient />
      <div className={`${styles.heroInner} shell`}>
        <span className="mono">Portfolio</span>
        <h1 className={styles.heroTitle}>
          {words.map((w, i) => (
            <span className={styles.hMask} key={i}>
              <span
                className={`${styles.hWord} ${
                  w === "nəticə" ? styles.accent : ""
                }`}
              >
                {w}&nbsp;
              </span>
            </span>
          ))}
        </h1>
        <p className={`${styles.heroSub} lead`}>
          Seçilmiş layihələr - hər biri ölçülə bilən dəyişikliklə. Baxış deyil,
          sorğu və satış.
        </p>
      </div>
    </header>
  );
}

function ProjectRow({ p }) {
  const ref = useReveal({ stagger: 0.08 });
  return (
    <article className={styles.row} ref={ref}>
      <div className={styles.rowMedia}>
        <div
          className={`${styles.media} reveal`}
          style={{ backgroundImage: `url(${p.img})` }}
        >
          <span className={styles.mediaTint} style={{ background: p.tint }} />
        </div>
      </div>

      <div className={styles.rowBody}>
        <div className={`${styles.rowHead} reveal`}>
          <span className={styles.rowN}>{p.n}</span>
          <span className="mono">{p.year}</span>
        </div>
        <h2 className={`${styles.rowName} reveal`}>{p.name}</h2>
        <ul className={`${styles.tags} reveal`}>
          {p.cats.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p className={`${styles.brief} reveal`}>{p.brief}</p>

        <dl className={`${styles.metrics} reveal`}>
          {p.metrics.map((m, i) => {
            const label = Array.isArray(m) ? m[0] : m.label;
            const value = Array.isArray(m) ? m[1] : m.value;
            return (
              <div className={styles.metric} key={label || i}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </article>
  );
}

function Work() {
  const projects = usePortfolio(DEFAULT_PROJECTS);
  const [filter, setFilter] = useState(ALL);

  const filters = useMemo(() => {
    const seen = [];
    projects.forEach((p) =>
      (p.cats || []).forEach((c) => {
        if (c && !seen.includes(c)) seen.push(c);
      })
    );
    return [ALL, ...seen];
  }, [projects]);

  const list = useMemo(() => {
    if (filter === ALL) return projects;
    return projects.filter((p) => (p.cats || []).includes(filter));
  }, [filter, projects]);

  return (
    <section className={styles.work}>
      <div className={styles.workBar}>
        <div className="shell">
          <span className="mono">Seçilmiş işlər</span>
          <div className={styles.filters} role="group" aria-label="Filtr">
            {filters.map((f) => (
              <button
                key={f}
                className={styles.filterBtn}
                data-active={f === filter ? "true" : undefined}
                aria-pressed={f === filter}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.rows}>
        {list.map((p) => (
          <ProjectRow key={p.n} p={p} />
        ))}
      </div>
    </section>
  );
}

function Cta() {
  const ref = useReveal({ stagger: 0.1 });
  return (
    <section className={styles.cta} ref={ref}>
      <div className="shell">
        <span className="mono reveal">[ Növbəti layihə ]</span>
        <p className={`${styles.ctaText} reveal`}>
          Sənin brendin bu siyahının növbəti sətri ola bilər.
        </p>
        <div className={`${styles.ctaRow} reveal`}>
          <Link to="/elaqe" className={styles.ctaBtn}>
            İş birliyi
          </Link>
          <Link to="/xidmetler" className={styles.ctaLink}>
            Xidmətlərə bax →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Portfolio() {
  useEffect(() => {
    document.title = "Portfolio - Leyla Məmmədli";
  }, []);
  return (
    <div className={styles.page}>
      <Hero />
      <Work />
      <Cta />
    </div>
  );
}
