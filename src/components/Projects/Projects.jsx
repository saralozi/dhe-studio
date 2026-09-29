import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  useLanguage,
} from '../../context/LanguageContext';
import {
  getTranslations,
} from '../../i18n/translations';
import { sanityClient } from '../../sanity/client';
import { projectsQuery } from '../../sanity/queries';
import { urlFor } from '../../sanity/image';

import './projects.css';

const Projects = () => {
  const { language } = useLanguage();

  const text =
    getTranslations(language).projectsPage;

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] =
    useState(true);
  const [projectsError, setProjectsError] =
    useState('');

  useEffect(() => {
    let isCurrentRequest = true;

    const getProjects = async () => {
      try {
        setProjectsLoading(true);
        setProjectsError('');

        const projectsFromSanity =
          await sanityClient.fetch(projectsQuery, {
            language,
          });

        if (isCurrentRequest) {
          setProjects(projectsFromSanity);
        }
      } catch (fetchError) {
        console.error(fetchError);

        if (isCurrentRequest) {
          setProjectsError(text.error);
        }
      } finally {
        if (isCurrentRequest) {
          setProjectsLoading(false);
        }
      }
    };

    getProjects();

    return () => {
      isCurrentRequest = false;
    };
  }, [language, text.error]);

  return (
    <main className="projects-page">
      {/* Page introduction */}

      <section className="projects-hero">
        <p className="projects-label">
          <span></span>
          {text.label}
        </p>

        <h1 className="page-hero-title">
          {text.titleFirstLine}
          <br />
          <span>{text.titleSecondLine}</span>
        </h1>
      </section>

      {/* Projects list */}

      <section className="projects-grid">
        {projectsLoading && (
          <p className="projects-message">
            {text.loading}
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
              {text.empty}
            </p>
          )}

        {!projectsLoading &&
          !projectsError &&
          projects.map((project, index) => {
            const translatedCategory =
              text.categories[project.category] ||
              project.category;

            return (
              <article
                className={`projects-card projects-card-${index + 1}`}
                key={project._id}
              >
                <Link
                  to={`/projects/${project.slug}`}
                  aria-label={`${text.viewProject} ${project.title}`}
                >
                  <div className="projects-card-image">
                    {project.coverImage?.asset && (
                      <img
                        src={urlFor(project.coverImage)
                          .width(1400)
                          .height(1000)
                          .fit('crop')
                          .auto('format')
                          .url()}
                        alt={
                          project.coverImageAlt ||
                          `${project.title} ${text.imageFallback}`
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
                      {translatedCategory}
                    </span>
                  </div>

                  <div className="projects-card-information">
                    <div>
                      <p>
                        {translatedCategory}
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
            );
          })}
      </section>
    </main>
  );
};

export default Projects;