import {
  useLanguage,
} from '../../context/LanguageContext';
import {
  getTranslations,
} from '../../i18n/translations';

import {
  LocalizedLink,
} from '../LocalizedLink/LocalizedLink';

import './NotFound.css';

const NotFound = () => {
  const { language } = useLanguage();

  const text =
    getTranslations(language).notFoundPage;

  return (
    <main className="not-found">
      <div className="not-found-content">
        <p className="not-found-label">
          <span></span>
          {text.label}
        </p>

        <h1>
          {text.titleFirstLine}
          <br />
          <span>{text.titleSecondLine}</span>
        </h1>

        <p className="not-found-description">
          {text.description}
        </p>

        <LocalizedLink to="/" className="not-found-link">
          {text.homeLink}
          <span>↗</span>
        </LocalizedLink>
      </div>

      <span className="not-found-number">
        404
      </span>
    </main>
  );
};

export default NotFound;