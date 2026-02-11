export default function Portfolio() {
  const projects = [
    {
      title: 'Project One',
      description:
        'Placeholder description for your first highlighted project. We&apos;ll replace this with your real projects, links and screenshots.',
      tags: ['React', 'Responsive'],
    },
    {
      title: 'Project Two',
      description:
        'Another placeholder entry for your portfolio. Once you provide your project details, this card will be updated accordingly.',
      tags: ['Next.js', 'Tailwind'],
    },
  ];

  return (
    <section id="projects" className="section">
      <div className="section-header">
        <div className="section-title-wrapper">
          <div className="title-line" />
          <h2 className="section-title text-tubeLight-effect dancing_text">MY PROJECTS</h2>
          <div className="title-line" />
        </div>
      </div>
      <div className="grid projects-grid">
        {projects.map((project, index) => (
          <article key={index} className="card project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-meta">
              {project.tags.map((tag, i) => (
                <span key={i}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
