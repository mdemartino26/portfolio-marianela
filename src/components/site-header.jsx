import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/language-context.jsx';
import './site-header.css';

const SECTIONS = ['about', 'skills', 'experience', 'projects', 'contact'];

export default function SiteHeader() {
  const { t, toggleLang } = useLanguage();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = pathname === '/admin';

  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        {t('skip')}
      </a>

      <div className="container site-header-inner">
        <Link className="site-header-logo" to="/" onClick={() => window.scrollTo(0, 0)}>
          <span className="text-mint">*</span>marianela
        </Link>

        <nav className={`site-header-nav ${menuOpen ? 'is-open' : ''}`} aria-label={t('nav.label')}>
          {isAdmin ? (
            <Link className="site-header-link" to="/">
              ← {t('nav.back')}
            </Link>
          ) : (
            SECTIONS.map((id) => (
              <a key={id} className="site-header-link" href={`#${id}`} onClick={() => setMenuOpen(false)}>
                {t(`nav.${id}`)}
              </a>
            ))
          )}
        </nav>

        <div className="site-header-actions">
          <button type="button" className="site-header-lang" onClick={toggleLang} aria-label={t('lang.label')}>
            {t('lang.short')}
          </button>

          {!isAdmin && (
            <button
              type="button"
              className="site-header-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label={t('nav.menu')}
            >
              <span />
              <span />
              <span />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
