export const generateStructuredData = (type, data) => {
  const base = {
    '@context': 'https://schema.org',
    '@type': type
  };
  return JSON.stringify({ ...base, ...data });
};
