import { useEffect, useState } from 'react';
import { fetchLogos, cloudinaryOptimize } from '@/lib/logosApi';

const FALLBACK_SKILLS = [
  { name: 'HTML', devicon: 'devicon-html5-plain', color: '#e34c26' },
  { name: 'CSS', devicon: 'devicon-css3-plain', color: '#264de4' },
  { name: 'JavaScript', devicon: 'devicon-javascript-plain', color: '#f7df1e' },
  { name: 'React.JS', devicon: 'devicon-react-original', color: '#61dafb' },
  { name: 'Node.JS', devicon: 'devicon-nodejs-plain', color: '#339933' },
  { name: 'Express.Js', devicon: 'devicon-express-original', color: '#ffffff' },
  { name: 'MongoDB', devicon: 'devicon-mongodb-plain', color: '#47a248' },
  { name: 'SQL', devicon: 'devicon-mysql-plain', color: '#336791' },
  { name: 'TailwindCSS', devicon: 'devicon-tailwindcss-plain', color: '#06b6d4' },
  { name: 'Bootstrap', devicon: 'devicon-bootstrap-plain', color: '#7952b3' },
  { name: 'Python', devicon: 'devicon-python-plain', color: '#3776ab' },
];

export default function Skills() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchLogos('skill')
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

  const items = useFallback ? FALLBACK_SKILLS : logos;

  return (
    <section id="skills" className="section">
      <div className="section-header">
        <p className="section-text">
          I am dedicated to building impactful solutions, embracing challenges with
          perseverance, and constantly pushing the boundaries of innovation.
        </p>
        <h2 className="section-title text-tubeLight-effect dancing_text">SKILLS</h2>
      </div>
      {loading ? (
        <div className="skills-grid" style={{ opacity: 0.6 }}>
          {FALLBACK_SKILLS.slice(0, 6).map((skill, index) => (
            <div key={index} className="skill-card-box">
              <div className="skill-icon-wrapper" />
              <p className="skill-name">{skill.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="skills-grid">
          {items.map((item, index) => {
            const isFromApi = item.svg?.url;
            return (
              <div key={isFromApi ? item._id : index} className="skill-card-box">
                <div className="skill-icon-wrapper">
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
                <p className="skill-name">{item.name}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
