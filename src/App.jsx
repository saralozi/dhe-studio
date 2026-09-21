import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import About from './components/About/About';
import Services from './components/Services/Services';
import Projects from './components/Projects/Projects';
import ProjectDetails from './components/Projects/ProjectDetails';
import NotFound from './components/NotFound/NotFound';

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />

        <Route
          path='/about'
          element={<About />}
        />

        <Route
          path='/services'
          element={<Services />}
        />

        <Route
          path='/projects'
          element={<Projects />}
        />

        <Route
          path="/projects/:slug"
          element={<ProjectDetails />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>

      <Footer />

    </>
  )
}

export default App
