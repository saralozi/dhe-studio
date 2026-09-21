import { Link, useParams } from 'react-router-dom';
import { projects } from '../../data/projects';
import NotFound from '../NotFound/NotFound';
import './projectdetails.css';

const ProjectDetails = () => {
  const { slug } = useParams();

  const project = projects.find(
    (projectItem) => projectItem.slug === slug
  );

  if (!project) {
    return <NotFound />;
  }

  return (
    <main className="project-details">
      {/* Project hero */}

      <section className="project-details-hero">
        <img
          src={project.image}
          alt={project.alt}
        />

        <div className="project-details-overlay"></div>

        <div className="project-details-title">
          <p>
            {project.category} · {project.number}
          </p>

          <h1>{project.title}</h1>
        </div>
      </section>

      {/* Project information */}

      <section className="project-details-information">
        <div className="project-details-facts">
          <div>
            <span>TYPE</span>
            <p>{project.type}</p>
          </div>

          <div>
            <span>LOCATION</span>
            <p>{project.location}</p>
          </div>

          <div>
            <span>YEAR</span>
            <p>{project.year}</p>
          </div>
        </div>

        <div className="project-details-description">
          <p className="project-details-lead">
            {project.description}
          </p>

          <p>{project.fullDescription}</p>
        </div>
      </section>

      {/* Secondary image */}

      <section className="project-details-image">
        <img
          src={project.detailImage}
          alt={`${project.title} design detail`}
        />
      </section>

      {/* Return link */}

      <section className="project-details-navigation">
        <Link to="/projects">
          <span>←</span>
          All projects
        </Link>
      </section>
    </main>
  );
};

export default ProjectDetails;