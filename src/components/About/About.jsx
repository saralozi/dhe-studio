import { Link } from 'react-router-dom';
import './about.css';

const About = () => {
  return (
    <main className="about-page">
      {/* Page introduction */}

      <section className="about-hero">
        <p className="about-label">
          <span></span>
          THE STUDIO
        </p>

        <h1>
          Designing for
          <br />
          <span>how life feels.</span>
        </h1>

        <p className="about-introduction">
          We create thoughtful spaces shaped around people,
          place and everyday experience.
        </p>
      </section>

      {/* Studio story */}

      <section className="about-story">
        <div className="about-story-image">
          <img
            src="/images/modern-interior.webp"
            alt="Warm contemporary residential interior"
          />
        </div>

        <div className="about-story-content">
          <p className="about-story-lead">
            DHÈ Studio approaches every project as a conversation
            between people, place and possibility.
          </p>

          <p>
            We bring architecture, interiors and landscape
            together from the beginning. This continuity helps
            every decision—from the shape of a room to the
            texture of a material—feel connected and purposeful.
          </p>

          <p>
            The result is calm, characterful space made for real
            life: thoughtful in its details, responsive to its
            surroundings and distinctly personal.
          </p>

          <Link to="/projects" className="about-link">
            Explore our projects
            <span>↗</span>
          </Link>
        </div>
      </section>

      {/* Design principles */}

      <section className="about-principles">
        <p className="about-label">
          <span></span>
          OUR APPROACH
        </p>

        <div className="about-principles-grid">
          <article className="about-principle">
            <span className="about-principle-number">
              01
            </span>

            <h2>Listen first.</h2>

            <p>
              We begin with the people who will live, work and
              spend time in the space.
            </p>
          </article>

          <article className="about-principle">
            <span className="about-principle-number">
              02
            </span>

            <h2>Think as one.</h2>

            <p>
              Architecture, interiors and landscape evolve
              together instead of being treated separately.
            </p>
          </article>

          <article className="about-principle">
            <span className="about-principle-number">
              03
            </span>

            <h2>Design for life.</h2>

            <p>
              Beautiful ideas become useful, lasting places that
              improve everyday experience.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default About;