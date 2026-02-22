import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchProject } from '@/lib/projectsApi';
import { Button } from '@/components/ui/button';
import FormattedDescription from '@/components/FormattedDescription';

export default function ProjectView() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetchProject(id)
      .then((data) => {
        console.log('Project data:', data);
        if (data.success && data.project) {
          setProject(data.project);
        } else {
          throw new Error('Invalid project data received');
        }
      })
      .catch((err) => {
        console.error('Error fetching project:', err);
        toast.error(err.message || 'Failed to load project details');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleReturnToPortfolio = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="page flex justify-center items-center min-h-[50vh]">
        <p>Loading...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page flex justify-center items-center min-h-[50vh]">
        <p>Project not found.</p>
        <Button onClick={() => navigate('/')} className="ml-4">Back to home</Button>
      </div>
    );
  }

  return (
    <div className="page project-detail-page">
      <div className="flex mt-7 justify-center items-start min-h-[100vh] sm:gap-4 sm:py-4">
        <div className="w-[100%] px-5 md:w-[1000px] pb-5">
          <div className="space-y-8">
            {/* Header with back button */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handleReturnToPortfolio}
                className="project-back-btn"
              >
                ← Back to Portfolio
              </button>
            </div>

            {/* Project Title */}
            <h1 className="project-detail-title">{project.title}</h1>

            {/* Video Section */}
            {project.video?.url ? (
              <div className="project-detail-video-wrapper">
                <video
                  src={project.video.url}
                  controls
                  autoPlay
                  className="project-detail-video"
                  onError={(e) => {
                    console.error('Video load error:', e);
                    toast.error('Failed to load video');
                  }}
                />
              </div>
            ) : (
              <div className="project-detail-video-wrapper project-video-placeholder">
                <div className="project-video-placeholder-content">
                  <span>📹</span>
                  <p>No video available for this project</p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="project-detail-section">
              <h2 className="project-detail-section-title">About This Project</h2>
              <div className="project-detail-description">
                <FormattedDescription text={project.description} />
              </div>
            </div>

            {/* Tech Stack */}
            {project.techStack?.length > 0 && (
              <div className="project-detail-section">
                <h2 className="project-detail-section-title">Technologies Used</h2>
                <div className="project-detail-tech-stack">
                  {project.techStack.map((tech, index) => (
                    <span key={index} className="tech-badge">{tech}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="project-detail-section">
              <h2 className="project-detail-section-title">Project Links</h2>
              <div className="project-detail-links">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-detail-link-btn live-demo"
                  >
                    🌐 Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-detail-link-btn github"
                  >
                    💻 GitHub Repository
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
