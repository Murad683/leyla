/**
 * Formats image URLs to resolve correctly across environments and, for
 * Cloudinary-hosted images, to request WebP/AVIF + auto quality on delivery.
 */
const withCloudinaryAuto = (url) => {
  if (
    url.includes('res.cloudinary.com') &&
    url.includes('/image/upload/') &&
    !/\/upload\/[^/]*\b(f_|q_)/.test(url)
  ) {
    return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
  }
  return url;
};

export const getImageUrl = (url) => {
  if (!url) return '';

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return withCloudinaryAuto(url);
  }

  // Dynamic uploaded image path (stored under /uploads)
  if (url.startsWith('/uploads')) {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const backendBase = apiUrl.replace(/\/api$/, '') || 'http://localhost:4000';
    return `${backendBase}${url}`;
  }

  // Standard local asset served by Vite
  return url;
};
