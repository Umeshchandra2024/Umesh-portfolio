import { useEffect, useState } from 'react';
import { fetchSkills } from '@/lib/skillsApi';

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
  const [apiSkills, setApiSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSkills()
      .then((data) => {
        if (cancelled) return;
        setApiSkills(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setApiSkills([]);
        console.warn('Skills API failed:', err?.message || err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Original (fallback) skills first, then any dashboard-added skills at the end
  const items = [...FALLBACK_SKILLS, ...apiSkills];

  return (
    <section id="skills" className="section">
      <div className="section-header">
        <div className="section-title-wrapper">
          <div className="title-line" />
          <h2 className="section-title text-tubeLight-effect dancing_text">SKILLS</h2>
          <div className="title-line" />
        </div>
        <p className="section-text">
          I am dedicated to building impactful solutions, embracing challenges with
          perseverance, and constantly pushing the boundaries of innovation.
        </p>
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
            const isFromApi = !!item._id;
            const logoUrl = item.logo?.url;
            return (
              <div key={isFromApi ? item._id : index} className="skill-card-box">
                <div className="skill-icon-wrapper">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="logo-img"
                    />
                  ) : isFromApi ? (
                    <span className="skill-initial">{item.name?.charAt(0) || '?'}</span>
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
