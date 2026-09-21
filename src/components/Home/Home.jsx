import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import { services } from '../../data/services';
import { projects } from '../../data/projects';

const Home = () => {
  const [startAnimation, setStartAnimation] = useState(false);
  const [currentProject, setCurrentProject] = useState(0);
  const projectTrackRef = useRef(null); // create tag

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setStartAnimation(true);
    }, 500);

    return () => {
      clearTimeout(animationTimer);
    };
  }, []);

  const showProject = (newIndex) => {
    if (newIndex < 0 || newIndex >= projects.length) {
      return;
    }

    setCurrentProject(newIndex);

    const projectCards = projectTrackRef.current.children; // use the tag to access carousel

    projectCards[newIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  return (
    <main className="home">
      <section
        className="home-immersive"
        aria-label="Explore a modern residence"
      >
        <div
          className={
            startAnimation
              ? 'home-hero animate-residence'
              : 'home-hero'
          }
        >
          <div className="home-hero-images">
            <img
              className="home-hero-outside"
              src="/images/modern-exterior.webp"
              alt="Contemporary modern residence exterior"
              fetchPriority="high"
            />

            <img
              className="home-hero-inside"
              src="/images/modern-interior.webp"
              alt="Warm contemporary residential interior"
            />
          </div>

          <div className="home-hero-shade"></div>

          <div className="home-hero-copy">
            <p className="home-hero-eyebrow">
              <span></span>
              DESIGNING HUMAN EXPERIENCES
            </p>

            <h1>
              Spaces for life.
              <br />
              Designed around <em>you.</em>
            </h1>

            <p className="home-hero-description">
              A dialogue between people, place, and possibility.
            </p>
          </div>

          <div className="home-hero-bottom">
            <a href="#about" className="home-scroll-hint">
              SCROLL TO DISCOVER
              <span>↓</span>
            </a>

            <span className="home-hero-note">
              A DIFFERENT PERSPECTIVE ON HOME.
            </span>
          </div>
        </div>
      </section>

      <section className="home-about home-section" id="about">
        <p className="home-section-label">
          <span className="home-orange-square"></span>
          01 / THE STUDIO
        </p>

        <div className="home-about-content">
          <h2>
            Good design starts
            <br />
            with <span>the way we live.</span>
          </h2>

          <div className="home-about-bottom">
            <p>
              At DHÈ Studio, we bring architecture, interiors, and
              the spaces in between into one thoughtful conversation.
              We create places that feel personal, respond to their
              surroundings, and make everyday life a little better.
            </p>

            <Link to="/about" className="home-page-link">
              Meet the studio
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section
        className="home-services home-section"
        id="services"
      >
        <div className="home-section-heading">
          <div>
            <p className="home-section-label">
              <span className="home-orange-square"></span>
              02 / WHAT WE DO
            </p>

            <h2>
              From the first idea.
              <br />
              To the final detail.
            </h2>
          </div>

          <Link to="/services" className="home-page-link">
            Explore our services
            <span>↗</span>
          </Link>
        </div>

        <div className="home-service-grid">
          {services.map((service) => (
            <article
              className="home-service-card"
              key={service.id}
            >
              <div className="home-service-image">
                <img
                  src={service.image}
                  alt={service.alt}
                  loading="lazy"
                />

                <span>{service.number}</span>
              </div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-projects home-section">
        <div className="home-section-heading">
          <div>
            <p className="home-section-label">
              <span className="home-orange-square"></span>
              03 / SELECTED SPACES
            </p>

            <h2>
              A few ways
              <br />
              an idea becomes a place.
            </h2>
          </div>

          <Link to="/projects" className="home-page-link">
            View all projects
            <span>↗</span>
          </Link>
        </div>

        <div
          className="home-project-track"
          ref={projectTrackRef} // put tag on carousel
        >
          {projects.map((project) => (
            <article
              className="home-project-card"
              key={project.id}
            >
              <Link to={`/projects/${project.slug}`}>
                <div className="home-project-image">
                  <img
                    src={project.image}
                    alt={project.alt}
                    loading="lazy"
                  />

                  <span className="home-project-arrow">
                    ↗
                  </span>

                  <span className="home-project-category">
                    {project.category}
                  </span>
                </div>

                <div className="home-project-information">
                  <h3>{project.title}</h3>

                  <span>
                    {project.type} / {project.number}
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="home-carousel-footer">
          <span>SPACES TO LIVE. ROOM TO IMAGINE.</span>

          <div className="home-carousel-controls">
            <span>
              0{currentProject + 1} — 0{projects.length}
            </span>

            <button
              type="button"
              aria-label="Previous project"
              disabled={currentProject === 0}
              onClick={() => showProject(currentProject - 1)}
            >
              ←
            </button>

            <button
              type="button"
              aria-label="Next project"
              disabled={currentProject === projects.length - 1}
              onClick={() => showProject(currentProject + 1)}
            >
              →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;