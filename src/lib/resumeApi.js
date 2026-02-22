const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetch resume URL from the backend (for "Get Resume" button).
 * @returns {Promise<{ success: boolean, resume: { url: string } | null }>}
 */
export async function fetchResume() {
  const res = await fetch(`${API_BASE}/api/v1/resume`);
  if (!res.ok) throw new Error('Failed to fetch resume');
  return res.json();
}

/**
 * Convert resume URL to open inline (view in browser) instead of download.
 * Appends response-content-disposition=inline so the server may return the PDF for display.
 */
export function getResumeViewUrl(url) {
  if (!url || typeof url !== 'string') return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}response-content-disposition=inline`;
}
