import { useState } from 'react';
import { useLanguage } from '../context/language-context.jsx';
import { profile } from '../data/profile-data.js';
import { downloadCv } from '../utils/cv-pdf.js';
import './hero-section.css';

export default function HeroSection() {
  const { lang, t, tr } = useLanguage();
  const [creating, setCreating] = useState(false);

  // Creates the CV with the site's colors, in the language the visitor is reading.
  async function handleDownload() {
    setCreating(true);
    try {
      await downloadCv({ profile, lang, t, tr });
    } catch (error) {
      console.error('CV:', error);
    }
    setCreating(false);
  }

  return (
    <section className="hero-section">
      <div className="container">
        <h1 className="hero-name" data-aos="fade-in">
          <span className="text-mint">*</span> {profile.name}
        </h1>

        {/* Big decorative headline, inspired by the reference design */}
        <p className="hero-title">
          <span className="hero-line" data-aos="fade-up">
            <span className="text-coral" aria-hidden="true">⇒</span>
            <span className="text-purple" aria-hidden="true">{'{'}</span>
            {t('hero.line1')}
            <span className="text-mint" aria-hidden="true">≡</span>
            
          </span>
          <span className="hero-line hero-line-indent" data-aos="fade-up" data-aos-delay="120">
            {t('hero.line2')}
            <span className="text-purple" aria-hidden="true">{'}'}</span>
            <span className="text-coral" aria-hidden="true">..</span>
          </span>
          <span className="hero-line" data-aos="fade-up" data-aos-delay="240">
            {t('hero.line3')}
            <span className="text-mint" aria-hidden="true">≈</span>
            <span className="text-purple" aria-hidden="true">*</span>
          </span>
        </p>

        <div className="hero-bottom" data-aos="fade-up" data-aos-delay="360">
          <p className="hero-role muted">{tr(profile.role)}</p>
          <div className="hero-buttons">
            <a className="button" href="#projects">
              {t('hero.ctaProjects')}
            </a>
            <button type="button" className="button button-ghost" onClick={handleDownload} disabled={creating}>
              {creating ? t('hero.creatingCv') : `${t('hero.ctaCv')} ↓`}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
