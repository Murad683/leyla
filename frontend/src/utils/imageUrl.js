/**
 * Formats image URLs to ensure they resolve correctly in both local development
 * and production deployment environments (Vercel + Render).
 */
export const getImageUrl = (url) => {
  if (!url) return '';
  
  // If it's already an absolute URL, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a dynamic uploaded image path (stored under /uploads)
  if (url.startsWith('/uploads')) {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const backendBase = apiUrl.replace(/\/api$/, '') || 'http://localhost:4000';
    return `${backendBase}${url}`;
  }
  
  // Default to standard local asset path served by Vite
  return url;
};
