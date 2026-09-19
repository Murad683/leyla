import Hero from "./Hero";
import Intro from "./Intro";
import About from "./About";
import ServicesArc from "./ServicesArc";
import WorkGallery from "./WorkGallery";
import Numbers from "./Numbers";
import Process from "./Process";
import FreeLessons from "./FreeLessons";
import Courses from "./Courses";
import Results from "./Results";
import Quotes from "./Quotes";
import FAQ from "./FAQ";
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
      <About />
      <ServicesArc />
      <WorkGallery />
      <Numbers />
      <Process />
      <FreeLessons />
      <Courses />
      <Results />
      <Quotes />
      <FAQ />
    </div>
  );
}
