import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { sanityClient } from '../../sanity/client';
import {
  featuredProjectsQuery,
  servicesQuery,
} from '../../sanity/queries';
import { urlFor } from '../../sanity/image';

import './home.css';

const Home = () => {
  // Hero animation

  const [startAnimation, setStartAnimation] =
    useState(false);

  // Projects carousel

  const [currentProject, setCurrentProject] =
    useState(0);

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
        const servicesFromSanity =
          await sanityClient.fetch(servicesQuery, {
            language: 'en',
          });

        if (isCurrentRequest) {
          setServices(servicesFromSanity);
        }
      } catch (fetchError) {
        console.error(fetchError);

        if (isCurrentRequest) {
          setServicesError(
            'The services could not be loaded.'
          );
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
  }, []);

  // Get featured projects from Sanity

  useEffect(() => {
    let isCurrentRequest = true;

    const getFeaturedProjects = async () => {
      try {
        const projectsFromSanity =
          await sanityClient.fetch(
            featuredProjectsQuery,
            {
              language: 'en',
            }
          );

        if (isCurrentRequest) {
          setProjects(projectsFromSanity);
          setCurrentProject(0);
        }
      } catch (fetchError) {
        console.error(fetchError);

        if (isCurrentRequest) {
          setProjectsError(
            'The featured projects could not be loaded.'
          );
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
  }, []);

  // Move the projects carousel

  const showProject = (newIndex) => {
    if (
      newIndex < 0 ||
      newIndex >= projects.length
    ) {
      return;
    }

    const projectCards =
      projectTrackRef.current?.children;

    if (!projectCards?.[newIndex]) {
      return;
    }

    setCurrentProject(newIndex);

    projectCards[newIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  return (
    <main className="home">
      {/* Hero section */}

      <section
        className="home-immersive"
        aria-label="Explore a modern residence"
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
              alt="Contemporary modern residence exterior"
              fetchPriority="high"
            />

            <img
              className="home-hero-inside"
              src="/images/modern-interior.webp"
              alt="Warm contemporary residential interior"
            />
          </div>

          <div className="home-hero-shade"></div>

          <div className="home-hero-copy">
            <p className="home-hero-eyebrow">
              <span></span>
              DESIGNING HUMAN EXPERIENCES
            </p>

            <h1>
              Spaces for life.
              <br />
              Designed around <em>you.</em>
            </h1>

            <p className="home-hero-description">
              A dialogue between people, place, and
              possibility.
            </p>
          </div>

          <div className="home-hero-bottom">
            <a
              href="#about"
              className="home-scroll-hint"
            >
              SCROLL TO DISCOVER
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
          01 / THE STUDIO
        </p>

        <div className="home-about-content">
          <h2>
            Architecture shaped by
            <br />
            <span>people and place.</span>
          </h2>

          <div className="home-about-bottom">
            <p>
              DHÈ is an architectural and interior design
              studio focused on the experiences that happen
              within a space. With attention to context,
              culture, materiality and sustainability, we
              create places that are meaningful, functional
              and made to endure.
            </p>

            <Link
              to="/about"
              className="home-page-link"
            >
              Meet the studio
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
              02 / WHAT WE DO
            </p>

            <h2>
              From the first idea
              <br />
              to the final detail.
            </h2>
          </div>

          <Link
            to="/services"
            className="home-page-link"
          >
            Explore our services
            <span>↗</span>
          </Link>
        </div>

        <div className="home-service-grid">
          {servicesLoading && (
            <p className="home-service-message">
              Loading services...
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
                <Link
                  to="/services"
                  className="home-service-link"
                  aria-label={`View ${service.title} service`}
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
                          `${service.title} service`
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

                  <h3>{service.title}</h3>

                  <p>{service.shortDescription}</p>
                </Link>
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
              03 / SELECTED SPACES
            </p>

            <h2>
              A few ways
              <br />
              an idea becomes a place.
            </h2>
          </div>

          <Link
            to="/projects"
            className="home-page-link"
          >
            View all projects
            <span>↗</span>
          </Link>
        </div>

        {projectsLoading && (
          <p className="home-project-message">
            Loading projects...
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
              No featured projects have been published yet.
            </p>
          )}

        {!projectsLoading &&
          !projectsError &&
          projects.length > 0 && (
            <>
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
                    >
                      <div className="home-project-image">
                        {project.coverImage?.asset && (
                          <img
                            src={urlFor(
                              project.coverImage
                            )
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
                          className="home-project-arrow"
                          aria-hidden="true"
                        >
                          ↗
                        </span>

                        <span className="home-project-category">
                          {project.category}
                        </span>
                      </div>

                      <div className="home-project-information">
                        <h3>{project.title}</h3>

                        <span>
                          {project.projectType}
                          {' / '}
                          {String(
                            project.order || 1
                          ).padStart(2, '0')}
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              <div className="home-carousel-footer">
                <div className="home-carousel-controls">
                  <span>
                    {String(
                      currentProject + 1
                    ).padStart(2, '0')}
                    {' — '}
                    {String(projects.length).padStart(
                      2,
                      '0'
                    )}
                  </span>

                  <button
                    type="button"
                    aria-label="Previous project"
                    disabled={currentProject === 0}
                    onClick={() =>
                      showProject(currentProject - 1)
                    }
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    aria-label="Next project"
                    disabled={
                      currentProject ===
                      projects.length - 1
                    }
                    onClick={() =>
                      showProject(currentProject + 1)
                    }
                  >
                    →
                  </button>
                </div>
              </div>
            </>
          )}
      </section>
    </main>
  );
};

export default Home;