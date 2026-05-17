import { useNavigate } from 'react-router-dom';
import styles from './About.module.css';
import Section from '../../../../components/ui/Section';
import SectionLabel from '../../../../components/ui/SectionLabel';
import RevealOnScroll from '../../../../components/ui/RevealOnScroll';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import ValueItem from './ValueItem';
import { about } from '../../../../data/about';

const About = () => {
  const navigate = useNavigate();
  return (
    <Section id="about" bg="primary" spacing="xl">
      <div className={styles.container}>
        <div className={styles.leftCol}>
          <RevealOnScroll delay={100} className={styles.visualContainer}>
            <img src="/about_visual.png" alt="Marketing Professional" className={styles.aboutImage} />
            <div className={styles.accentCard}>
              <span className={styles.accentText}><strong>7+</strong> İllik<br/>Təcrübə</span>
            </div>
          </RevealOnScroll>
        </div>
        <div className={styles.rightCol}>
          <RevealOnScroll>
             <SectionLabel overline="Haqqımda" heading="Profesionallıqla İdarə Olunan, Nəticələrlə Müəyyən Edilən" align="left" />
             <p className={styles.story}>{about.story}</p>
          </RevealOnScroll>
          
          <RevealOnScroll delay={150}>
            <div className={styles.valuesGrid}>
               {about.values.map((val, idx) => (
                 <ValueItem key={idx} value={val} />
               ))}
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll delay={200}>
            <div className={styles.experienceBlock}>
               <h4 className={styles.subHeading}>Təcrübə</h4>
               <div className={styles.timeline}>
                 {about.experience.map((exp, idx) => (
                   <div key={idx} className={styles.timelineItem}>
                      <div className={styles.timelineYear}>{exp.year}</div>
                      <div className={styles.timelineContent}>
                        <strong>{exp.role}</strong> — {exp.company}
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll delay={250}>
             <div className={styles.skillsBlock}>
                <h4 className={styles.subHeading}>Ekspertiza</h4>
                <div className={styles.skillsList}>
                   {about.skills.map((skill, idx) => (
                      <Badge key={idx}>{skill}</Badge>
                   ))}
                </div>
             </div>
             <div className={styles.ctaWrapper}>
                <Button variant="secondary" size="md" onClick={() => navigate('/about')}>Hekayəni oxu</Button>
             </div>
          </RevealOnScroll>
        </div>
      </div>
    </Section>
  );
};
export default About;
