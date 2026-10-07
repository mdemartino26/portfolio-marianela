import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { ROUTES } from '../routes.js';

// Menú principal: cada ruta es una pestaña de carpeta.
export default function FolderTabs() {
  const { t } = useLanguage();

  return (
    <nav className="tabs" aria-label={t('nav.label')}>
      <ul className="tabs__list">
        {ROUTES.map((route, index) => (
          <li
            key={route.to}
            className={`tabs__item ${route.key === 'admin' ? 'tabs__item--end' : ''}`}
          >
            <NavLink
              to={route.to}
              end
              className={({ isActive }) =>
                `tab tab--${route.tone} ${isActive ? 'is-active' : ''}`
              }
              // escalonado: cada pestaña asoma a una altura distinta
              style={{ '--step': `${(index % 3) * 4}px` }}
            >
              ( {t(`nav.${route.key}`)} )
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
