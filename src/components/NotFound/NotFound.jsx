import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <main className="not-found">
      <div className="not-found-content">
        <p className="not-found-label">
          <span></span>
          ERROR 404
        </p>

        <h1>
          This space
          <br />
          <span>doesn’t exist.</span>
        </h1>

        <p className="not-found-description">
          The page you are looking for may have been moved,
          renamed or removed.
        </p>

        <Link to="/" className="not-found-link">
          Return home
          <span>↗</span>
        </Link>
      </div>

      <span className="not-found-number">404</span>
    </main>
  );
};

export default NotFound;