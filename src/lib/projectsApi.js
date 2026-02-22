const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Fetch all projects from the backend (for portfolio projects section).
 * @returns {Promise<{ success: boolean, projects: Array }>}
 */
export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/api/v1/project`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

/**
 * Fetch a single project by id (for project detail page).
 * @param {string} id - Project _id
 * @returns {Promise<{ success: boolean, project: object }>}
 */
export async function fetchProject(id) {
  const url = `${API_BASE}/api/v1/project/${id}`;
  console.log('Fetching project from:', url);
  const res = await fetch(url);
  console.log('Response status:', res.status, res.statusText);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Error response:', errorData);
    throw new Error(errorData.message || `Failed to fetch project: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  console.log('Project data received:', data);
  return data;
}
