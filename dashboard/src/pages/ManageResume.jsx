import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getResume, updateResume } from '../store/resumeSlice.js';
import { toast } from 'react-toastify';

export function ManageResume() {
  const dispatch = useDispatch();
  const { resume, loading, error } = useSelector((state) => state.resume);
  const [url, setUrl] = useState('');

  useEffect(() => {
    dispatch(getResume());
  }, [dispatch]);

  useEffect(() => {
    if (resume?.url) {
      setUrl(resume.url);
    } else {
      setUrl('');
    }
  }, [resume]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error('Please enter the resume URL');
      return;
    }
    const result = await dispatch(updateResume(url.trim()));
    if (updateResume.fulfilled.match(result)) {
      toast.success('Resume updated successfully.');
    } else {
      toast.error(result.payload || 'Failed to update resume.');
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Resume</h1>
        <p className="page-subtitle">Set the Cloudinary (or any) link for your resume. The &quot;Get Resume&quot; button on your portfolio will open this link.</p>
      </header>

      <section className="section-card">
        <h2 className="section-title">Resume URL</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label className="form-label">
            Resume Link
            <input
              type="url"
              className="form-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/your-cloud/image/upload/.../resume.pdf"
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
              Paste your resume URL (e.g. Cloudinary direct link to PDF). When visitors click &quot;Get Resume&quot; on your portfolio, this link will open.
            </small>
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : resume ? 'Update Resume' : 'Save Resume'}
          </button>
        </form>

        {resume?.url && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--hover)', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Current resume link:</p>
            <a href={resume.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', wordBreak: 'break-all' }}>
              {resume.url}
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
