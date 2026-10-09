import { useRoutes } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import About from './components/About/About';
import Services from './components/Services/Services';
import Projects from './components/Projects/Projects';
import ProjectDetails from './components/Projects/ProjectDetails';
import NotFound from './components/NotFound/NotFound';
import Contact from './components/Contact/Contact';
import ScrollToTop from './components/ScrollOnTop/ScrollOnTop';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';

import { prefixedLanguages } from './i18n/config';

// The same pages are served in every language.
const pages = [
  { index: true, element: <Home /> },
  { path: 'about', element: <About /> },
  { path: 'services', element: <Services /> },
  { path: 'projects', element: <Projects /> },
  { path: 'projects/:slug', element: <ProjectDetails /> },
  { path: 'contact', element: <Contact /> },
  { path: 'privacy', element: <PrivacyPolicy /> },

];

const routes = [
  // Default language (English): /, /about, /projects/house-name
  { path: '/', children: pages },

  // Other languages: /sq, /sq/about, /tr/projects/house-name
  ...prefixedLanguages.map((language) => ({
    path: `/${language}`,
    children: pages,
  })),

  // Anything else, including /en/... and unknown URLs
  { path: '*', element: <NotFound /> },
];

function App() {
  const routeElement = useRoutes(routes);

  return (
    <>
      <Navbar />
      <ScrollToTop />
      {routeElement}
      <Footer />
    </>
  );
}

export default App;