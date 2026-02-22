const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetch skills from the backend (for portfolio Skills section).
 * @returns {Promise<Array<{ _id: string, name: string, level: string, logo?: { url: string } }>>}
 */
export async function fetchSkills() {
  const url = `${API_BASE}/api/v1/skill`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    let msg = `Failed to fetch skills (${res.status})`;
    try {
      const json = JSON.parse(text);
      if (json.message) msg = json.message;
    } catch (_) {}
    throw new Error(msg);
  }
  const data = await res.json();
  const list = data.skills ?? data;
  return Array.isArray(list) ? list : [];
}
