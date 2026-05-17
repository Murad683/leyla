const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'frontend', 'src');

const lipsumContent = `
## Introduction
In the rapidly evolving digital landscape, establishing a strong and recognizable presence is more important than ever. Companies of all sizes are looking to optimize their performance, engage their audiences, and scale their infrastructure efficiently. 

## The Challenge
One of the primary challenges businesses face is the fragmentation of their digital strategy. A brand might have an excellent product, but without a cohesive design language and an optimized user experience, conversion rates remain low. Our approach focuses on analyzing user behavior, auditing existing technical debt, and formulating a roadmap that prioritizes high-impact improvements.

## Strategic Implementation
We initiated the process by conducting comprehensive market research and competitive analysis. By identifying key differentiators, we were able to position the brand uniquely.

Here are the critical steps involved:
- **Auditing existing assets:** We mapped out all current digital touchpoints to understand the user journey.
- **Formulating the architecture:** Developing a scalable system design that supports future growth without requiring complete overhauls.
- **Executing the design phase:** Creating wireframes, high-fidelity mockups, and interactive prototypes.

> "A great user experience is not just about aesthetics; it's about reducing friction at every step of the journey."

## Technical Deep Dive
Implementing modern frameworks allows us to achieve significantly better performance metrics. We transitioned the architecture to a headless CMS setup, separating the frontend presentation layer from the backend data logic. This decoupling enabled our development team to iterate faster and deploy updates without causing downtime.

\`\`\`javascript
const optimizePerformance = (assets) => {
  return assets.map(asset => {
    // Implement lazy loading and compression
    return { ...asset, optimized: true, loading: 'lazy' };
  });
};
\`\`\`

## Measurable Results
Post-launch, the analytics demonstrated a clear improvement across all core web vitals. Page load times decreased by 45%, leading to a proportional drop in bounce rates. Furthermore, organic search traffic saw a steady 20% month-over-month growth due to the semantic HTML structure and enhanced SEO strategy.

## Conclusion
Ultimately, the success of a digital transformation project relies on the seamless integration of strategy, design, and engineering. By maintaining a user-centric focus and leveraging the right technologies, we ensure that digital products not only look exceptional but also perform flawlessly at scale.
`;

const blogData = Array.from({ length: 8 }).map((_, i) => ({
  id: `b${i+1}`,
  slug: `the-future-of-digital-strategy-${i+1}`,
  title: `The Future of Digital Strategy and Web Performance Part ${i+1}`,
  excerpt: 'Discover how modern frameworks and cohesive branding can radically transform user engagement and drive measurable business growth in competitive markets.',
  category: ['Web Development', 'Design', 'Strategy'][i % 3],
  tags: ['Performance', 'UX', 'React', 'SEO'],
  readTime: 5 + (i % 4),
  publishedAt: new Date(Date.now() - i * 864000000).toISOString(),
  featured: i === 0,
  coverImage: null,
  content: lipsumContent,
  author: { name: 'Jane Doe', avatar: null }
}));

const portfolioData = Array.from({ length: 6 }).map((_, i) => ({
  id: `p${i+1}`,
  slug: `fintech-dashboard-redesign-${i+1}`,
  title: `Fintech Dashboard Redesign ${i+1}`,
  category: ['Web Development', 'Branding', 'UI/UX'][i % 3],
  tags: ['React', 'Data Viz', 'Finance'],
  summary: 'A comprehensive overhaul of a complex financial dashboard to improve usability and reduce cognitive load for professional traders.',
  thumbnail: null,
  featured: i === 0,
  year: `202${3 - (i%3)}`,
  client: `Acme Corp ${i+1}`,
  duration: '3 Months',
  role: 'Lead UX Designer & Engineer',
  challenge: 'The client possessed a robust legacy system but suffered from low user adoption due to a cluttered interface and slow data rendering. Traders needed to make split-second decisions but were hindered by poor information hierarchy.',
  solution: 'We conducted user interviews with 15 professional traders to map out their actual workflows. Based on these insights, we redesigned the data architecture and implemented a component-driven React application with optimized rendering cycles.',
  results: [
    { metric: '+40%', value: 'User Retention' },
    { metric: '-60%', value: 'Load Time' },
    { metric: '95%', value: 'Task Success' }
  ],
  sections: [
    { heading: 'Discovery Phase', body: 'The discovery phase involved deep-dive sessions with stakeholders to understand business requirements versus user needs. We synthesized these findings into actionable personas and user journey maps.' },
    { heading: 'Design System Implementation', body: 'To ensure consistency and speed up development, we established a comprehensive design system utilizing CSS tokens. This allowed the engineering team to build interfaces modularly without duplicating CSS.' }
  ],
  tools: ['Figma', 'React', 'TypeScript', 'Tailwind'],
  ctaLabel: 'Visit Live Site',
  ctaHref: '#'
}));

const filesToCreate = {
  'data/blog.js': `export const blogPosts = ${JSON.stringify(blogData, null, 2)};\n`,
  'data/portfolio.js': `export const portfolioProjects = ${JSON.stringify(portfolioData, null, 2)};\n`,
};

Object.keys(filesToCreate).forEach(file => {
  const fullPath = path.join(baseDir, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, filesToCreate[file]);
  console.log('Created: ' + file);
});
