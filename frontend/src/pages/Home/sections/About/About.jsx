import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAbout } from '../../../../services/settingsService';
import styles from './About.module.css';
import Section from '../../../../components/ui/Section';
import SectionLabel from '../../../../components/ui/SectionLabel';
import RevealOnScroll from '../../../../components/ui/RevealOnScroll';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import Skeleton from '../../../../components/ui/Skeleton';
import ValueItem from './ValueItem';
import { about as aboutFallback } from '../../../../data/about';

const About = () => {
  const navigate = useNavigate();

  const { data: aboutData, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: getAbout,
  });

  if (isLoading) {
    return (
      <Section id="about" bg="primary" spacing="xl">
        <div className={styles.container}>
          <div className={styles.leftCol}>
            <Skeleton width="100%" height="500px" style={{ borderRadius: 'var(--radius-3xl)' }} />
          </div>
          <div className={styles.rightCol}>
            <Skeleton width="150px" height="24px" style={{ marginBottom: '1rem' }} />
            <Skeleton width="80%" height="40px" style={{ marginBottom: '1.5rem' }} />
            <Skeleton width="100%" height="20px" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="100%" height="20px" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="60%" height="20px" style={{ marginBottom: '2rem' }} />
            
            <div className={styles.valuesGrid} style={{ marginBottom: '2rem' }}>
              <Skeleton width="100%" height="80px" />
              <Skeleton width="100%" height="80px" />
            </div>
            
            <Skeleton width="150px" height="24px" style={{ marginBottom: '1rem' }} />
            <Skeleton width="100%" height="60px" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="100%" height="60px" style={{ marginBottom: '2rem' }} />
            
            <div className={styles.ctaWrapper}>
              <Skeleton width="150px" height="50px" />
            </div>
          </div>
        </div>
      </Section>
    );
  }

  const story = aboutData?.story || aboutFallback.story;
  const values = aboutData?.values || aboutFallback.values;
  const experience = aboutData?.experience || aboutFallback.experience;
  const skills = aboutData?.skills || aboutFallback.skills;
  const experienceYears = aboutData?.experienceYears || 7;
  const mainImage = aboutData?.mainImage || '/about_visual.png';

  return (
    <Section id="about" bg="primary" spacing="xl">
      <div className={styles.container}>
        <div className={styles.leftCol}>
          <RevealOnScroll delay={100} className={styles.visualContainer}>
            <img src={mainImage} alt="Marketing Professional" className={styles.aboutImage} />
            <div className={styles.accentCard}>
              <span className={styles.accentText}><strong>{experienceYears}+</strong> İllik<br/>Təcrübə</span>
            </div>
          </RevealOnScroll>
        </div>
        <div className={styles.rightCol}>
          <RevealOnScroll>
             <SectionLabel overline="Haqqımda" heading="Profesionallıqla İdarə Olunan, Nəticələrlə Müəyyən Edilən" align="left" />
             <p className={styles.story}>{story}</p>
          </RevealOnScroll>
          
          <RevealOnScroll delay={150}>
            <div className={styles.valuesGrid}>
               {values.map((val, idx) => (
                 <ValueItem key={idx} value={val} />
               ))}
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll delay={200}>
            <div className={styles.experienceBlock}>
               <h4 className={styles.subHeading}>Təcrübə</h4>
               <div className={styles.timeline}>
                 {experience.map((exp, idx) => (
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
                   {skills.map((skill, idx) => (
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
