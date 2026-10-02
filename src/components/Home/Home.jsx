import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  useLanguage,
} from '../../context/LanguageContext';
import {
  getTranslations,
} from '../../i18n/translations';
import { sanityClient } from '../../sanity/client';
import {
  featuredProjectsQuery,
  servicesQuery,
} from '../../sanity/queries';
import { urlFor } from '../../sanity/image';

import './home.css';

const Home = () => {
  const { language } = useLanguage();

  const translations = getTranslations(language);
  const text = translations.homePage;

  // Hero animation

  const [startAnimation, setStartAnimation] =
    useState(false);

  // Projects carousel

  const [currentProject, setCurrentProject] =
    useState(0);

  const [projectsPerView, setProjectsPerView] =
    useState(3);

  const projectTrackRef = useRef(null);

  // Services from Sanity

  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] =
    useState(true);
  const [servicesError, setServicesError] =
    useState('');

  // Featured projects from Sanity

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] =
    useState(true);
  const [projectsError, setProjectsError] =
    useState('');

  // Change the number of visible projects responsively

  useEffect(() => {
    const updateProjectsPerView = () => {
      if (window.innerWidth <= 760) {
        setProjectsPerView(1);
      } else if (window.innerWidth <= 1100) {
        setProjectsPerView(2);
      } else {
        setProjectsPerView(3);
      }
    };

    updateProjectsPerView();

    window.addEventListener(
      'resize',
      updateProjectsPerView
    );

    return () => {
      window.removeEventListener(
        'resize',
        updateProjectsPerView
      );
    };
  }, []);

  // Start the continuous hero animation

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setStartAnimation(true);
    }, 500);

    return () => {
      clearTimeout(animationTimer);
    };
  }, []);

  // Get services from Sanity

  useEffect(() => {
    let isCurrentRequest = true;

    const getServices = async () => {
      try {
        setServicesLoading(true);
        setServicesError('');

        const servicesFromSanity =
          await sanityClient.fetch(servicesQuery, {
            language,
          });

        if (isCurrentRequest) {
          setServices(servicesFromSanity);
        }
      } catch (fetchError) {
        console.error(fetchError);

        if (isCurrentRequest) {
          setServicesError(text.servicesError);
        }
      } finally {
        if (isCurrentRequest) {
          setServicesLoading(false);
        }
      }
    };

    getServices();

    return () => {
      isCurrentRequest = false;
    };
  }, [language, text.servicesError]);

  // Get featured projects from Sanity

  useEffect(() => {
    let isCurrentRequest = true;

    const getFeaturedProjects = async () => {
      try {
        setProjectsLoading(true);
        setProjectsError('');

        const projectsFromSanity =
          await sanityClient.fetch(
            featuredProjectsQuery,
            {
              language,
            }
          );

        if (isCurrentRequest) {
          setProjects(projectsFromSanity.slice(0, 6));
          setCurrentProject(0);
        }
      } catch (fetchError) {
        console.error(fetchError);

        if (isCurrentRequest) {
          setProjectsError(text.projectsError);
        }
      } finally {
        if (isCurrentRequest) {
          setProjectsLoading(false);
        }
      }
    };

    getFeaturedProjects();

    return () => {
      isCurrentRequest = false;
    };
  }, [language, text.projectsError]);

  // Move the projects carousel

  const maximumProjectIndex = Math.max(
    projects.length - projectsPerView,
    0
  );

  const showProject = (newIndex) => {
    if (
      newIndex < 0 ||
      newIndex > maximumProjectIndex
    ) {
      return;
    }

    const projectTrack = projectTrackRef.current;
    const projectCards = projectTrack?.children;
    const selectedProject = projectCards?.[newIndex];

    if (!projectTrack || !selectedProject) {
      return;
    }

    setCurrentProject(newIndex);

    const trackPosition =
      projectTrack.getBoundingClientRect();

    const projectPosition =
      selectedProject.getBoundingClientRect();

    const scrollPosition =
      projectTrack.scrollLeft +
      projectPosition.left -
      trackPosition.left;

    projectTrack.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (currentProject > maximumProjectIndex) {
      showProject(maximumProjectIndex);
    }
  }, [
    currentProject,
    maximumProjectIndex,
  ]);
  return (
    <main className="home">
      {/* Hero section */}

      <section
        className="home-immersive"
        aria-label={text.heroAriaLabel}
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
              alt={text.exteriorImageAlt}
              fetchPriority="high"
            />

            <img
              className="home-hero-inside"
              src="/images/modern-interior.webp"
              alt={text.interiorImageAlt}
            />
          </div>

          <div className="home-hero-shade"></div>

          <div className="home-hero-copy">
            <p className="home-hero-eyebrow">
              <span></span>
              {text.heroEyebrow}
            </p>

            <h1>
              {text.heroTitleFirstLine}
              <br />
              {text.heroTitleSecondLine}{' '}
              <em>{text.heroTitleEmphasis}</em>
            </h1>

            <p className="home-hero-description">
              {text.heroDescription}
            </p>
          </div>

          <div className="home-hero-bottom">
            <a
              href="#about"
              className="home-scroll-hint"
            >
              {text.scrollToDiscover}
              <span>↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* About section */}

      <section
        className="home-about home-section"
        id="about"
      >
        <p className="home-section-label">
          <span className="home-orange-square"></span>
          {text.aboutLabel}
        </p>

        <div className="home-about-content">
          <h2>
            {text.aboutTitleFirstLine}
            <br />
            <span>{text.aboutTitleSecondLine}</span>
          </h2>

          <div className="home-about-bottom">
            <p>{text.aboutDescription}</p>

            <Link
              to="/about"
              className="home-page-link"
            >
              {text.aboutLink}
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Services section */}

      <section
        className="home-services home-section"
        id="services"
      >
        <div className="home-section-heading">
          <div>
            <p className="home-section-label">
              <span className="home-orange-square"></span>
              {text.servicesLabel}
            </p>

            <h2>
              {text.servicesTitleFirstLine}
              <br />
              {text.servicesTitleSecondLine}
            </h2>
          </div>

          <Link
            to="/services"
            className="home-page-link"
          >
            {text.servicesLink}
            <span>↗</span>
          </Link>
        </div>

        <div className="home-service-grid">
          {servicesLoading && (
            <p className="home-service-message">
              {text.servicesLoading}
            </p>
          )}

          {servicesError && (
            <p className="home-service-message home-service-error">
              {servicesError}
            </p>
          )}

          {!servicesLoading &&
            !servicesError &&
            services.map((service, index) => (
              <article
                className="home-service-card"
                key={service._id}
              >
                {/* Clickable image */}

                <Link
                  to="/services"
                  className="home-service-image-link"
                  aria-label={`${text.viewService} ${service.title}`}
                >
                  <div className="home-service-image">
                    {service.image?.asset && (
                      <img
                        src={urlFor(service.image)
                          .width(900)
                          .height(700)
                          .fit('crop')
                          .auto('format')
                          .url()}
                        alt={
                          service.imageAlt ||
                          `${service.title} ${text.serviceImageFallback}`
                        }
                        loading="lazy"
                      />
                    )}

                    <span>
                      {String(
                        service.order || index + 1
                      ).padStart(2, '0')}
                    </span>
                  </div>
                </Link>

                {/* Clickable title */}

                <Link
                  to="/services"
                  className="home-service-title-link"
                >
                  <h3>{service.title}</h3>
                </Link>

                {/* Non-clickable description */}

                <p className="home-service-description">
                  {service.shortDescription}
                </p>
              </article>
            ))}
        </div>
      </section>

      {/* Projects section */}

      <section className="home-projects home-section">
        <div className="home-section-heading">
          <div>
            <p className="home-section-label">
              <span className="home-orange-square"></span>
              {text.projectsLabel}
            </p>

            <h2>
              {text.projectsTitleFirstLine}
              <br />
              {text.projectsTitleSecondLine}
            </h2>
          </div>

          <Link
            to="/projects"
            className="home-page-link"
          >
            {text.projectsLink}
            <span>↗</span>
          </Link>
        </div>

        {projectsLoading && (
          <p className="home-project-message">
            {text.projectsLoading}
          </p>
        )}

        {projectsError && (
          <p className="home-project-message home-project-error">
            {projectsError}
          </p>
        )}

        {!projectsLoading &&
          !projectsError &&
          projects.length === 0 && (
            <p className="home-project-message">
              {text.projectsEmpty}
            </p>
          )}

        {!projectsLoading &&
          !projectsError &&
          projects.length > 0 && (
            <div className="home-project-carousel">
              <button
                type="button"
                className="home-project-control home-project-control-left"
                aria-label={text.previousProject}
                disabled={currentProject === 0}
                onClick={() =>
                  showProject(currentProject - 1)
                }
              >
                ←
              </button>

              <div
                className="home-project-track"
                ref={projectTrackRef}
              >
                {projects.map((project) => (
                  <article
                    className="home-project-card"
                    key={project._id}
                  >
                    <Link
                      to={`/projects/${project.slug}`}
                      aria-label={`${text.viewProject} ${project.title}`}
                    >
                      <div className="home-project-image">
                        {project.coverImage?.asset && (
                          <img
                            src={urlFor(project.coverImage)
                              .width(1200)
                              .height(900)
                              .fit('crop')
                              .auto('format')
                              .url()}
                            alt={
                              project.coverImageAlt ||
                              `${project.title} ${text.projectImageFallback}`
                            }
                            loading="lazy"
                          />
                        )}
                      </div>

                      <h3>{project.title}</h3>
                    </Link>
                  </article>
                ))}
              </div>

              <button
                type="button"
                className="home-project-control home-project-control-right"
                aria-label={text.nextProject}
                disabled={
                  currentProject === maximumProjectIndex
                }
                onClick={() =>
                  showProject(currentProject + 1)
                }
              >
                →
              </button>
            </div>
          )}
      </section>
    </main>
  );
};

export default Home;