import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import SiteHeader from './components/site-header.jsx';
import SiteFooter from './components/site-footer.jsx';
import HomePage from './pages/home-page.jsx';

// The admin panel loads separately: visitors never download it.
const AdminPage = lazy(() => import('./pages/admin-page.jsx'));

export default function App() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Suspense fallback={<p className="container">…</p>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
