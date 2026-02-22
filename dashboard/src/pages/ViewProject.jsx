import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectById } from '../store/projectSlice.js';
import FormattedDescription from '../components/FormattedDescription.jsx';

export function ViewProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProject, loading } = useSelector((state) => state.projects);

  useEffect(() => {
    if (id) dispatch(getProjectById(id));
  }, [dispatch, id]);

  if (loading && !currentProject) {
    return (
      <div className="page">
        <div className="loading-screen">
          <div className="spinner" />
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="page">
        <p className="empty-state">Project not found.</p>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/manage/project')}>
          Back to projects
        </button>
      </div>
    );
  }

  const p = currentProject;

  return (
    <div className="page">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>View project</h1>
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate('/manage/project')}
          >
            Back to list
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate(`/update/project/${p._id}`)}
          >
            Edit project
          </button>
        </div>
      </header>

      <section className="section-card">
        {p.image?.url && (
          <img
            src={p.image.url}
            alt={p.title}
            className="list-item-img"
            style={{ maxWidth: '100%', height: 'auto', marginBottom: '1rem' }}
          />
        )}
        <h2 className="section-title">{p.title}</h2>
        <div className="list-item-desc">
          <FormattedDescription text={p.description} />
        </div>
        {p.techStack?.length > 0 && (
          <p><strong>Tech stack:</strong> {p.techStack.join(', ')}</p>
        )}
        {p.githubUrl && (
          <p>
            <strong>GitHub:</strong>{' '}
            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">{p.githubUrl}</a>
          </p>
        )}
        {p.liveUrl && (
          <p>
            <strong>Live:</strong>{' '}
            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">{p.liveUrl}</a>
          </p>
        )}
      </section>
    </div>
  );
}
