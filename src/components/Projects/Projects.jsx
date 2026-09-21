import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';
import './projects.css';

const Projects = () => {
  return (
    <main className="projects-page">
      <section className="projects-hero">
        <p className="projects-label">
          <span></span>
          SELECTED SPACES
        </p>

        <h1>
          Ideas made
          <br />
          <span>into places.</span>
        </h1>

        <p className="projects-introduction">
          A growing collection of residential architecture,
          interiors and landscapes designed around the way people live.
        </p>
      </section>

      <section className="projects-grid">
        {projects.map((project, index) => (
          <article
            className={`projects-card projects-card-${index + 1}`}
            key={project.id}
          >
            <Link
              to={`/projects/${project.slug}`}
              aria-label={`View ${project.title}`}
            >
              <div className="projects-card-image">
                <img
                  src={project.image}
                  alt={project.alt}
                  loading="lazy"
                />

                <span
                  className="projects-card-arrow"
                  aria-hidden="true"
                >
                  ↗
                </span>

                <span className="projects-card-category">
                  {project.category}
                </span>
              </div>

              <div className="projects-card-information">
                <div>
                  <p>
                    {project.category} · {project.number}
                  </p>

                  <h2>{project.title}</h2>
                </div>

                <p>{project.type}</p>
              </div>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Projects;