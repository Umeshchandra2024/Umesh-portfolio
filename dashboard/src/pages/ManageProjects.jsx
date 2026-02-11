import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProjects, createProject } from '../store/projectSlice.js';

export function ManageProjects() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.projects);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    dispatch(getAllProjects());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('githubUrl', githubUrl);
    formData.append('liveUrl', liveUrl);
    if (image) formData.append('image', image);

    dispatch(createProject(formData));
    setTitle('');
    setDescription('');
    setGithubUrl('');
    setLiveUrl('');
    setImage(null);
  };

  return (
    <div>
      <h1>Manage Projects</h1>
      <form className="card" onSubmit={handleSubmit}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label>
          GitHub URL
          <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
        </label>
        <label>
          Live URL
          <input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} />
        </label>
        <label>
          Image
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Add Project'}
        </button>
      </form>

      <h2>Existing Projects</h2>
      <ul className="list">
        {items.map((project) => (
          <li key={project._id} className="card">
            <strong>{project.title}</strong>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

