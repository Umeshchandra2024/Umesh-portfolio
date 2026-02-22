import umeshPhoto from '../../assets/umesh.jpeg';

export default function About() {
  return (
    <section id="about" className="section about-section">
      <div className="section-header">
        <div className="section-title-wrapper">
          <div className="title-line" />
          <h2 className="section-title text-tubeLight-effect dancing_text about-title">
            ABOUT ME
          </h2>
          <div className="title-line" />
        </div>
        <p className="section-subtitle">ALLOW ME TO INTRODUCE MYSELF.</p>
      </div>
      <div className="about-content">
        <div className="about-photo-wrap">
          <img
            src={umeshPhoto}
            alt="Umesh"
            className="about-photo"
          />
        </div>
        <div className="about-text">
          <p className="about-paragraph">
            I&apos;m Umesh Chandra, a Pre final-year B.Tech student in Computer Science Engineering with a strong foundation in problem-solving, system design, and software development. Proficient in data structures, algorithms, and full-stack development (MERN stack), I build scalable, high-performance applications that emphasize efficiency and reliability. My interests extend to AI/ML and DevOps, where I explore automation, cloud deployment, and CI/CD pipelines to deliver robust end-to-end solutions.
          </p>
          <p className="about-paragraph">
            Beyond technology, I&apos;m passionate about creating impactful, real-world solutions. I actively participate in hackathons and coding competitions, applying my skills to tackle complex challenges in fast-paced environments. I&apos;m dedicated to continuous learning and bringing discipline, teamwork, and strategic thinking to every project I take on.
          </p>
        </div>
      </div>
    </section>
  );
}
