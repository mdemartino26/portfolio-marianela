import { Suspense, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { profile } from '../data/profile.js';
import { ROUTES } from '../routes.js';
import Asterisk from './Asterisk.jsx';
import FolderTabs from './FolderTabs.jsx';
import LanguageToggle from './LanguageToggle.jsx';
import './Layout.css';

export default function Layout() {
  const { pathname } = useLocation();
  const { t } = useLanguage();

  const current = ROUTES.find((route) => route.to === pathname);
  const tone = current?.tone ?? 'cream';
  const isFirstTab = pathname === ROUTES[0].to;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        {t('skip')}
      </a>

      <header className="site-header">
        <div className="topbar">
          <Link to="/" className="brand">
            <Asterisk className="brand__mark" />
            <span className="brand__name">{profile.name}</span>
          </Link>
          <LanguageToggle />
        </div>
        <FolderTabs />
      </header>

      <main
        id="main"
        className={`sheet sheet--${tone} ${isFirstTab ? 'sheet--first' : ''}`}
      >
        {/* la key reinicia la animación de entrada en cada cambio de ruta */}
        <div key={pathname} className="sheet__page">
          <Suspense fallback={<p className="muted">…</p>}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>{t('footer.rights')}</p>
      </footer>
    </div>
  );
}
