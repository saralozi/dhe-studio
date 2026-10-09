import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useLanguage,
} from '../../context/LanguageContext';
import {
  getTranslations,
} from '../../i18n/translations';
import { sanityClient } from '../../sanity/client';
import { projectsQuery } from '../../sanity/queries';
import { urlFor } from '../../sanity/image';

import {
  LocalizedLink,
} from '../LocalizedLink/LocalizedLink';
import SEO from '../SEO/SEO';
import './projects.css';

const categoryOptions = [
  'all',
  'Architectural Design',
  'Interior Design',
  'Restoration',
  'Consulting',
];

const Projects = () => {
  const { language } = useLanguage();

  const translations = getTranslations(language);
  const text = translations.projectsPage;

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] =
    useState(true);
  const [projectsError, setProjectsError] =
    useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] =
    useState('all');

  // Get projects from Sanity

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

  // Search and category filtering

  const filteredProjects = useMemo(() => {
    const normalizedSearchTerm = searchTerm
      .trim()
      .toLocaleLowerCase(language);

    return projects.filter((project) => {
      const translatedCategory =
        text.categories[project.category] ||
        project.category ||
        '';

      const matchesCategory =
        activeCategory === 'all' ||
        project.category === activeCategory;

      const searchableProjectText = [
        project.title,
        translatedCategory,
        project.projectType,
        project.location,
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase(language);

      const matchesSearch =
        normalizedSearchTerm === '' ||
        searchableProjectText.includes(
          normalizedSearchTerm
        );

      return matchesCategory && matchesSearch;
    });
  }, [
    projects,
    searchTerm,
    activeCategory,
    language,
    text.categories,
  ]);

  const getCategoryLabel = (category) => {
    if (category === 'all') {
      return text.allCategories;
    }

    return text.categories[category] || category;
  };

  return (
    <main className="projects-page">

      <SEO
        title={translations.seo.projects.title}
        description={translations.seo.projects.description}
      />

      {/* Page introduction */}

      <section className="projects-hero inner-page-hero">
        <p className="projects-label inner-page-label">
          <span></span>
          {text.label}
        </p>

        <h1 className="page-hero-title">
          {text.titleFirstLine}
          <br />
          <span>{text.titleSecondLine}</span>
        </h1>
      </section>

      {/* Projects archive */}

      <section className="projects-archive">
        {/* Search and filters */}

        <div className="projects-toolbar">
          <div className="projects-search">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />

              <path d="M16.5 16.5L21 21" />
            </svg>

            <input
              id="projects-search"
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder={text.searchPlaceholder}
              aria-label={text.searchLabel}
            />
          </div>

          <div
            className="projects-filters"
            aria-label={text.filterLabel}
          >
            {categoryOptions.map((category) => (
              <button
                type="button"
                className={
                  activeCategory === category
                    ? 'projects-filter active'
                    : 'projects-filter'
                }
                key={category}
                aria-pressed={
                  activeCategory === category
                }
                onClick={() =>
                  setActiveCategory(category)
                }
              >
                {getCategoryLabel(category)}
              </button>
            ))}
          </div>
        </div>

        {/* Projects grid */}

        <div className="projects-grid">
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
            projects.length > 0 &&
            filteredProjects.length === 0 && (
              <p className="projects-message">
                {text.noResults}
              </p>
            )}

          {!projectsLoading &&
            !projectsError &&
            filteredProjects.map((project) => {
              const translatedCategory =
                text.categories[project.category] ||
                project.category;

              return (
                <article
                  className="projects-card"
                  key={project._id}
                >
                  <LocalizedLink
                    to={`/projects/${project.slug}`}
                    aria-label={`${text.viewProject} ${project.title}`}
                  >
                    <div className="projects-card-image">
                      {project.coverImage?.asset && (
                        <img
                          src={urlFor(
                            project.coverImage
                          )
                            .width(1200)
                            .height(900)
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
                    </div>

                    <div className="projects-card-information">
                      <div className="projects-card-text">
                        <h2>{project.title}</h2>

                        <p className="projects-card-category">
                          {translatedCategory}
                        </p>
                      </div>

                      <span
                        className="projects-card-arrow"
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </div>
                  </LocalizedLink>
                </article>
              );
            })}
        </div>
      </section>
    </main>
  );
};

export default Projects;