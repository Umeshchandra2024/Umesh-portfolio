import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllProjects, createProject, deleteProject } from '../store/projectSlice.js';

export function ManageProjects() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.projects);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [video, setVideo] = useState(null);
  const [techStack, setTechStack] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('githubUrl', githubUrl);
    formData.append('liveUrl', liveUrl);
    formData.append('techStack', techStack);
    if (video) formData.append('video', video);

    const result = await dispatch(createProject(formData));
    if (createProject.fulfilled.match(result)) {
      setTitle('');
      setDescription('');
      setGithubUrl('');
      setLiveUrl('');
      setVideo(null);
      setTechStack('');
      setSuccessMsg('Project added successfully.');
      dispatch(getAllProjects());
    }
  };

  const handleDelete = async (projectId, projectTitle) => {
    if (window.confirm(`Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`)) {
      const result = await dispatch(deleteProject(projectId));
      if (deleteProject.fulfilled.match(result)) {
        toast.success('Project deleted successfully.');
        dispatch(getAllProjects());
      } else {
        toast.error(result.payload || 'Failed to delete project.');
      }
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Manage Projects</h1>
        <p className="page-subtitle">Add and edit portfolio projects.</p>
      </header>

      <section className="section-card">
        <h2 className="section-title">Add project</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label className="form-label">
            Title
            <input
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label className="form-label">
            Description
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
- Feature 3

## Technologies Used
- React
- Node.js
- MongoDB`}
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
            Video File *
            <input
              type="file"
              accept="video/*"
              className="form-input"
              onChange={(e) => setVideo(e.target.files[0])}
              required
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
              Upload a video file (MP4, WebM, etc.)
            </small>
          </label>
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
          {successMsg && <p className="success-msg">{successMsg}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Add project'}
          </button>
        </form>
      </section>

      <section className="section-card">
        <h2 className="section-title">Existing projects ({items.length})</h2>
        {items.length === 0 ? (
          <p className="empty-state">No projects yet. Add one above.</p>
        ) : (
          <ul className="list">
            {items.map((project) => (
              <li key={project._id} className="list-item">
                {project.video?.url && (
                  <div style={{ width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: '#000', flexShrink: 0 }}>
                    <video
                      src={project.video.url}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      muted
                      playsInline
                    />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <strong>{project.title}</strong>
                  <p className="list-item-desc">{project.description}</p>
                  {project.techStack?.length > 0 && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      {project.techStack.join(', ')}
                    </p>
                  )}
                  <div className="form-actions" style={{ marginTop: '0.5rem' }}>
                    <Link to={`/views/project/${project._id}`} className="btn btn-ghost btn-sm">View</Link>
                    <Link to={`/update/project/${project._id}`} className="btn btn-ghost btn-sm">Edit</Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(project._id, project.title)}
                      className="btn btn-danger btn-sm"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
