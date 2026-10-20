import { useLanguage } from '../context/language-context.jsx';
import { profile } from '../data/profile-data.js';
import SectionTitle from './section-title.jsx';
import './about-section.css';

export default function AboutSection() {
  const { t, tr } = useLanguage();

  return (
    <section id="about" className="page-section">
      <div className="container">
        <SectionTitle symbol="⇒" color="coral">
          {t('about.title')}
        </SectionTitle>

        <div className="about-content">
          <div className="about-text">
            {profile.bio.map((paragraph, index) => (
              <p key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                {tr(paragraph)}
              </p>
            ))}
          </div>

          <aside className="about-facts" data-aos="fade-up" data-aos-delay="150">
            <div className="about-fact">
              <p className="about-fact-label text-mint">{t('about.awardLabel')}</p>
              <p>{tr(profile.award)}</p>
            </div>
            <div className="about-fact">
              <p className="about-fact-label text-purple">{t('about.languagesLabel')}</p>
              <ul className="chip-list">
                {profile.languages.map((language) => (
                  <li key={language.en} className="chip">
                    {tr(language)}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
