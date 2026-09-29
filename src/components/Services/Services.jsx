import { useEffect, useRef, useState } from 'react';

import { sanityClient } from '../../sanity/client';
import { servicesQuery } from '../../sanity/queries';
import { urlFor } from '../../sanity/image';

import './services.css';

const Services = () => {
  const servicesListRef = useRef(null);

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
          setError('The services could not be loaded.');
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
  }, []);

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
          WHAT WE DO
        </p>

        <h1 className="page-hero-title">
          How we shape
          <br />
          <span>space and experience.</span>
        </h1>
      </section>

      {/* Services list */}

      <section
        className="services-list"
        ref={servicesListRef}
      >
        {isLoading && (
          <p className="services-message">
            Loading services...
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
              {/* Service title */}

              <div className="services-title">
                <h2>{service.title}</h2>
              </div>

              {/* Service description */}

              <div className="services-content">
                <p className="services-main-description">
                  {service.shortDescription}
                </p>

                <p>{service.fullDescription}</p>
              </div>

              {/* Service image */}

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
                      `${service.title} service`
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