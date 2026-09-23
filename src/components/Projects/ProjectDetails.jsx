import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { sanityClient } from '../../sanity/client';
import { projectBySlugQuery } from '../../sanity/queries';
import { urlFor } from '../../sanity/image';

import NotFound from '../NotFound/NotFound';
import './projectdetails.css';

const ProjectDetails = () => {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [projectLoading, setProjectLoading] =
    useState(true);
  const [projectError, setProjectError] =
    useState('');

  useEffect(() => {
    const getProject = async () => {
      try {
        setProjectLoading(true);
        setProjectError('');

        const projectFromSanity =
          await sanityClient.fetch(
            projectBySlugQuery,
            { slug }
          );

        setProject(projectFromSanity);
      } catch (fetchError) {
        console.error(fetchError);
        setProjectError(
          'The project could not be loaded.'
        );
      } finally {
        setProjectLoading(false);
      }
    };

    getProject();
  }, [slug]);

  if (projectLoading) {
    return (
      <main className="project-details">
        <p className="project-details-message">
          Loading project...
        </p>
      </main>
    );
  }

  if (projectError) {
    return (
      <main className="project-details">
        <div className="project-details-message">
          <p>{projectError}</p>

          <Link to="/projects">
            <span>←</span>
            Return to projects
          </Link>
        </div>
      </main>
    );
  }

  if (!project) {
    return <NotFound />;
  }

  return (
    <main className="project-details">
      {/* Project hero */}

      <section className="project-details-hero">
        {project.coverImage && (
          <img
            src={urlFor(project.coverImage)
              .width(2000)
              .height(1200)
              .fit('crop')
              .auto('format')
              .url()}
            alt={
              project.coverImageAlt ||
              `${project.title} project`
            }
          />
        )}

        <div className="project-details-overlay"></div>

        <div className="project-details-title">
          <p>
            {project.category}
            {' · '}
            {String(project.order || 1).padStart(2, '0')}
          </p>

          <h1>{project.title}</h1>
        </div>
      </section>

      {/* Project information */}

      <section className="project-details-information">
        <div className="project-details-facts">
          {project.projectType && (
            <div>
              <span>TYPE</span>
              <p>{project.projectType}</p>
            </div>
          )}

          {project.location && (
            <div>
              <span>LOCATION</span>
              <p>{project.location}</p>
            </div>
          )}

          {project.year && (
            <div>
              <span>YEAR</span>
              <p>{project.year}</p>
            </div>
          )}

          {project.status && (
            <div>
              <span>STATUS</span>
              <p>{project.status}</p>
            </div>
          )}

          {project.area && (
            <div>
              <span>AREA</span>
              <p>{project.area}</p>
            </div>
          )}
        </div>

        <div className="project-details-description">
          {project.shortDescription && (
            <p className="project-details-lead">
              {project.shortDescription}
            </p>
          )}

          {project.fullDescription && (
            <p>{project.fullDescription}</p>
          )}
        </div>
      </section>

      {/* Project gallery */}

      {project.gallery?.map((galleryImage) => (
        <section
          className="project-details-image"
          key={galleryImage._key}
        >
          <img
            src={urlFor(galleryImage)
              .width(1800)
              .auto('format')
              .url()}
            alt={
              galleryImage.alt ||
              `${project.title} project view`
            }
            loading="lazy"
          />

          {galleryImage.caption && (
            <p className="project-details-caption">
              {galleryImage.caption}
            </p>
          )}
        </section>
      ))}

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