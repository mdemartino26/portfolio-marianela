import { useEffect, useState } from 'react';
import MiniTabs from '../components/MiniTabs.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { profile } from '../data/profile.js';
import { createCvPdf, cvFileName } from '../utils/cvPdf.js';
import './pages.css';

const SECTIONS = ['experience', 'education', 'skills', 'languages', 'awards'];

export default function CV() {
  const { lang, t, tr } = useLanguage();
  const [section, setSection] = useState('experience');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [busy, setBusy] = useState(null); // 'view' | 'download' | null
  const [pdfError, setPdfError] = useState(false);

  // El PDF depende del idioma: al cambiarlo se descarta la vista previa.
  useEffect(() => {
    setPreviewUrl(null);
  }, [lang]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function runPdf(action, callback) {
    setBusy(action);
    setPdfError(false);
    try {
      const doc = await createCvPdf({ profile, t, tr });
      callback(doc);
    } catch (err) {
      console.error('PDF:', err);
      setPdfError(true);
    } finally {
      setBusy(null);
    }
  }

  function handleView() {
    if (previewUrl) {
      setPreviewUrl(null);
      return;
    }
    runPdf('view', (doc) => setPreviewUrl(URL.createObjectURL(doc.output('blob'))));
  }

  function handleDownload() {
    runPdf('download', (doc) => doc.save(cvFileName(profile, lang)));
  }

  const tabs = SECTIONS.map((id) => ({ id, label: t(`cv.${id}`) }));

  return (
    <>
      <header className="page-header">
        <p className="eyebrow">( {profile.name} )</p>
        <h1 className="display">
          {t('cv.title')} <em>{t('cv.titleEm')}</em>
        </h1>
        <p className="lead">{tr(profile.tagline)}</p>

        <div className="btn-row">
          <button type="button" className="btn" onClick={handleDownload} disabled={busy !== null}>
            <span aria-hidden="true">↓</span>
            {busy === 'download' ? t('cv.generating') : t('cv.download')}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={handleView}
            disabled={busy !== null}
            aria-expanded={Boolean(previewUrl)}
          >
            {busy === 'view' ? t('cv.generating') : previewUrl ? t('cv.hide') : t('cv.view')}
          </button>
        </div>
        {pdfError && <p className="notice notice--error" role="alert">{t('cv.pdfError')}</p>}
      </header>

      {previewUrl && (
        <section className="cv-preview" aria-label={t('cv.previewTitle')}>
          <iframe className="cv-preview__frame" src={previewUrl} title={t('cv.previewTitle')} />
        </section>
      )}

      <MiniTabs tabs={tabs} active={section} onChange={setSection} label={t('cv.tabsLabel')}>
        {section === 'experience' && (
          <ol className="timeline">
            {profile.experience.map((job) => (
              <li key={job.role.es} className="timeline__item">
                <h3 className="timeline__role">{tr(job.role)}</h3>
                {(job.company || job.period) && (
                  <p className="timeline__meta">
                    {[job.company, job.period].filter(Boolean).join(' · ')}
                  </p>
                )}
                <p className="muted">{tr(job.description)}</p>
              </li>
            ))}
          </ol>
        )}

        {section === 'education' && (
          <ol className="timeline">
            {profile.education.map((item) => (
              <li key={item.place} className="timeline__item">
                <h3 className="timeline__role">{tr(item.title)}</h3>
                <p className="timeline__meta">
                  {item.place} · {tr(item.status)}
                </p>
              </li>
            ))}
          </ol>
        )}

        {section === 'skills' && (
          <div className="skill-groups">
            {profile.skills.map((group) => (
              <section key={group.group.es} className="skill-group">
                <h3 className="section-title">{tr(group.group)}</h3>
                <ul className="chip-list">
                  {group.items.map((item) => (
                    <li key={tr(item)} className="chip">
                      {tr(item)}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        {section === 'languages' && (
          <ul className="level-list">
            {profile.languages.map((language) => (
              <li key={language.name.es} className="level">
                <p className="level__label">
                  <strong>{tr(language.name)}</strong>
                  <span>{tr(language.level)}</span>
                </p>
                <div className="level__track" aria-hidden="true">
                  <div className="level__bar" style={{ '--value': `${language.value}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}

        {section === 'awards' && (
          <ul className="timeline">
            {profile.awards.map((award) => (
              <li key={award.title.es} className="timeline__item">
                <h3 className="timeline__role">{tr(award.title)}</h3>
                <p className="timeline__meta">{tr(award.detail)}</p>
              </li>
            ))}
          </ul>
        )}
      </MiniTabs>
    </>
  );
}
