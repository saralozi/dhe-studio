import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sanityClient } from '../../sanity/client';
import { aboutQuery } from '../../sanity/queries';
import { urlFor } from '../../sanity/image';
import './about.css';

const About = () => {
  const [about, setAbout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Get the About page content from Sanity
  useEffect(() => {
    const getAboutContent = async () => {
      try {
        const aboutFromSanity = await sanityClient.fetch(
          aboutQuery,
          {
            // We start with English.
            // Later, this will be the language selected by the user.
            language: 'en',
          }
        );

        if (!aboutFromSanity) {
          throw new Error(
            'No published About document was found.'
          );
        }

        setAbout(aboutFromSanity);
      } catch (fetchError) {
        console.error(fetchError);

        setError('The About page could not be loaded.');
      } finally {
        setIsLoading(false);
      }
    };

    getAboutContent();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <main className="about-page">
        <p className="about-message">
          Loading studio information...
        </p>
      </main>
    );
  }

  // Error state
  if (error || !about) {
    return (
      <main className="about-page">
        <p className="about-message about-error">
          {error || 'The About page could not be loaded.'}
        </p>
      </main>
    );
  }

  return (
    <main className="about-page">
      {/* Page introduction */}

      <section className="about-hero">
        <p className="about-label">
          <span></span>
          {about.heroLabel}
        </p>

        <div className="about-hero-content">
          <h1 className="page-hero-title">
            {about.heroTitleFirstLine}
            <br />
            <span>{about.heroTitleSecondLine}</span>
          </h1>

          <p className="about-introduction">
            {about.heroIntroduction}
          </p>
        </div>
      </section>

      {/* Studio story */}

      <section className="about-story">
        <div className="about-story-image">
          {about.storyImage?.asset && (
            <img
              src={urlFor(about.storyImage)
                .width(1200)
                .height(900)
                .fit('crop')
                .auto('format')
                .url()}
              alt={
                about.storyImage.alt ||
                'DHÈ Studio interior'
              }
            />
          )}
        </div>

        <div className="about-story-content">
          {about.storyParagraphs?.map(
            (paragraph, index) => (
              <p
                className={
                  index === 0
                    ? 'about-story-lead'
                    : undefined
                }
                key={paragraph._key}
              >
                {paragraph.text}
              </p>
            )
          )}

          <Link to="/projects" className="about-link">
            {about.projectsLinkLabel}
            <span>↗</span>
          </Link>
        </div>
      </section>

      {/* Design principles */}

      <section className="about-principles">
        <p className="about-label">
          <span></span>
          {about.approachLabel}
        </p>

        <div className="about-principles-grid">
          {about.principles?.map((principle, index) => (
            <article
              className="about-principle"
              key={principle._key}
            >
              <span className="about-principle-number">
                {String(index + 1).padStart(2, '0')}
              </span>

              <h2>{principle.title}</h2>

              <p>{principle.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default About;