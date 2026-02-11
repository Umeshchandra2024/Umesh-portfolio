/**
 * POST your Apps logos to the backend API using Axios.
 * Run with backend server running: npm run post-apps
 * From backend folder: npm run post-apps
 */
import axios from 'axios';

const API_BASE = process.env.API_URL || 'http://localhost:5000';

const appsLogos = [
  {
    name: 'MongoDB',
    category: 'app',
    svg: {
      public_id: 'portfolio-logos/mongodb',
      url: 'https://res.cloudinary.com/duo6fgjhq/image/upload/v1769854107/MongoDB_yoted9.svg',
    },
  },
  {
    name: 'VS Code',
    category: 'app',
    svg: {
      public_id: 'portfolio-logos/vscode',
      url: 'https://res.cloudinary.com/duo6fgjhq/image/upload/v1769853753/visual-studio-code_kp18dp.svg',
    },
  },
  {
    name: 'Chrome',
    category: 'app',
    svg: {
      public_id: 'portfolio-logos/chrome',
      url: 'https://res.cloudinary.com/duo6fgjhq/image/upload/v1769853752/chrome_dldezd.svg',
    },
  },
  {
    name: 'Claude',
    category: 'app',
    svg: {
      public_id: 'portfolio-logos/claude',
      url: 'https://res.cloudinary.com/duo6fgjhq/image/upload/v1769853750/claude-color_ldxais.svg',
    },
  },
  {
    name: 'Github',
    category: 'app',
    svg: {
      public_id: 'portfolio-logos/github',
      url: 'https://res.cloudinary.com/duo6fgjhq/image/upload/v1769853751/github-color_vln6ie.svg',
    },
  },
  {
    name: 'PowerShell',
    category: 'app',
    svg: {
      public_id: 'portfolio-logos/powershell',
      url: 'https://res.cloudinary.com/duo6fgjhq/image/upload/v1769853750/powershell_pvzkle.svg',
    },
  },
  {
    name: 'Linux',
    category: 'app',
    svg: {
      public_id: 'portfolio-logos/linux',
      url: 'https://res.cloudinary.com/duo6fgjhq/image/upload/v1769853750/linux_yyu5cl.svg',
    },
  },
  {
    name: 'Postman',
    category: 'app',
    svg: {
      public_id: 'portfolio-logos/postman',
      url: 'https://res.cloudinary.com/duo6fgjhq/image/upload/v1769853750/postman_frxx4z.svg',
    },
  },
];

async function postApps() {
  try {
    // Remove existing app logos so we don't duplicate
    await axios.delete(`${API_BASE}/api/logos?category=app`).catch(() => {});
    const res = await axios.post(`${API_BASE}/api/logos`, appsLogos, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Posted', res.data.length, 'apps to database:', res.data.map((l) => l.name).join(', '));
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.error('Failed to post apps:', msg);
    if (err.response?.status === 400) console.error('Body:', err.response?.data);
    process.exit(1);
  }
}

postApps();
