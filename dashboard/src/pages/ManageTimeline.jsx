import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTimeline,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
} from '../store/timelineSlice.js';

const emptyForm = {
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  type: 'experience',
};

export function ManageTimeline() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.timeline);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    dispatch(getTimeline());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const setFormFromItem = (item) => {
    setForm({
      title: item.title || '',
      company: item.company || '',
      location: item.location || '',
      startDate: item.startDate ? item.startDate.slice(0, 10) : '',
      endDate: item.endDate ? item.endDate.slice(0, 10) : '',
      current: !!item.current,
      description: item.description || '',
      type: item.type || 'experience',
    });
    setEditingId(item._id);
    setSuccessMsg('');
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    const payload = {
      title: form.title,
      company: form.company || undefined,
      location: form.location || undefined,
      startDate: form.startDate || undefined,
      endDate: form.current ? undefined : form.endDate || undefined,
      current: form.current,
      description: form.description || undefined,
      type: form.type,
    };
    if (editingId) {
      const result = await dispatch(updateTimelineItem({ id: editingId, payload }));
      if (updateTimelineItem.fulfilled.match(result)) {
        setSuccessMsg('Timeline item updated.');
        resetForm();
        dispatch(getTimeline());
      }
    } else {
      const result = await dispatch(createTimelineItem(payload));
      if (createTimelineItem.fulfilled.match(result)) {
        setSuccessMsg('Timeline item added.');
        resetForm();
        dispatch(getTimeline());
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this timeline item?')) return;
    const result = await dispatch(deleteTimelineItem(id));
    if (deleteTimelineItem.fulfilled.match(result)) {
      if (editingId === id) resetForm();
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Manage Timeline</h1>
        <p className="page-subtitle">Add and edit education / experience entries.</p>
      </header>

      <section className="section-card">
        <h2 className="section-title">{editingId ? 'Edit entry' : 'Add timeline entry'}</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label className="form-label">
            Title *
            <input
              className="form-input"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-label">
            Company / Institution
            <input
              className="form-input"
              name="company"
              value={form.company}
              onChange={handleChange}
            />
          </label>
          <label className="form-label">
            Location
            <input
              className="form-input"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </label>
          <div className="form-row">
            <label className="form-label">
              Start date *
              <input
                type="date"
                className="form-input"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </label>
            <label className="form-label">
              End date
              <input
                type="date"
                className="form-input"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                disabled={form.current}
              />
            </label>
          </div>
          <label className="form-label form-label--row">
            <input
              type="checkbox"
              name="current"
              checked={form.current}
              onChange={handleChange}
            />
            <span>I currently work / study here</span>
          </label>
          <label className="form-label">
            Type
            <select
              className="form-input"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="experience">Experience</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="form-label">
            Description
            <textarea
              className="form-input form-textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          {successMsg && <p className="success-msg">{successMsg}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update' : 'Add entry'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-ghost" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="section-card">
        <h2 className="section-title">Timeline entries ({items.length})</h2>
        {items.length === 0 ? (
          <p className="empty-state">No timeline entries yet.</p>
        ) : (
          <ul className="list">
            {items.map((item) => (
              <li key={item._id} className="list-item timeline-item">
                <div className="timeline-item-main">
                  <strong>{item.title}</strong>
                  {item.company && <span className="timeline-company">{item.company}</span>}
                  <span className="timeline-dates">
                    {item.startDate ? new Date(item.startDate).toLocaleDateString() : ''}
                    {item.endDate
                      ? ` – ${new Date(item.endDate).toLocaleDateString()}`
                      : item.current
                        ? ' – Present'
                        : ''}
                  </span>
                  {item.description && (
                    <p className="list-item-desc">{item.description}</p>
                  )}
                </div>
                <div className="timeline-item-actions">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setFormFromItem(item)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-danger"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
