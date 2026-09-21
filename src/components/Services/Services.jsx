import { services } from '../../data/services';
import './services.css';

const Services = () => {
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
        {services.map((service) => (
          <article
            className="services-row"
            key={service.id}
          >
            <span className="services-number">
              {service.number}
            </span>

            <div className="services-image">
              <img
                src={service.image}
                alt={service.alt}
              />
            </div>

            <div className="services-content">
              <h2>{service.title}</h2>

              <p className="services-main-description">
                {service.description}
              </p>

              <p>{service.details}</p>
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

          <a href="#contact" className="services-contact-link">
            Let’s talk
            <span>↗</span>
          </a>
        </div>
      </section>
    </main>
  );
};

export default Services;