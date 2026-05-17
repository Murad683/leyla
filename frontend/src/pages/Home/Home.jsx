import React from 'react';
import useSEO from '../../hooks/useSEO';
import Hero from './sections/Hero/Hero';
import Services from './sections/Services/Services';
import About from './sections/About/About';
import styles from './Home.module.css';

const Home = () => {
  useSEO({ title: 'Jane Doe — Digital Strategist | Personal Brand', description: 'Crafting digital experiences that elevate personal brands and scale businesses.' });
  return (
    <div className={styles.home}>
      <Hero />
      <Services />
      <About />
    </div>
  );
};
export default Home;
