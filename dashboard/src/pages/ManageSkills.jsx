import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSkills } from '../store/skillSlice.js';

export function ManageSkills() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.skills);

  useEffect(() => {
    dispatch(getAllSkills());
  }, [dispatch]);

  return (
    <div>
      <h1>Manage Skills</h1>
      {loading && <p>Loading...</p>}
      <ul className="list">
        {items.map((skill) => (
          <li key={skill._id} className="card">
            <strong>{skill.name}</strong>
            <span>{skill.level}</span>
          </li>
        ))}
      </ul>
      <p>You can extend this page with add/edit/delete forms similar to projects.</p>
    </div>
  );
}

