import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
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
          <p className="footer-kicker">
            <span></span>
            LET’S START A CONVERSATION
          </p>

          <h2>
            Every great space
            <br />
            starts with <em>an idea.</em>
          </h2>
        </div>

        <div className="footer-contact">
          <dl>
            {/* Email */}

            <div>
              <dt>EMAIL</dt>

              <dd>
                <a href={`mailto:${email}`}>
                  {email}
                </a>
              </dd>
            </div>

            {/* Phone */}

            <div>
              <dt>PHONE</dt>

              <dd>Studio number to be added</dd>
            </div>

            {/* Social media */}

            <div>
              <dt>SOCIALS</dt>

              <dd>
                <a
                  className="footer-instagram"
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Visit DHÈ Studio on Instagram"
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
          aria-label="DHÈ Studio home"
        >
          <span className="footer-logo">
            <img
              src="/images/dhe-logo.jpg"
              alt="DHÈ Studio logo"
            />
          </span>

          <span className="footer-brand-name">
            DHÈ STUDIO
            <small>Designing Human Experiences</small>
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
          Back to top ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;