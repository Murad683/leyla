import React from 'react';
import useSEO from '../../hooks/useSEO';
import Hero from './sections/Hero/Hero';
import Services from './sections/Services/Services';
import About from './sections/About/About';
import styles from './Home.module.css';

const Home = () => {
  useSEO({ title: 'Leyla — Marketinq Təlimləri və Mentorluq', description: 'Praktik, nəticə yönümlü marketinq təlimləri ilə bacarıqlarınızı inkişaf etdirin və karyeranızı irəli aparın.' });
  return (
    <div className={styles.home}>
      <Hero />
      <Services />
      <About />
    </div>
  );
};
export default Home;
