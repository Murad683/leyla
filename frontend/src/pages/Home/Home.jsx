import React from 'react';
import useSEO from '../../hooks/useSEO';
import Hero from './sections/Hero/Hero';
import Services from './sections/Services/Services';
import About from './sections/About/About';
import styles from './Home.module.css';

const Home = () => {
  useSEO({ title: 'Leyla — Rəqəmsal Marketoloq və Reklam Strateqi', description: 'Brendləri ucaldan və biznesləri böyüdən strateji kampaniyalar yaradan rəqəmsal marketoloq və reklam strateqi.' });
  return (
    <div className={styles.home}>
      <Hero />
      <Services />
      <About />
    </div>
  );
};
export default Home;
