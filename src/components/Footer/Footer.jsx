import { Link } from 'react-router-dom';

import {
  useLanguage,
} from '../../context/LanguageContext';
import {
  getTranslations,
} from '../../i18n/translations';

import './footer.css';

const Footer = () => {
  const { language } = useLanguage();

  const text =
    getTranslations(language).footer;

  const currentYear = new Date().getFullYear();

  const email = 'info@studiodhe.com';

  const instagramUrl =
    'https://www.instagram.com/dhearchitecture/';

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="footer" id="contact">
      <div className="footer-top">
        <div className="footer-heading">
          <h2>
            {text.headingFirstLine}
            <br />

            {text.headingBeforeEmphasis && (
              <>
                {text.headingBeforeEmphasis}{' '}
              </>
            )}

            <em>{text.headingEmphasis}</em>

            {text.headingAfterEmphasis && (
              <>
                {' '}
                {text.headingAfterEmphasis}
              </>
            )}
          </h2>
        </div>

        <div className="footer-contact">
          <dl>
            {/* Email */}

            <div>
              <dt>{text.email}</dt>

              <dd>
                <a href={`mailto:${email}`}>
                  {email}
                </a>
              </dd>
            </div>

            {/* Social media */}

            <div>
              <dt>{text.socials}</dt>

              <dd>
                <a
                  className="footer-instagram"
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={
                    text.instagramAriaLabel
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="5"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="4"
                    />

                    <circle
                      cx="17.5"
                      cy="6.5"
                      r="1"
                      className="instagram-dot"
                    />
                  </svg>

                  <span>@dhearchitecture</span>
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="footer-bottom">
        <Link
          to="/"
          className="footer-brand"
          aria-label={text.homeAriaLabel}
        >
          <span className="footer-logo">
            <img
              src="/images/dhe-logo.jpg"
              alt="DHÈ Studio logo"
            />
          </span>

          <span className="footer-brand-name">
            DHÈ STUDIO
            <small>
              Designing Human Experiences
            </small>
          </span>
        </Link>

        <span className="footer-copyright">
          © {currentYear} DHÈ Studio
        </span>

        <button
          type="button"
          className="back-to-top"
          onClick={scrollToTop}
        >
          {text.backToTop} ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;