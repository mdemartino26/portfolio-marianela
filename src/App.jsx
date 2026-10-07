import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Portfolio from './pages/Portfolio.jsx';
import CV from './pages/CV.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

// El panel admin se carga aparte: los visitantes no lo necesitan.
const Admin = lazy(() => import('./pages/Admin.jsx'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
