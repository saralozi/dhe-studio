import { useEffect, useState } from 'react';

import {
  useLanguage,
} from '../../context/LanguageContext';
import {
  getTranslations,
} from '../../i18n/translations';
import { sanityClient } from '../../sanity/client';
import { aboutQuery } from '../../sanity/queries';
import { urlFor } from '../../sanity/image';

import {
  LocalizedLink,
} from '../LocalizedLink/LocalizedLink';
import SEO from '../SEO/SEO';

import './about.css';

const About = () => {
  const { language } = useLanguage();

  const translations = getTranslations(language);
  console.log(Object.keys(translations));
  const text = translations.aboutPage;

  const [about, setAbout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Get the About page content from Sanity

  useEffect(() => {
    let isCurrentRequest = true;

    const getAboutContent = async () => {
      try {
        setIsLoading(true);
        setError('');

        const aboutFromSanity =
          await sanityClient.fetch(aboutQuery, {
            language,
          });

        if (!aboutFromSanity) {
          throw new Error(text.error);
        }

        if (isCurrentRequest) {
          setAbout(aboutFromSanity);
        }
      } catch (fetchError) {
        console.error(fetchError);

        if (isCurrentRequest) {
          setError(text.error);
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    };

    getAboutContent();

    return () => {
      isCurrentRequest = false;
    };
  }, [language, text.error]);

  // Loading state

  if (isLoading) {
    return (
      <main className="about-page">
        <p className="about-message">
          {text.loading}
        </p>
      </main>
    );
  }

  // Error state

  if (error || !about) {
    return (
      <main className="about-page">
        <p className="about-message about-error">
          {error || text.error}
        </p>
      </main>
    );
  }

  return (
    <main className="about-page">

      <SEO
        title={translations.seo.about.title}
        description={translations.seo.about.description}
      />      
      
      {/* Page introduction */}

      <section className="about-hero inner-page-hero">
        <p className="about-label inner-page-label">
          <span></span>
          {about.heroLabel}
        </p>

        <div className="about-hero-content">
          <h1 className="page-hero-title">
            {about.heroTitleFirstLine}
            <br />
            <span>
              {about.heroTitleSecondLine}
            </span>
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
                text.imageFallback
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

          <LocalizedLink to="/projects" className="about-link">
            {about.projectsLinkLabel}
            <span>↗</span>
          </LocalizedLink>
        </div>
      </section>

      {/* Design principles */}

      <section className="about-principles">
        <p className="about-label">
          <span></span>
          {about.approachLabel}
        </p>

        <div className="about-principles-grid">
          {about.principles?.map(
            (principle, index) => (
              <article
                className="about-principle"
                key={principle._key}
              >
                <span className="about-principle-number">
                  {String(index + 1).padStart(
                    2,
                    '0'
                  )}
                </span>

                <h2>{principle.title}</h2>

                <p>{principle.description}</p>
              </article>
            )
          )}
        </div>
      </section>
    </main>
  );
};

export default About;