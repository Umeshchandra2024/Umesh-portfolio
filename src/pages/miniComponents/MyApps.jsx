import { useEffect, useState } from 'react';
import { fetchLogos, cloudinaryOptimize } from '@/lib/logosApi';

const FALLBACK_APPS = [
  { name: 'Github', devicon: 'devicon-github-original', color: '#181717' },
  { name: 'VS Code', devicon: 'devicon-vscode-plain', color: '#007ACC' },
  { name: 'Chrome', devicon: 'devicon-chrome-plain', color: '#4285F4' },
  { name: 'Postman', devicon: 'devicon-postman-plain', color: '#FF6C37' },
  { name: 'GitLab', devicon: 'devicon-gitlab-plain', color: '#FC6D26' },
  { name: 'MongoDB Compass', devicon: 'devicon-mongodb-plain', color: '#47A248' },
  { name: 'Linux', devicon: 'devicon-linux-plain', color: '#FCC624' },
  { name: 'Notion', devicon: 'devicon-notion-plain', color: '#000000' },
  { name: 'ChatGPT', devicon: 'devicon-openai-plain', color: '#00A67E' },
  { name: 'Gemini', devicon: 'devicon-google-plain', color: '#1A73E8' },
  { name: 'Microsoft Copilot', devicon: 'devicon-microsoft-plain', color: '#0078D4' },
];

export default function MyApps() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchLogos('app')
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setLogos(data);
        } else {
          setUseFallback(true);
        }
      })
      .catch(() => setUseFallback(true))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const items = useFallback ? FALLBACK_APPS : logos;

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title dancing_text">My Apps</h2>
      </div>
      {loading ? (
        <div className="apps-grid" style={{ opacity: 0.6 }}>
          {FALLBACK_APPS.slice(0, 6).map((app, index) => (
            <div key={index} className="app-card-box">
              <div className="app-icon-wrapper" />
              <p className="app-name">{app.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="apps-grid">
          {items.map((item, index) => {
            const isFromApi = item.svg?.url;
            return (
              <div key={isFromApi ? item._id : index} className="app-card-box">
                <div className="app-icon-wrapper">
                  {isFromApi ? (
                    <img
                      src={cloudinaryOptimize(item.svg.url, { width: 48 })}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="logo-img"
                    />
                  ) : (
                    <i className={`${item.devicon} colored`} style={{ color: item.color }} />
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
