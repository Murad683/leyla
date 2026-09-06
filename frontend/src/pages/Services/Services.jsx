import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "../../lib/gsap";
import { useReveal } from "../../lib/useReveal";
import { useServices } from "../../lib/useContent";
import FlowGradient from "../../components/FlowField/FlowGradient";
import styles from "./Services.module.css";

const DEFAULT_SERVICES = [
  {
    n: "01",
    title: "Strategiya",
    desc: "Auditoriya araşdırması, mövqeləndirmə və 90 günlük məzmun-satış planı. Hər qərarın arxasında ölçülə bilən məqsəd dayanır.",
    includes: [
      "Auditoriya və rəqib auditi",
      "Mövqeləndirmə sənədi",
      "Məzmun sütunları",
      "Satış qıfı xəritəsi",
    ],
    outcome: "Komandanın icra edə biləcəyi yazılı strateji sənəd.",
  },
  {
    n: "02",
    title: "Kontent",
    desc: "Reels, karusel və hekayə formatları üçün ssenari, çəkiliş rejissurası və montaj standartı. Həftəlik ritm - trend deyil, sistem.",
    includes: [
      "Aylıq kontent planı",
      "Ssenari və storyboard",
      "Çəkiliş rejissurası",
      "Montaj və dizayn şablonları",
    ],
    outcome: "Ayda 12-20 hazır post, sabit vizual dil.",
  },
  {
    n: "03",
    title: "Şəxsi brend",
    desc: "Ekspert obrazının qurulması: ton, vizual kimlik və daimi mövzu xətti. İzləyici deyil - etibar qazanırıq.",
    includes: [
      "Ton və dəyər xəritəsi",
      "Vizual kimlik",
      "Rubrika sistemi",
      "Şəxsi hekayə çərçivəsi",
    ],
    outcome: "Tanınan, yadda qalan ekspert mövqeyi.",
  },
  {
    n: "04",
    title: "Satış",
    desc: "Məzmunu gəlirə bağlayan sistem: lead axını, offer strukturu və konversiya təhlili. Baxış deyil - sorğu və satış.",
    includes: [
      "Lead-magnit və offer",
      "DM və qıf skriptləri",
      "Analitika paneli",
      "Aylıq nəticə hesabatı",
    ],
    outcome: "Ölçülə bilən sorğu axını və konversiya.",
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

  const words = "Hər xidmət - ölçülə bilən nəticə.".split(" ");

  return (
    <header className={styles.hero} ref={root}>
      <FlowGradient />
      <div className={`${styles.heroInner} shell`}>
        <span className="mono">Xidmətlər</span>
        <h1 className={styles.heroTitle}>
          {words.map((w, i) => (
            <span className={styles.hMask} key={i}>
              <span className={styles.hWord}>{w}&nbsp;</span>
            </span>
          ))}
        </h1>
        <p className={`${styles.heroSub} lead`}>
          Strategiyadan satışa qədər - dörd modul, bir sistem. Ayrı-ayrı və ya
          tam paket.
        </p>
      </div>
    </header>
  );
}

function ServiceBlock({ s }) {
  const ref = useReveal({ stagger: 0.08 });
  return (
    <article className={styles.block} ref={ref}>
      <div className={styles.blockNum}>
        <span className={`${styles.num} reveal`}>{s.n}</span>
      </div>
      <div className={styles.blockBody}>
        <h2 className={`${styles.blockTitle} reveal`}>{s.title}</h2>
        <p className={`${styles.blockDesc} reveal`}>{s.desc}</p>

        <div className={styles.detail}>
          <div className={`${styles.detailCol} reveal`}>
            <span className="mono">Nə daxildir</span>
            <ul className={styles.list}>
              {s.includes.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
          <div className={`${styles.detailCol} reveal`}>
            <span className="mono">Nəticə</span>
            <p className={styles.outcome}>{s.outcome}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function Cta() {
  const ref = useReveal({ stagger: 0.1 });
  return (
    <section className={styles.cta} ref={ref}>
      <div className="shell">
        <span className="mono reveal">[ Növbəti addım ]</span>
        <p className={`${styles.ctaText} reveal`}>
          Hansı modulun sənə lazım olduğunu birlikdə müəyyən edək.
        </p>
        <div className={`${styles.ctaRow} reveal`}>
          <Link to="/elaqe" className={styles.ctaBtn}>
            İş birliyi
          </Link>
          <Link to="/kurslar" className={styles.ctaLink}>
            Kurslara bax →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  useEffect(() => {
    document.title = "Xidmətlər - Leyla Məmmədli";
  }, []);

  const services = useServices(DEFAULT_SERVICES);

  return (
    <div className={styles.page}>
      <Hero />
      <div className={styles.blocks}>
        {services.map((s) => (
          <ServiceBlock key={s.n} s={s} />
        ))}
      </div>
      <Cta />
    </div>
  );
}
