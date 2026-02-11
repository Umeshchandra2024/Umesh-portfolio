/**
 * Seed logos into MongoDB. Replace placeholder URLs with your Cloudinary (or CDN) URLs.
 * Run from backend folder: node scripts/seed.js
 * Ensure MONGO_URI is set in .env and server is not required (uses mongoose only).
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import Logo from '../models/Logo.js';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('Set MONGO_URI in .env');
  process.exit(1);
}

const skillLogos = [
  { name: 'HTML', category: 'skill', svg: { public_id: 'portfolio-logos/html', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' } },
  { name: 'CSS', category: 'skill', svg: { public_id: 'portfolio-logos/css', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' } },
  { name: 'JavaScript', category: 'skill', svg: { public_id: 'portfolio-logos/js', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' } },
  { name: 'React', category: 'skill', svg: { public_id: 'portfolio-logos/react', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' } },
  { name: 'Node.JS', category: 'skill', svg: { public_id: 'portfolio-logos/node', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' } },
  { name: 'MongoDB', category: 'skill', svg: { public_id: 'portfolio-logos/mongodb', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' } },
  { name: 'Python', category: 'skill', svg: { public_id: 'portfolio-logos/python', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' } },
];

const appLogos = [
  { name: 'Github', category: 'app', svg: { public_id: 'portfolio-logos/github', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' } },
  { name: 'VS Code', category: 'app', svg: { public_id: 'portfolio-logos/vscode', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' } },
  { name: 'Chrome', category: 'app', svg: { public_id: 'portfolio-logos/chrome', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg' } },
  { name: 'Postman', category: 'app', svg: { public_id: 'portfolio-logos/postman', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg' } },
  { name: 'Linux', category: 'app', svg: { public_id: 'portfolio-logos/linux', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' } },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  await Logo.deleteMany({});
  await Logo.insertMany([...skillLogos, ...appLogos]);
  console.log('Seeded', skillLogos.length + appLogos.length, 'logos');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
