import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
            <div>
              <dt>EMAIL</dt>
              <dd>Studio email to be added</dd>
            </div>

            <div>
              <dt>PHONE</dt>
              <dd>Studio number to be added</dd>
            </div>

            <div>
              <dt>VISIT</dt>
              <dd>Studio address to be added</dd>
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