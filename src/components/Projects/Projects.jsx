import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { sanityClient } from '../../sanity/client';
import { projectsQuery } from '../../sanity/queries';
import { urlFor } from '../../sanity/image';

import './projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] =
    useState(true);
  const [projectsError, setProjectsError] =
    useState('');

  useEffect(() => {
    const getProjects = async () => {
      try {
        const projectsFromSanity =
          await sanityClient.fetch(projectsQuery);

        setProjects(projectsFromSanity);
      } catch (fetchError) {
        console.error(fetchError);
        setProjectsError(
          'The projects could not be loaded.'
        );
      } finally {
        setProjectsLoading(false);
      }
    };

    getProjects();
  }, []);

  return (
    <main className="projects-page">
      {/* Page introduction */}

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
          A growing collection of residential architecture and
          interiors designed around the way people live.
        </p>
      </section>

      {/* Projects list */}

      <section className="projects-grid">
        {projectsLoading && (
          <p className="projects-message">
            Loading projects...
          </p>
        )}

        {projectsError && (
          <p className="projects-message projects-error">
            {projectsError}
          </p>
        )}

        {!projectsLoading &&
          !projectsError &&
          projects.length === 0 && (
            <p className="projects-message">
              No projects have been published yet.
            </p>
          )}

        {!projectsLoading &&
          !projectsError &&
          projects.map((project, index) => (
            <article
              className={`projects-card projects-card-${index + 1}`}
              key={project._id}
            >
              <Link
                to={`/projects/${project.slug}`}
                aria-label={`View ${project.title}`}
              >
                <div className="projects-card-image">
                  {project.coverImage && (
                    <img
                      src={urlFor(project.coverImage)
                        .width(1400)
                        .height(1000)
                        .fit('crop')
                        .auto('format')
                        .url()}
                      alt={
                        project.coverImageAlt ||
                        `${project.title} project`
                      }
                      loading="lazy"
                    />
                  )}

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
                      {project.category}
                      {' · '}
                      {String(
                        project.order || index + 1
                      ).padStart(2, '0')}
                    </p>

                    <h2>{project.title}</h2>
                  </div>

                  <p>{project.projectType}</p>
                </div>
              </Link>
            </article>
          ))}
      </section>
    </main>
  );
};

export default Projects;