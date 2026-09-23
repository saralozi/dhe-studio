import { useEffect, useState } from 'react';
import { sanityClient } from '../../sanity/client';
import { servicesQuery } from '../../sanity/queries';
import { urlFor } from '../../sanity/image';
import './services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getServices = async () => {
      try {
        const servicesFromSanity =
          await sanityClient.fetch(servicesQuery);

        setServices(servicesFromSanity);
      } catch (fetchError) {
        console.error(fetchError);
        setError('The services could not be loaded.');
      } finally {
        setIsLoading(false);
      }
    };

    getServices();
  }, []);

  return (
    <main className="services-page">
      {/* Page introduction */}

      <section className="services-hero">
        <p className="services-label">
          <span></span>
          WHAT WE DO
        </p>

        <h1>
          From the first idea.
          <br />
          <span>To the final detail.</span>
        </h1>

        <p className="services-introduction">
          One studio, four connected disciplines and a clear
          process shaped around each project.
        </p>
      </section>

      {/* Services list */}

      <section className="services-list">
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
          services.map((service, index) => (
            <article
              className="services-row"
              key={service._id}
            >
              <span className="services-number">
                {String(service.order || index + 1).padStart(
                  2,
                  '0'
                )}
              </span>

              <div className="services-image">
                {service.image && (
                  <img
                    src={urlFor(service.image)
                      .width(1000)
                      .height(750)
                      .fit('crop')
                      .auto('format')
                      .url()}
                    alt={
                      service.imageAlt ||
                      `${service.title} service`
                    }
                  />
                )}
              </div>

              <div className="services-content">
                <h2>{service.title}</h2>

                <p className="services-main-description">
                  {service.shortDescription}
                </p>

                <p>{service.fullDescription}</p>
              </div>
            </article>
          ))}
      </section>

      {/* Contact call to action */}

      <section className="services-contact">
        <p className="services-label">
          <span></span>
          START A PROJECT
        </p>

        <div className="services-contact-content">
          <h2>
            Have a space
            <br />
            <span>in mind?</span>
          </h2>

          <a
            href="#contact"
            className="services-contact-link"
          >
            Let’s talk
            <span>↗</span>
          </a>
        </div>
      </section>
    </main>
  );
};

export default Services;