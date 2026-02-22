import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FALLBACK_APPS = [
  { 
    name: 'Github', 
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
    color: '#000000' 
  },
  { 
    name: 'VS Code', 
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
    color: '#007ACC' 
  },
  { 
    name: 'Chrome', 
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg',
    color: '#4285F4' 
  },
  { 
    name: 'Postman', 
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg',
    color: '#FF6C37' 
  },
  { 
    name: 'GitLab', 
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg',
    color: '#FC6D26' 
  },
  { 
    name: 'MongoDB Compass', 
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    color: '#47A248' 
  },
  { 
    name: 'Linux', 
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
    color: '#FCC624' 
  },
  { 
    name: 'Gemini', 
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
    color: '#1A73E8' 
  },
];

// Helper to optimize Cloudinary URLs
function cloudinaryOptimize(url, opts = { width: 64 }) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('cloudinary.com')) return url;
  const transform = `w_${opts.width},f_auto,q_auto`;
  return url.replace(/\/upload\//, `/upload/${transform}/`);
}

// Helper to get logo filter style
function getLogoFilter(appName) {
  return 'brightness(1.1) saturate(1.2)';
}

// Helper to check if app needs white logo
function needsWhiteLogo(appName) {
  return false;
}

export default function MyApps() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API_BASE}/api/v1/software`)
      .then((response) => {
        if (!cancelled) {
          const appsData = response.data?.apps || [];
          if (appsData.length > 0) {
            setApps(appsData);
          } else {
            setUseFallback(true);
          }
        }
      })
      .catch((error) => {
        console.error('Failed to fetch apps:', error);
        if (!cancelled) setUseFallback(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const items = useFallback ? FALLBACK_APPS : apps;

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-title-wrapper">
          <div className="title-line" />
          <h2 className="section-title text-tubeLight-effect dancing_text">MY APPS</h2>
          <div className="title-line" />
        </div>
      </div>
      {loading ? (
        <div className="apps-grid" style={{ opacity: 0.6 }}>
          {FALLBACK_APPS.slice(0, 6).map((app, index) => (
            <div key={index} className="app-card-box">
              <div className={`app-icon-wrapper ${needsWhiteLogo(app.name) ? 'app-icon-dark-bg' : ''}`}>
                {app.logoUrl ? (
                  <img
                    src={app.logoUrl}
                    alt={app.name}
                    width={48}
                    height={48}
                    className="app-logo-img"
                    style={{ filter: getLogoFilter(app.name) }}
                  />
                ) : (
                  <div className="app-placeholder">{app.name.charAt(0).toUpperCase()}</div>
                )}
              </div>
              <p className="app-name">{app.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="apps-grid">
          {items.map((item, index) => {
            const hasLogo = item.logo?.url;
            const isFromApi = !useFallback;
            // Check if it's a fallback app with logoUrl
            const fallbackApp = useFallback ? FALLBACK_APPS.find((app) => 
              app.name.toLowerCase() === item.name.toLowerCase()
            ) : null;
            
            return (
              <div key={isFromApi ? item._id || item.name : index} className="app-card-box">
                <div className={`app-icon-wrapper ${needsWhiteLogo(item.name) ? 'app-icon-dark-bg' : ''}`}>
                  {hasLogo ? (
                    <img
                      src={cloudinaryOptimize(item.logo.url, { width: 64 })}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="app-logo-img"
                      onError={(e) => {
                        // Fallback to CDN logo if Cloudinary image fails
                        e.target.style.display = 'none';
                        const fallback = FALLBACK_APPS.find((app) => 
                          app.name.toLowerCase().includes(item.name.toLowerCase()) ||
                          item.name.toLowerCase().includes(app.name.toLowerCase())
                        );
                        if (fallback?.logoUrl) {
                          const img = document.createElement('img');
                          img.src = fallback.logoUrl;
                          img.alt = item.name;
                          img.width = 48;
                          img.height = 48;
                          img.className = 'app-logo-img';
                          img.style.filter = getLogoFilter(item.name);
                          e.target.parentElement.appendChild(img);
                        } else {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'app-placeholder';
                          placeholder.textContent = item.name.charAt(0).toUpperCase();
                          e.target.parentElement.appendChild(placeholder);
                        }
                      }}
                    />
                  ) : fallbackApp?.logoUrl ? (
                    <img
                      src={fallbackApp.logoUrl}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="app-logo-img"
                      style={{ filter: getLogoFilter(item.name) }}
                    />
                  ) : (
                    <div className="app-placeholder">{item.name.charAt(0).toUpperCase()}</div>
                  )}
                </div>
                <p className="app-name">{item.name}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
