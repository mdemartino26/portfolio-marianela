import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { profile } from '../data/profile.js';
import './pages.css';

export default function About() {
  const { t, tr } = useLanguage();

  return (
    <>
      <header className="page-header">
        <p className="eyebrow">( {tr(profile.role)} )</p>
        <h1 className="display">
          {t('about.title')} <em>{t('about.titleEm')}</em>
        </h1>
      </header>

      <div className="split">
        <section className="split__main about__bio">
          {profile.bio.map((paragraph, index) => (
            <p key={index} className={index === 0 ? 'lead' : 'muted'}>
              {tr(paragraph)}
            </p>
          ))}
          <div className="btn-row">
            <Link className="btn" to="/contact">
              {t('about.cta')} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <aside className="split__side">
          <section className="card">
            <h2 className="section-title">{t('about.education')}</h2>
            <ul className="fact-list">
              {profile.education.map((item) => (
                <li key={item.place}>
                  <strong>{tr(item.title)}</strong>
                  <span className="muted">
                    {item.place} · {tr(item.status)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2 className="section-title">{t('about.languages')}</h2>
            <ul className="chip-list">
              {profile.languages.map((language) => (
                <li key={language.name.es} className="chip">
                  {tr(language.name)} · {tr(language.level)}
                </li>
              ))}
            </ul>
          </section>

          {profile.awards.map((award) => (
            <section key={award.title.es} className="card card--ink">
              <h2 className="section-title">{t('about.highlight')}</h2>
              <p className="award__title">{tr(award.title)}</p>
              <p>{tr(award.detail)}</p>
            </section>
          ))}
        </aside>
      </div>
    </>
  );
}
