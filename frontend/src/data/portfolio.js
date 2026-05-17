export const portfolioProjects = Array.from({ length: 6 }).map((_, i) => ({
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
