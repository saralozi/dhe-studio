import { useState } from 'react';

import {
  useLanguage,
} from '../../context/LanguageContext';
import {
  getTranslations,
} from '../../i18n/translations';

import './navbar.css';

import {
  LocalizedLink,
  LocalizedNavLink,
} from '../LocalizedLink/LocalizedLink';


const languageOptions = [
  {
    value: 'en',
    label: 'EN',
  },
  {
    value: 'sq',
    label: 'AL',
  },
  {
    value: 'tr',
    label: 'TR',
  },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { language, setLanguage } = useLanguage();
  const text = getTranslations(language).navbar;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    closeMenu();
  };

  const navLinkClass = ({ isActive }) => {
    return isActive
      ? 'nav-link active'
      : 'nav-link';
  };

  const contactLinkClass = ({ isActive }) => {
    return isActive
      ? 'navbar-contact active'
      : 'navbar-contact';
  };

  return (
    <header className="navbar">
      <LocalizedLink
        to="/"
        className="navbar-brand"
        aria-label="DHÈ Studio home"
        onClick={closeMenu}
      >
        <span className="navbar-logo">
          <img
            src="/images/dhe-logo.jpg"
            alt="DHÈ Studio logo"
          />
        </span>

        <span className="navbar-brand-name">
          DHÈ STUDIO
          <small>Designing Human Experiences</small>
        </span>
      </LocalizedLink>

      <button
        type="button"
        className="navbar-toggle"
        aria-label={
          menuOpen
            ? text.closeMenu
            : text.openMenu
        }
        aria-expanded={menuOpen}
        aria-controls="navbar-panel"
        onClick={() =>
          setMenuOpen((currentValue) => !currentValue)
        }
      >
        {text.menu}
        <span>{menuOpen ? '−' : '+'}</span>
      </button>

      <div
        id="navbar-panel"
        className={
          menuOpen
            ? 'navbar-right open'
            : 'navbar-right'
        }
      >
        {/* Language selector */}

        <div
          className="navbar-language-switcher"
          role="group"
          aria-label={text.languageSelector}
        >
          {languageOptions.map((option) => (
            <button
              type="button"
              className={
                language === option.value
                  ? 'navbar-language active'
                  : 'navbar-language'
              }
              aria-label={`${text.languageSelector}: ${option.label}`}
              aria-pressed={
                language === option.value
              }
              key={option.value}
              onClick={() =>
                changeLanguage(option.value)
              }
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Main navigation */}

        <nav
          className="navbar-navigation"
          aria-label={text.mainNavigation}
        >
          <LocalizedNavLink
            to="/"
            end
            className={navLinkClass}
            onClick={closeMenu}
          >
            {text.home}
          </LocalizedNavLink>

          <LocalizedNavLink
            to="/about"
            className={navLinkClass}
            onClick={closeMenu}
          >
            {text.about}
          </LocalizedNavLink>

          <LocalizedNavLink
            to="/services"
            className={navLinkClass}
            onClick={closeMenu}
          >
            {text.services}
          </LocalizedNavLink>

          <LocalizedNavLink
            to="/projects"
            className={navLinkClass}
            onClick={closeMenu}
          >
            {text.projects}
          </LocalizedNavLink>

          <LocalizedNavLink
            to="/contact"
            className={contactLinkClass}
            onClick={closeMenu}
          >
            {text.contact}
            <span>↗</span>
          </LocalizedNavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;