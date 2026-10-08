import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { localizePath } from '../../i18n/config';

export const LocalizedLink = ({ to, ...props }) => {
  const { language } = useLanguage();
  return <Link to={localizePath(to, language)} {...props} />;
};

export const LocalizedNavLink = ({ to, end, ...props }) => {
  const { language } = useLanguage();
  return (
    <NavLink
      to={localizePath(to, language)}
      end={end ?? to === '/'}
      {...props}
    />
  );
};