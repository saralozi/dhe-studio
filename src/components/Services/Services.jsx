import { useEffect, useRef, useState } from 'react';

import {
  useLanguage,
} from '../../context/LanguageContext';
import {
  getTranslations,
} from '../../i18n/translations';
import { sanityClient } from '../../sanity/client';
import { servicesQuery } from '../../sanity/queries';
import { urlFor } from '../../sanity/image';

import './services.css';

const Services = () => {
  const { language } = useLanguage();

  const text =
    getTranslations(language).servicesPage;

  const servicesListRef = useRef(null);

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Get services from Sanity

  useEffect(() => {
    let isCurrentRequest = true;

    const getServices = async () => {
      try {
        setIsLoading(true);
        setError('');

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
          setError(text.error);
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    };

    getServices();

    return () => {
      isCurrentRequest = false;
    };
  }, [language, text.error]);

  // Reveal each service when it enters the screen

  useEffect(() => {
    if (
      isLoading ||
      error ||
      !servicesListRef.current
    ) {
      return;
    }

    const serviceRows =
      servicesListRef.current.querySelectorAll(
        '.services-row'
      );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    serviceRows.forEach((row) => {
      row.classList.add('reveal-ready');
      observer.observe(row);
    });

    return () => {
      observer.disconnect();
    };
  }, [isLoading, error, services]);

  return (
    <main className="services-page">
      {/* Page introduction */}

      <section className="services-hero">
        <p className="services-label">
          <span></span>
          {text.label}
        </p>

        <h1 className="page-hero-title">
          {text.titleFirstLine}
          <br />
          <span>{text.titleSecondLine}</span>
        </h1>
      </section>

      {/* Services list */}

      <section
        className="services-list"
        ref={servicesListRef}
      >
        {isLoading && (
          <p className="services-message">
            {text.loading}
          </p>
        )}

        {error && (
          <p className="services-message services-error">
            {error}
          </p>
        )}

        {!isLoading &&
          !error &&
          services.map((service) => (
            <article
              className="services-row"
              key={service._id}
            >
              <div className="services-title">
                <h2>{service.title}</h2>
              </div>

              <div className="services-content">
                <p className="services-main-description">
                  {service.shortDescription}
                </p>

                <p>{service.fullDescription}</p>
              </div>

              <div className="services-image">
                {service.image?.asset && (
                  <img
                    src={urlFor(service.image)
                      .width(1000)
                      .height(550)
                      .fit('crop')
                      .auto('format')
                      .url()}
                    alt={
                      service.imageAlt ||
                      `${service.title} ${text.imageFallback}`
                    }
                    loading="lazy"
                  />
                )}
              </div>
            </article>
          ))}
      </section>
    </main>
  );
};

export default Services;