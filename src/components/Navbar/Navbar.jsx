import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) => {
    return isActive ? 'nav-link active' : 'nav-link';
  };

  const contactLinkClass = ({ isActive }) => {
    return isActive
      ? 'navbar-contact active'
      : 'navbar-contact';
  };

  return (
    <header className="navbar">
      <Link
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
      </Link>

      <button
        type="button"
        className="navbar-toggle"
        aria-label={
          menuOpen
            ? 'Close navigation'
            : 'Open navigation'
        }
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen((currentValue) => !currentValue)}
      >
        Menu
        <span>{menuOpen ? '−' : '+'}</span>
      </button>

      <nav
        id="main-navigation"
        className={
          menuOpen
            ? 'navbar-navigation open'
            : 'navbar-navigation'
        }
        aria-label="Main navigation"
      >
        <NavLink
          to="/"
          end
          className={navLinkClass}
          onClick={closeMenu}
        >
          Home
        </NavLink>

        <NavLink
          to="/about"
          className={navLinkClass}
          onClick={closeMenu}
        >
          About
        </NavLink>

        <NavLink
          to="/services"
          className={navLinkClass}
          onClick={closeMenu}
        >
          Services
        </NavLink>

        <NavLink
          to="/projects"
          className={navLinkClass}
          onClick={closeMenu}
        >
          Projects
        </NavLink>

        <NavLink
          to="/contact"
          className={contactLinkClass}
          onClick={closeMenu}
        >
          Let’s talk
          <span>↗</span>
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;