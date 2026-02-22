import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  getAllSkills,
  addSkill,
  updateSkill,
  deleteSkill,
} from '../store/skillSlice.js';

const LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const emptyForm = {
  name: '',
  level: 'advanced',
  category: 'general',
  order: '0',
};

export function ManageSkills() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.skills);
  const [form, setForm] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editLogoFile, setEditLogoFile] = useState(null);

  useEffect(() => {
    dispatch(getAllSkills());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const setFormFromSkill = (skill) => {
    setForm({
      name: skill.name || '',
      level: skill.level || 'advanced',
      category: skill.category || 'general',
      order: String(skill.order ?? 0),
    });
    setEditingId(skill._id);
    setEditLogoFile(null);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setLogoFile(null);
    setEditingId(null);
    setEditLogoFile(null);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Skill name is required.');
      return;
    }
    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('level', form.level);
    formData.append('category', form.category.trim() || 'general');
    formData.append('order', form.order === '' ? '0' : form.order);
    if (logoFile) formData.append('logo', logoFile);

    const result = await dispatch(addSkill(formData));
    if (addSkill.fulfilled.match(result)) {
      toast.success('Skill added successfully.');
      resetForm();
      dispatch(getAllSkills());
    } else {
      toast.error(result.payload || 'Failed to add skill.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingId || !form.name.trim()) {
      toast.error('Skill name is required.');
      return;
    }
    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('level', form.level);
    formData.append('category', form.category.trim() || 'general');
    formData.append('order', form.order === '' ? '0' : form.order);
    if (editLogoFile) formData.append('logo', editLogoFile);

    const result = await dispatch(updateSkill({ id: editingId, formData }));
    if (updateSkill.fulfilled.match(result)) {
      toast.success('Skill updated successfully.');
      resetForm();
      dispatch(getAllSkills());
    } else {
      toast.error(result.payload || 'Failed to update skill.');
    }
  };

  const handleDelete = async (skillId, skillName) => {
    if (!window.confirm(`Delete skill "${skillName}"? This cannot be undone.`)) return;
    const result = await dispatch(deleteSkill(skillId));
    if (deleteSkill.fulfilled.match(result)) {
      toast.success('Skill deleted.');
      if (editingId === skillId) resetForm();
    } else {
      toast.error(result.payload || 'Failed to delete skill.');
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Manage Skills</h1>
        <p className="page-subtitle">Add, edit, and remove skills shown on your portfolio.</p>
      </header>

      <section className="section-card">
        <h2 className="section-title">Add skill</h2>
        <form className="form" onSubmit={handleAddSubmit}>
          <label className="form-label">
            Name <span style={{ color: 'var(--danger)' }}>*</span>
            <input
              className="form-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. React, Node.js"
              required
            />
          </label>
          <label className="form-label">
            Level
            <select
              className="form-input"
              name="level"
              value={form.level}
              onChange={handleChange}
            >
              {LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="form-label">
            Category
            <input
              className="form-input"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. frontend, backend"
            />
          </label>
          <label className="form-label">
            Order (number, lower first)
            <input
              type="number"
              min="0"
              className="form-input"
              name="order"
              value={form.order}
              onChange={handleChange}
            />
          </label>
          <label className="form-label">
            Logo (optional image)
            <input
              type="file"
              accept="image/*"
              className="form-input"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
          </label>
          <button type="submit" className="btn btn-primary">
            Add skill
          </button>
        </form>
      </section>

      <section className="section-card">
        <h2 className="section-title">Skills ({items.length})</h2>
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : items.length === 0 ? (
          <p className="empty-state">No skills yet. Add one above.</p>
        ) : (
          <ul className="list skill-list">
            {items.map((skill) => (
              <li key={skill._id} className="list-item skill-item">
                {skill.logo?.url && (
                  <img src={skill.logo.url} alt="" className="skill-logo" />
                )}
                <div className="skill-item-info">
                  <strong>{skill.name}</strong>
                  <span className="skill-meta">
                    {skill.level} {skill.category && ` · ${skill.category}`} (order: {skill.order ?? 0})
                  </span>
                </div>
                <div className="skill-item-actions">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setFormFromSkill(skill)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(skill._id, skill.name)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editingId && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="section-title">Edit skill</h2>
            <form className="form" onSubmit={handleEditSubmit}>
              <label className="form-label">
                Name <span style={{ color: 'var(--danger)' }}>*</span>
                <input
                  className="form-input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="form-label">
                Level
                <select
                  className="form-input"
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                >
                  {LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-label">
                Category
                <input
                  className="form-input"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                />
              </label>
              <label className="form-label">
                Order
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                />
              </label>
              <label className="form-label">
                New logo (optional, leave empty to keep current)
                <input
                  type="file"
                  accept="image/*"
                  className="form-input"
                  onChange={(e) => setEditLogoFile(e.target.files?.[0] || null)}
                />
              </label>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
                <button type="button" className="btn btn-ghost" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
