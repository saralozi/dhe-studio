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
import SEO from '../SEO/SEO';

const isVideoItem = (galleryItem) => {
  return (
    galleryItem?._type === 'galleryVideo' ||
    galleryItem?.mimeType?.startsWith('video/')
  );
};

const ProjectDetails = () => {
  const { slug } = useParams();
  const { language } = useLanguage();

  const translations =
    getTranslations(language);

  const text =
    translations.projectDetailsPage;

  const projectsText =
    translations.projectsPage;

  const [project, setProject] =
    useState(null);

  const [
    projectLoading,
    setProjectLoading,
  ] = useState(true);

  const [
    projectError,
    setProjectError,
  ] = useState('');

  const [
    selectedMediaIndex,
    setSelectedMediaIndex,
  ] = useState(null);

  /*
    Keep valid images and videos only.

    Images use their Sanity image asset.
    Videos use the direct assetUrl returned by GROQ.
  */
  const galleryItems =
    project?.gallery?.filter(
      (galleryItem) => {
        if (isVideoItem(galleryItem)) {
          return Boolean(
            galleryItem.assetUrl
          );
        }

        return Boolean(
          galleryItem?.asset
        );
      }
    ) || [];

  // Get project from Sanity

  useEffect(() => {
    let isCurrentRequest = true;

    const getProject = async () => {
      try {
        setProjectLoading(true);
        setProjectError('');
        setSelectedMediaIndex(null);

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
  }, [
    slug,
    language,
    text.error,
  ]);

  // Modal keyboard navigation and scroll lock

  useEffect(() => {
    if (selectedMediaIndex === null) {
      return;
    }

    const previousBodyOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedMediaIndex(null);
      }

      if (
        event.key === 'ArrowLeft' &&
        galleryItems.length > 1
      ) {
        setSelectedMediaIndex(
          (currentIndex) => {
            if (currentIndex === null) {
              return null;
            }

            return (
              (currentIndex -
                1 +
                galleryItems.length) %
              galleryItems.length
            );
          }
        );
      }

      if (
        event.key === 'ArrowRight' &&
        galleryItems.length > 1
      ) {
        setSelectedMediaIndex(
          (currentIndex) => {
            if (currentIndex === null) {
              return null;
            }

            return (
              (currentIndex + 1) %
              galleryItems.length
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
    selectedMediaIndex,
    galleryItems.length,
  ]);

  const showPreviousMedia = () => {
    setSelectedMediaIndex(
      (currentIndex) => {
        if (currentIndex === null) {
          return null;
        }

        return (
          (currentIndex -
            1 +
            galleryItems.length) %
          galleryItems.length
        );
      }
    );
  };

  const showNextMedia = () => {
    setSelectedMediaIndex(
      (currentIndex) => {
        if (currentIndex === null) {
          return null;
        }

        return (
          (currentIndex + 1) %
          galleryItems.length
        );
      }
    );
  };

  const closeModalFromBackdrop = (
    event
  ) => {
    if (
      event.target === event.currentTarget
    ) {
      setSelectedMediaIndex(null);
    }
  };

  const getPosterUrl = (
    galleryItem,
    width = 1600
  ) => {
    if (!galleryItem?.poster?.asset) {
      return undefined;
    }

    return urlFor(galleryItem.poster)
      .width(width)
      .auto('format')
      .url();
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
        <SEO title={text.error} description={text.error} noindex />

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

  const selectedMedia =
    selectedMediaIndex !== null
      ? galleryItems[
      selectedMediaIndex
      ]
      : null;

  const selectedMediaIsVideo =
    isVideoItem(selectedMedia);

  const seoImage = project.coverImage?.asset
    ? urlFor(project.coverImage)
      .width(1200)
      .height(630)
      .fit('crop')
      .format('jpg')
      .url()
    : undefined;

  return (
    <main className="project-details">

      <SEO
        title={project.title}
        description={project.shortDescription || project.fullDescription}
        image={seoImage}
      />
      {/* Project hero */}

      <section className="project-details-hero">
        {project.coverImage?.asset && (
          <img
            className="project-details-hero-image"
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

        {project.heroVideoUrl && (
          <video
            className="project-details-hero-video"
            src={project.heroVideoUrl}
            poster={
              project.coverImage?.asset
                ? urlFor(project.coverImage)
                  .width(2200)
                  .height(1300)
                  .fit('crop')
                  .auto('format')
                  .url()
                : undefined
            }
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        )}

        <div className="project-details-overlay"></div>

        <div className="project-details-title">
          <p>
            {translatedCategory}
            {' · '}
            {String(project.order || 1).padStart(
              2,
              '0'
            )}
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
              <p>
                {project.shortDescription}
              </p>
            )}

            {project.fullDescription && (
              <p>
                {project.fullDescription}
              </p>
            )}
          </div>

          <div className="project-details-gallery-heading">
            <p>
              {text.galleryLabel ||
                'Project gallery'}
            </p>

            <span>
              {String(
                galleryItems.length
              ).padStart(2, '0')}
            </span>
          </div>

          {galleryItems.length > 0 ? (
            <div className="project-details-gallery">
              {galleryItems.map(
                (galleryItem, index) => {
                  const galleryItemIsVideo =
                    isVideoItem(
                      galleryItem
                    );

                  const mediaTitle =
                    galleryItem.title ||
                    galleryItem.alt ||
                    project.title;

                  return (
                    <figure
                      className={`project-details-gallery-item ${galleryItemIsVideo
                        ? 'is-video'
                        : 'is-image'
                        }`}
                      key={galleryItem._key}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedMediaIndex(
                            index
                          )
                        }
                        aria-label={
                          galleryItemIsVideo
                            ? `${text.openVideo ||
                            'Open video'
                            }: ${mediaTitle}`
                            : `${text.openImage ||
                            'Open image'
                            } ${index + 1}`
                        }
                      >
                        {galleryItemIsVideo ? (
                          <>
                            <video
                              className="project-details-gallery-video"
                              src={
                                galleryItem.assetUrl
                              }
                              poster={getPosterUrl(
                                galleryItem,
                                1400
                              )}
                              muted
                              playsInline
                              preload="metadata"
                              aria-label={
                                galleryItem.title ||
                                `${project.title} project video`
                              }
                            />

                            <span
                              className="project-details-gallery-play"
                              aria-hidden="true"
                            >
                              ▶
                            </span>
                          </>
                        ) : (
                          <img
                            src={urlFor(
                              galleryItem
                            )
                              .width(1400)
                              .auto('format')
                              .url()}
                            alt={
                              galleryItem.alt ||
                              `${project.title} ${text.galleryImageFallback}`
                            }
                            loading="lazy"
                          />
                        )}

                        <span
                          className="project-details-gallery-open"
                          aria-hidden="true"
                        >
                          ↗
                        </span>
                      </button>

                      {galleryItem.caption && (
                        <figcaption>
                          {galleryItem.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                }
              )}
            </div>
          ) : (
            <p className="project-details-empty-gallery">
              {text.emptyGallery ||
                'No gallery media has been added yet.'}
            </p>
          )}
        </div>
      </section>

      {/* Gallery modal */}

      {selectedMedia && (
        <div
          className="project-gallery-modal"
          role="dialog"
          aria-modal="true"
          aria-label={
            text.galleryLabel ||
            'Project gallery'
          }
          onMouseDown={
            closeModalFromBackdrop
          }
        >
          <div className="project-gallery-modal-top">
            <span>
              {String(
                selectedMediaIndex + 1
              ).padStart(2, '0')}
              {' / '}
              {String(
                galleryItems.length
              ).padStart(2, '0')}
            </span>

            <button
              type="button"
              className="project-gallery-modal-close"
              onClick={() =>
                setSelectedMediaIndex(null)
              }
              aria-label={
                text.closeGallery ||
                'Close gallery'
              }
            >
              {text.close || 'Close'}

              <span aria-hidden="true">
                ×
              </span>
            </button>
          </div>

          <div className="project-gallery-modal-content">
            {galleryItems.length > 1 && (
              <button
                type="button"
                className="project-gallery-modal-arrow previous"
                onClick={
                  showPreviousMedia
                }
                aria-label={
                  text.previousImage ||
                  'Previous gallery item'
                }
              >
                ←
              </button>
            )}

            <figure
              key={selectedMedia._key}
              className={
                selectedMediaIsVideo
                  ? 'is-video'
                  : 'is-image'
              }
            >
              {selectedMediaIsVideo ? (
                <video
                  className="project-gallery-modal-video"
                  src={
                    selectedMedia.assetUrl
                  }
                  poster={getPosterUrl(
                    selectedMedia,
                    2000
                  )}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  aria-label={
                    selectedMedia.title ||
                    `${project.title} project video`
                  }
                >
                  Your browser does not
                  support video playback.
                </video>
              ) : (
                <img
                  src={urlFor(
                    selectedMedia
                  )
                    .width(2200)
                    .auto('format')
                    .url()}
                  alt={
                    selectedMedia.alt ||
                    `${project.title} ${text.galleryImageFallback}`
                  }
                />
              )}

              {selectedMedia.caption && (
                <figcaption>
                  {selectedMedia.caption}
                </figcaption>
              )}
            </figure>

            {galleryItems.length > 1 && (
              <button
                type="button"
                className="project-gallery-modal-arrow next"
                onClick={showNextMedia}
                aria-label={
                  text.nextImage ||
                  'Next gallery item'
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