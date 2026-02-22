import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectById, updateProject } from '../store/projectSlice.js';
import { toast } from 'react-toastify';

export function UpdateProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProject, loading, error } = useSelector((state) => state.projects);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [video, setVideo] = useState(null);
  const [techStack, setTechStack] = useState('');

  useEffect(() => {
    if (id) dispatch(getProjectById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProject && currentProject._id === id) {
      setTitle(currentProject.title || '');
      setDescription(currentProject.description || '');
      setGithubUrl(currentProject.githubUrl || '');
      setLiveUrl(currentProject.liveUrl || '');
      setTechStack(currentProject.techStack?.join(', ') || '');
    }
  }, [currentProject, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('githubUrl', githubUrl);
    formData.append('liveUrl', liveUrl);
    formData.append('techStack', techStack);
    if (video) formData.append('video', video);

    const result = await dispatch(updateProject({ id, formData }));
    if (updateProject.fulfilled.match(result)) {
      toast.success('Project updated successfully.');
      navigate('/manage/project');
    } else {
      toast.error(result.payload || 'Failed to update project.');
    }
  };

  if (!currentProject && !loading) {
    return (
      <div className="page">
        <p className="empty-state">Project not found.</p>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/manage/project')}>
          Back to projects
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Update project</h1>
        <p className="page-subtitle">Edit project details.</p>
      </header>

      <section className="section-card">
        <form className="form" onSubmit={handleSubmit}>
          <label className="form-label">
            Title *
            <input
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label className="form-label">
            Description *
            <textarea
              className="form-input form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Example:
# Project Overview
This is a brief overview of the project.

## Features
- Feature 1
- Feature 2
- Feature 3`}
              rows={10}
              required
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
              Use # for headings, ## for subheadings, and - or * for bullet points. Separate paragraphs with blank lines.
            </small>
          </label>
          <label className="form-label">
            GitHub URL
            <input
              type="url"
              className="form-input"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </label>
          <label className="form-label">
            Live URL
            <input
              type="url"
              className="form-input"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
            />
          </label>
          <label className="form-label">
            New Video File (optional, replaces current)
            <input
              type="file"
              accept="video/*"
              className="form-input"
              onChange={(e) => setVideo(e.target.files[0])}
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
              Upload a video file (MP4, WebM, etc.) to replace the current video
            </small>
          </label>
          {currentProject?.video?.url && (
            <div style={{ marginBottom: '1rem' }}>
              <p className="list-item-desc" style={{ marginBottom: '0.5rem' }}>Current video:</p>
              <video
                src={currentProject.video.url}
                controls
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
              />
            </div>
          )}
          <label className="form-label">
            Tech Stack (comma-separated)
            <input
              type="text"
              className="form-input"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="React, Node.js, MongoDB, Express"
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
              Separate technologies with commas
            </small>
          </label>
          {error && <p className="auth-error">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Update project'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/manage/project')}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
