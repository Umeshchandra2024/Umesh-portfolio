import { useSelector } from 'react-redux';

export function DashboardHome() {
  const { user } = useSelector((state) => state.user);
  const { items: projects } = useSelector((state) => state.projects);
  const { items: skills } = useSelector((state) => state.skills);
  const { items: timeline } = useSelector((state) => state.timeline);
  const { items: software } = useSelector((state) => state.software);
  const { items: messages } = useSelector((state) => state.messages);

  return (
    <div>
      <h1>Welcome, {user?.name || 'Owner'}</h1>
      <div className="grid">
        <div className="card">
          <h2>Projects</h2>
          <p>{projects.length} total</p>
        </div>
        <div className="card">
          <h2>Skills</h2>
          <p>{skills.length} total</p>
        </div>
        <div className="card">
          <h2>Timeline</h2>
          <p>{timeline.length} entries</p>
        </div>
        <div className="card">
          <h2>Apps / Tools</h2>
          <p>{software.length} items</p>
        </div>
        <div className="card">
          <h2>Messages</h2>
          <p>{messages.length} messages</p>
        </div>
      </div>
    </div>
  );
}

