import Hero from "./Hero";
import ServicesPinned from "./ServicesPinned";
import Marquee from "../../components/Marquee/Marquee";
import { useReveal } from "../../lib/useReveal";
import styles from "./Home.module.css";

export default function Home() {
  const revealRef = useReveal();

  return (
    <div className={styles.page}>
      <Hero />

      <Marquee
        items={[
          "Strategiya",
          "Kontent",
          "Şəxsi brend",
          "Satış",
          "Auditoriya",
          "Reels",
        ]}
        speed={30}
      />

      <ServicesPinned />

      <section className={`${styles.close} section`} ref={revealRef}>
        <div className="shell">
          <p className={`${styles.cue} mono reveal`}>[ Növbəti ]</p>
          <p className={`${styles.big} reveal`}>
            Bu, hazırlanacaq dizaynın <span className={styles.ital}>istiqamətidir</span> —
            hero, ritm, tipografiya və scroll davranışı.
          </p>
          <p className={`${styles.note} reveal`}>
            Təsdiqindən sonra Kurslar, Portfolio və Əlaqə səhifələri eyni dillə qurulacaq.
          </p>
        </div>
      </section>
    </div>
  );
}
