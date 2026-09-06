import Hero from "./Hero";
import Intro from "./Intro";
import ServicesPinned from "./ServicesPinned";
import WorkGallery from "./WorkGallery";
import Numbers from "./Numbers";
import Process from "./Process";
import Courses from "./Courses";
import Quotes from "./Quotes";
import Marquee from "../../components/Marquee/Marquee";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Hero />
      <Marquee
        items={["Strategiya", "Kontent", "Şəxsi brend", "Satış", "Auditoriya", "Reels"]}
        speed={32}
      />
      <Intro />
      <ServicesPinned />
      <WorkGallery />
      <Numbers />
      <Process />
      <Courses />
      <Quotes />
    </div>
  );
}
