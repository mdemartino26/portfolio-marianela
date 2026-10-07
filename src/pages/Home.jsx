import { Link } from 'react-router-dom';
import Asterisk from '../components/Asterisk.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { profile } from '../data/profile.js';
import './Home.css';

// Carpetas apiladas de la portada: "x" es la posición horizontal de la pestaña.
const STACK = [
  { to: '/about', key: 'about', tone: 'cream', x: '54%' },
  { to: '/portfolio', key: 'portfolio', tone: 'sage', x: '28%' },
  { to: '/cv', key: 'cv', tone: 'cream', x: '5%' },
  { to: '/contact', key: 'contact', tone: 'sage', x: '42%' },
];

export default function Home() {
  const { t, tr } = useLanguage();

  return (
    <section className="home">
      <div className="home__intro">
        <p className="eyebrow">( {t('home.eyebrow')} )</p>
        <h1 className="display">
          Port<em>folio</em>
        </h1>
        <p className="home__name">
          {t('home.hello')} <strong>{profile.name}</strong>
        </p>
        <p className="lead muted">{tr(profile.tagline)}</p>
        <div className="btn-row">
          <Link className="btn" to="/portfolio">
            {t('home.ctaProjects')} <span aria-hidden="true">→</span>
          </Link>
          <Link className="btn btn--ghost" to="/cv">
            {t('home.ctaCv')}
          </Link>
        </div>
      </div>

      <aside className="cover">
        <nav className="stack" aria-label={t('home.stackLabel')}>
          {STACK.map((item, index) => (
            <Link
              key={item.to}
              to={item.to}
              className={`stack__folder stack__folder--${item.tone}`}
              style={{ '--x': item.x, animationDelay: `${150 + index * 110}ms` }}
            >
              <span className="stack__tab">( {t(`nav.${item.key}`)} )</span>
            </Link>
          ))}
        </nav>
        <div className="cover__footer">
          <Asterisk className="cover__mark" />
          <p className="cover__text">
            {t('home.coverLine1')}
            <br />
            {t('home.coverLine2')}
            <br />
            {t('home.coverLine3')}
          </p>
        </div>
      </aside>
    </section>
  );
}
