import { useEffect, useState } from 'react';
import { Github, Linkedin, Instagram, Twitter } from 'lucide-react';

const TYPED_WORDS = ['Web Developer', 'MERN Stack Enthusiast', 'Problem Solver'];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);

  useEffect(() => {
    setNameVisible(true);
  }, []);

  useEffect(() => {
    const fullText = TYPED_WORDS[wordIndex];
    const delta = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      const updated = isDeleting
        ? fullText.substring(0, displayText.length - 1)
        : fullText.substring(0, displayText.length + 1);

      setDisplayText(updated);

      if (!isDeleting && updated === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && updated === '') {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % TYPED_WORDS.length);
      }
    }, delta);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex]);

  return (
    <section id="home" className="hero-clean">
      <div className="hero-content-clean">
        <div className="hero-status-row">
          <span className="status-dot" />
          <span className="status-label">Online</span>
        </div>

        <h1 className={`hero-name ${nameVisible ? 'hero-name-visible' : ''}`}>
          <span className="hero-greeting">Hey, I&apos;m</span>
          <span className="hero-name-text">Umesh Chandra</span>
        </h1>

        <div className="typed-line-clean">
          <span className="typed-prefix">I&apos;m a</span>
          <span className="typed-text">{displayText}</span>
          <span className="typed-cursor" />
        </div>

        <p className="hero-description">
          A passionate Full Stack Developer crafting modern web experiences with
          a focus on clean design, performance, and user experience.
        </p>

        <div className="hero-social-row-clean">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn"
            aria-label="Twitter"
          >
            <Twitter size={20} />
          </a>
        </div>

        <div className="hero-actions-clean">
          <a href="#projects" className="btn btn-primary">
            <Github size={18} />
            <span>View Projects</span>
          </a>
          <a href="#contact" className="btn btn-ghost">
            <span>Get Resume</span>
          </a>
        </div>
      </div>
    </section>
  );
}
