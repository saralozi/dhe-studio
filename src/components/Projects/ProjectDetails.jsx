import {
  useEffect,
  useState,
} from 'react';
import {
  Link,
  useParams,
} from 'react-router-dom';

import { sanityClient } from '../../sanity/client';
import { projectBySlugQuery } from '../../sanity/queries';
import { urlFor } from '../../sanity/image';
import {
  useLanguage,
} from '../../context/LanguageContext';
import {
  getTranslations,
} from '../../i18n/translations';

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

  const [
    selectedImageIndex,
    setSelectedImageIndex,
  ] = useState(null);

  const galleryImages =
    project?.gallery?.filter(
      (galleryImage) => galleryImage?.asset
    ) || [];

  // Get project from Sanity

  useEffect(() => {
    let isCurrentRequest = true;

    const getProject = async () => {
      try {
        setProjectLoading(true);
        setProjectError('');
        setSelectedImageIndex(null);

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

  // Modal keyboard navigation and scroll lock

  useEffect(() => {
    if (selectedImageIndex === null) {
      return;
    }

    const previousBodyOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedImageIndex(null);
      }

      if (
        event.key === 'ArrowLeft' &&
        galleryImages.length > 1
      ) {
        setSelectedImageIndex(
          (currentIndex) => {
            if (currentIndex === null) {
              return null;
            }

            return (
              (currentIndex -
                1 +
                galleryImages.length) %
              galleryImages.length
            );
          }
        );
      }

      if (
        event.key === 'ArrowRight' &&
        galleryImages.length > 1
      ) {
        setSelectedImageIndex(
          (currentIndex) => {
            if (currentIndex === null) {
              return null;
            }

            return (
              (currentIndex + 1) %
              galleryImages.length
            );
          }
        );
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousBodyOverflow;

      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [
    selectedImageIndex,
    galleryImages.length,
  ]);

  const showPreviousImage = () => {
    setSelectedImageIndex((currentIndex) => {
      if (currentIndex === null) {
        return null;
      }

      return (
        (currentIndex -
          1 +
          galleryImages.length) %
        galleryImages.length
      );
    });
  };

  const showNextImage = () => {
    setSelectedImageIndex((currentIndex) => {
      if (currentIndex === null) {
        return null;
      }

      return (
        (currentIndex + 1) %
        galleryImages.length
      );
    });
  };

  const closeModalFromBackdrop = (event) => {
    if (event.target === event.currentTarget) {
      setSelectedImageIndex(null);
    }
  };

  // Loading state

  if (projectLoading) {
    return (
      <main className="project-details">
        <p className="project-details-message">
          {text.loading}
        </p>
      </main>
    );
  }

  // Error state

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
    projectsText.categories?.[
      project.category
    ] || project.category;

  const translatedStatus =
    text.statuses?.[project.status] ||
    project.status;

  const selectedImage =
    selectedImageIndex !== null
      ? galleryImages[selectedImageIndex]
      : null;

  return (
    <main className="project-details">
      {/* Project hero */}

      <section className="project-details-hero">
        {project.coverImage?.asset && (
          <img
            src={urlFor(project.coverImage)
              .width(2200)
              .height(1300)
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
            {String(
              project.order || 1
            ).padStart(2, '0')}
          </p>

          <h1>{project.title}</h1>
        </div>
      </section>

      {/* Information and gallery */}

      <section className="project-details-content">
        {/* Left project facts */}

        <aside className="project-details-sidebar">
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

          <Link
            to="/projects"
            className="project-details-return"
          >
            <span>←</span>
            {text.allProjects}
          </Link>
        </aside>

        {/* Right description and gallery */}

        <div className="project-details-gallery-area">
          <div className="project-details-description">
            {project.shortDescription && (
              <p>{project.shortDescription}</p>
            )}

            {project.fullDescription && (
              <p>{project.fullDescription}</p>
            )}
          </div>

          <div className="project-details-gallery-heading">
            <p>
              {text.galleryLabel ||
                'Project gallery'}
            </p>

            <span>
              {String(
                galleryImages.length
              ).padStart(2, '0')}
            </span>
          </div>

          {galleryImages.length > 0 ? (
            <div className="project-details-gallery">
              {galleryImages.map(
                (galleryImage, index) => (
                  <figure
                    className="project-details-gallery-item"
                    key={galleryImage._key}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedImageIndex(index)
                      }
                      aria-label={`${
                        text.openImage ||
                        'Open image'
                      } ${index + 1}`}
                    >
                      <img
                        src={urlFor(galleryImage)
                          .width(1400)
                          .auto('format')
                          .url()}
                        alt={
                          galleryImage.alt ||
                          `${project.title} ${text.galleryImageFallback}`
                        }
                        loading="lazy"
                      />

                      <span aria-hidden="true">
                        ↗
                      </span>
                    </button>

                    {galleryImage.caption && (
                      <figcaption>
                        {galleryImage.caption}
                      </figcaption>
                    )}
                  </figure>
                )
              )}
            </div>
          ) : (
            <p className="project-details-empty-gallery">
              {text.emptyGallery ||
                'No gallery images have been added yet.'}
            </p>
          )}
        </div>
      </section>

      {/* Gallery modal */}

      {selectedImage && (
        <div
          className="project-gallery-modal"
          role="dialog"
          aria-modal="true"
          aria-label={
            text.galleryLabel ||
            'Project gallery'
          }
          onMouseDown={closeModalFromBackdrop}
        >
          <div className="project-gallery-modal-top">
            <span>
              {String(
                selectedImageIndex + 1
              ).padStart(2, '0')}
              {' / '}
              {String(
                galleryImages.length
              ).padStart(2, '0')}
            </span>

            <button
              type="button"
              className="project-gallery-modal-close"
              onClick={() =>
                setSelectedImageIndex(null)
              }
              aria-label={
                text.closeGallery ||
                'Close gallery'
              }
            >
              {text.close || 'Close'}

              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="project-gallery-modal-content">
            {galleryImages.length > 1 && (
              <button
                type="button"
                className="project-gallery-modal-arrow previous"
                onClick={showPreviousImage}
                aria-label={
                  text.previousImage ||
                  'Previous image'
                }
              >
                ←
              </button>
            )}

            <figure>
              <img
                src={urlFor(selectedImage)
                  .width(2200)
                  .auto('format')
                  .url()}
                alt={
                  selectedImage.alt ||
                  `${project.title} ${text.galleryImageFallback}`
                }
              />

              {selectedImage.caption && (
                <figcaption>
                  {selectedImage.caption}
                </figcaption>
              )}
            </figure>

            {galleryImages.length > 1 && (
              <button
                type="button"
                className="project-gallery-modal-arrow next"
                onClick={showNextImage}
                aria-label={
                  text.nextImage ||
                  'Next image'
                }
              >
                →
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default ProjectDetails;