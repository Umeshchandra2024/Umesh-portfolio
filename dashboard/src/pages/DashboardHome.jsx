import { useSelector } from 'react-redux';

export function DashboardHome() {
  const { user } = useSelector((state) => state.user);
  const { items: projects } = useSelector((state) => state.projects);
  const { items: skills } = useSelector((state) => state.skills);
  const { items: timeline } = useSelector((state) => state.timeline);
  const { items: software } = useSelector((state) => state.software);
  const { items: messages } = useSelector((state) => state.messages);

  const cards = [
    { title: 'Projects', count: projects.length, to: '/projects' },
    { title: 'Skills', count: skills.length, to: '/skills' },
    { title: 'Timeline', count: timeline.length },
    { title: 'Apps / Tools', count: software.length },
    { title: 'Messages', count: messages.length },
  ];

  return (
    <div className="page">
      <header className="page-header">
        <h1>Welcome back, {user?.name || 'Owner'}</h1>
        <p className="page-subtitle">Here’s an overview of your portfolio content.</p>
      </header>
      <div className="dashboard-grid">
        {cards.map((card) => (
          <div key={card.title} className="stat-card">
            <h3 className="stat-card-title">{card.title}</h3>
            <p className="stat-card-value">{card.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
