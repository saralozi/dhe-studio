import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { sanityClient } from '../../sanity/client';
import { projectBySlugQuery } from '../../sanity/queries';
import { urlFor } from '../../sanity/image';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslations } from '../../i18n/translations';

import NotFound from '../NotFound/NotFound';
import './projectdetails.css';

const ProjectDetails = () => {
  const { slug } = useParams();
  const { language } = useLanguage();

  const translations = getTranslations(language);
  const text = translations.projectDetailsPage;
  const projectsText = translations.projectsPage;

  const [project, setProject] = useState(null);
  const [projectLoading, setProjectLoading] =
    useState(true);
  const [projectError, setProjectError] =
    useState('');

  useEffect(() => {
    let isCurrentRequest = true;

    const getProject = async () => {
      try {
        setProjectLoading(true);
        setProjectError('');

        const projectFromSanity =
          await sanityClient.fetch(
            projectBySlugQuery,
            {
              slug,
              language,
            }
          );

        if (isCurrentRequest) {
          setProject(projectFromSanity);
        }
      } catch (fetchError) {
        console.error(fetchError);

        if (isCurrentRequest) {
          setProjectError(text.error);
        }
      } finally {
        if (isCurrentRequest) {
          setProjectLoading(false);
        }
      }
    };

    getProject();

    return () => {
      isCurrentRequest = false;
    };
  }, [slug, language, text.error]);

  if (projectLoading) {
    return (
      <main className="project-details">
        <p className="project-details-message">
          {text.loading}
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
            {text.returnToProjects}
          </Link>
        </div>
      </main>
    );
  }

  if (!project) {
    return <NotFound />;
  }

  const translatedCategory =
    projectsText.categories[project.category] ||
    project.category;

  const translatedStatus =
    text.statuses[project.status] ||
    project.status;

  return (
    <main className="project-details">
      {/* Project hero */}

      <section className="project-details-hero">
        {project.coverImage?.asset && (
          <img
            src={urlFor(project.coverImage)
              .width(2000)
              .height(1200)
              .fit('crop')
              .auto('format')
              .url()}
            alt={
              project.coverImageAlt ||
              `${project.title} ${text.imageFallback}`
            }
          />
        )}

        <div className="project-details-overlay"></div>

        <div className="project-details-title">
          <p>
            {translatedCategory}
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
              <span>{text.type}</span>
              <p>{project.projectType}</p>
            </div>
          )}

          {project.location && (
            <div>
              <span>{text.location}</span>
              <p>{project.location}</p>
            </div>
          )}

          {project.year && (
            <div>
              <span>{text.year}</span>
              <p>{project.year}</p>
            </div>
          )}

          {project.status && (
            <div>
              <span>{text.status}</span>
              <p>{translatedStatus}</p>
            </div>
          )}

          {project.area && (
            <div>
              <span>{text.area}</span>
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
          {galleryImage.asset && (
            <img
              src={urlFor(galleryImage)
                .width(1800)
                .auto('format')
                .url()}
              alt={
                galleryImage.alt ||
                `${project.title} ${text.galleryImageFallback}`
              }
              loading="lazy"
            />
          )}

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
          {text.allProjects}
        </Link>
      </section>
    </main>
  );
};

export default ProjectDetails;