import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects } from '@/lib/projectsApi';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchProjects()
      .then((data) => {
        console.log('Projects data:', data);
        if (!cancelled) {
          const projectsList = data.projects || [];
          console.log('Projects list:', projectsList);
          // Log video URLs for debugging
          projectsList.forEach((p, i) => {
            console.log(`Project ${i}: ${p.title}`);
            console.log(`  - _id: ${p._id}`);
            console.log(`  - video:`, p.video);
            console.log(`  - video?.url:`, p.video?.url);
            console.log(`  - All keys:`, Object.keys(p));
          });
          setProjects(projectsList);
        }
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="projects" className="section">
      <div className="section-header">
        <div className="section-title-wrapper">
          <div className="title-line" />
          <h2 className="section-title text-tubeLight-effect dancing_text">MY PROJECTS</h2>
          <div className="title-line" />
        </div>
      </div>
      {error && (
        <p className="text-center text-red-500 mb-4">{error}</p>
      )}
      {loading ? (
        <p className="text-center text-gray-500">Loading projects...</p>
      ) : (
        <div className="grid projects-grid">
          {projects.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No projects yet.</p>
          ) : (
            projects.map((project) => (
              <Link 
                key={project._id} 
                to={`/project/${project._id}`} 
                className="card project-card project-card-link"
              >
                {project.video?.url ? (
                  <div className="project-video-wrapper-full">
                    <video
                      src={project.video.url}
                      className="project-video-full"
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => {
                        e.target.pause();
                        e.target.currentTime = 0;
                      }}
                      onError={(e) => {
                        console.error('Video load error:', e);
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="project-card-overlay">
                      <div className="project-card-overlay-content">
                        <h3 className="project-card-title">{project.title}</h3>
                        <p className="project-card-view-details">Click to view details</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="project-video-wrapper-full project-video-placeholder">
                    <div className="project-video-placeholder-content">
                      <span>📹</span>
                      <p>{project.title}</p>
                      <p style={{ fontSize: '14px', marginTop: '8px' }}>No video available</p>
                    </div>
                  </div>
                )}
              </Link>
            ))
          )}
        </div>
      )}
    </section>
  );
}
