import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { linkLabel, optimizedImage } from '../utils/media.js';

// Detalle del proyecto: galería de imágenes, video, PDF y link externo.
// Usa <dialog>: el navegador se ocupa del foco, la tecla Esc y el fondo.
export default function ProjectModal({ project, onClose }) {
  const { t, tr } = useLanguage();
  const dialogRef = useRef(null);
  const title = tr(project.title);
  const category = t(`portfolio.categories.${project.category}`);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const media = project.media ?? [];

  return (
    <dialog
      ref={dialogRef}
      className="project-modal"
      aria-label={title}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}
    >
      <div className="project-modal__body">
        <button
          type="button"
          className="btn btn--ghost btn--small project-modal__close"
          onClick={() => dialogRef.current?.close()}
        >
          {t('portfolio.close')} <span aria-hidden="true">✕</span>
        </button>

        <p className="project-card__category">( {category} )</p>
        <h2 className="project-modal__title">{title}</h2>
        <p className="project-modal__description">{tr(project.description)}</p>

        {project.link && (
          <a className="btn project-modal__visit" href={project.link} target="_blank" rel="noopener noreferrer">
            {t('portfolio.visit')} {linkLabel(project.link)} <span aria-hidden="true">↗</span>
          </a>
        )}

        <div className="project-modal__media">
          {media.map((item) => {
            if (item.kind === 'image') {
              return <img key={item.url} src={optimizedImage(item.url, 1600)} alt={`${title} — ${item.name}`} loading="lazy" />;
            }
            if (item.kind === 'video') {
              return <video key={item.url} src={item.url} controls preload="metadata" />;
            }
            if (item.kind === 'embed') {
              return (
                <iframe
                  key={item.url}
                  src={item.url}
                  title={title}
                  loading="lazy"
                  allow="fullscreen; picture-in-picture"
                  allowFullScreen
                />
              );
            }
            if (item.kind === 'pdf') {
              return (
                <div key={item.url} className="project-modal__pdf">
                  <iframe src={item.url} title={item.name} loading="lazy" />
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {t('portfolio.openPdf')}: {item.name} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </dialog>
  );
}
