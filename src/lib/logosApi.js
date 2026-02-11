const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetch logos from backend. Optional category: 'skill' | 'app'
 * @param {string} [category] - 'skill' or 'app' to filter
 * @returns {Promise<Array>} logos
 */
export async function fetchLogos(category) {
  const url = category ? `${API_BASE}/api/logos?category=${category}` : `${API_BASE}/api/logos`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch logos');
  return res.json();
}

/**
 * Optional: Optimize Cloudinary URL with transformations (w_48, f_auto, q_auto)
 * Use when your logo URLs are from Cloudinary.
 * @param {string} url - Full Cloudinary URL
 * @param {object} opts - { width: 48 }
 * @returns {string} URL with transform or original
 */
export function cloudinaryOptimize(url, opts = { width: 48 }) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('cloudinary.com')) return url;
  // Cloudinary: insert transform after /upload/ -> /upload/w_48,f_auto,q_auto/
  const transform = `w_${opts.width},f_auto,q_auto`;
  return url.replace(/\/upload\//, `/upload/${transform}/`);
}
