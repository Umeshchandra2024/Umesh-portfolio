export default function Timeline() {
  const timelineData = [
    {
      title: 'ZPHS Dattapuram High School',
      period: '2020 - 2021',
      description: 'Completed high school education with excellent academic performance.',
    },
    {
      title: 'RGUKT-PUC',
      period: '2021 - 2023',
      description: 'Completed intermediate education focusing on science and mathematics.',
    },
    {
      title: 'RGUKT-B.Tech',
      period: '2023 - Present',
      description: 'Currently pursuing Bachelor of Technology in Computer Science and Engineering.',
    },
  ];

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title text-tubeLight-effect dancing_text">Timeline</h2>
      </div>
      <div className="timeline-container">
        {timelineData.map((item, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="timeline-content">
              <h3 className="timeline-title">{item.title}</h3>
              <p className="timeline-period">{item.period}</p>
              <p className="timeline-description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
