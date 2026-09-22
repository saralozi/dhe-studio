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
          Designing human
          <br />
          <span>experiences.</span>
        </h1>

        <p className="about-introduction">
          An architectural and interior design studio creating
          meaningful spaces around the people who experience them.
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
            DHÈ — Designing Human Experiences is an architectural
            and interior design studio grounded in the belief that
            architecture is not only about shaping spaces, but about
            shaping the experiences that take place within them.
          </p>

          <p>
            Our approach is human-centred, attentive to context,
            culture, materiality, sustainability, and the everyday
            ways in which people interact with their surroundings.
          </p>

          <p>
            For us, design begins with imagining the experience of
            the person who will inhabit, use, or encounter a space.
            We explore how architecture can influence emotions,
            behaviours, memories, and connections, while responding
            thoughtfully to the physical and social context of each
            project.
          </p>

          <p>
            From the overall architectural concept to the smallest
            interior detail, we aim to create spaces that are
            meaningful, functional, and enduring.
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

            <h2>Human-centred.</h2>

            <p>
              We begin by imagining how people will inhabit, use,
              and experience each space.
            </p>
          </article>

          <article className="about-principle">
            <span className="about-principle-number">
              02
            </span>

            <h2>Context-aware.</h2>

            <p>
              Every project responds thoughtfully to its physical,
              social, and cultural surroundings.
            </p>
          </article>

          <article className="about-principle">
            <span className="about-principle-number">
              03
            </span>

            <h2>Made to endure.</h2>

            <p>
              From the overall concept to the smallest detail, we
              create spaces that are meaningful, functional, and
              lasting.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default About;