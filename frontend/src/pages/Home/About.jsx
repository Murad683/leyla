import { useReveal } from "../../lib/useReveal";
import { useHomeContent } from "../../lib/useContent";
import styles from "./About.module.css";

const DEFAULTS = {
  aboutEyebrow: "02 - Ekspert Haqqında",
  aboutHeadline: "Sistemli yanaşma, real nəticələr.",
  aboutStory: [
    "Bir neçə ildir sosial media və şəxsi brendləşmə sahəsində tələbələrə və sahibkarlara addım-addım sistem qururam.",
    "Məqsədim gözəl görünüş deyil - ölçülə bilən nəticədir: daha keyfiyyətli auditoriya, daha çox sorğu, real satış.",
  ],
  aboutMethod: [
    { t: "Araşdırma", d: "Auditoriya və mövqeləndirmə təhlili ilə başlayırıq." },
    { t: "Sistem", d: "Kontent xətti və satış qıfı bir-birinə bağlanır." },
    { t: "Nəticə", d: "Rəqəmlərlə izlənən, təkrarlana bilən proses." },
  ],
};

export default function About() {
  const ref = useReveal({ stagger: 0.12 });
  const { aboutEyebrow, aboutHeadline, aboutStory, aboutMethod } = useHomeContent(DEFAULTS);
  const story = aboutStory?.length ? aboutStory : DEFAULTS.aboutStory;
  const method = aboutMethod?.length ? aboutMethod : DEFAULTS.aboutMethod;

  return (
    <section className={`${styles.section} section`} id="haqqimda" ref={ref}>
      <div className={`${styles.grid} shell`}>
        <div className={styles.left}>
          <span className="mono reveal">{aboutEyebrow}</span>
          <h2 className={`${styles.headline} reveal`}>{aboutHeadline}</h2>
        </div>

        <div className={styles.right}>
          {story.map((p, i) => (
            <p className={`${styles.p} reveal`} key={i}>
              {p}
            </p>
          ))}

          <div className={styles.methodGrid}>
            {method.map((m, i) => (
              <div className={`${styles.methodCard} reveal`} key={i}>
                <span className={styles.methodN}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.methodT}>{m.t}</h3>
                <p className={styles.methodD}>{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
