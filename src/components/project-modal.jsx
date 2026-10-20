import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/language-context.jsx';
import { optimizeImageUrl } from '../utils/media-utils.js';

// Project detail: images, videos, PDFs and the external link.
// It uses <dialog>, so the browser handles focus, the Esc key and the backdrop.
export default function ProjectModal({ project, onClose }) {
  const { t, tr } = useLanguage();
  const dialogRef = useRef(null);
  const title = tr(project.title);

  useEffect(() => {
    dialogRef.current.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  function close() {
    dialogRef.current.close();
  }

  return (
    <dialog
      ref={dialogRef}
      className="project-modal"
      aria-label={title}
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && close()}
    >
      <div className="project-modal-content">
        <div className="project-modal-top">
          <p className="project-card-category text-mint">{t(`projects.categories.${project.category}`)}</p>
          <button type="button" className="button button-ghost button-small" onClick={close}>
            {t('projects.close')} ✕
          </button>
        </div>

        <h2 className="project-modal-title">{title}</h2>
        <p className="muted">{tr(project.description)}</p>

        {project.link && (
          <a className="button project-modal-visit" href={project.link} target="_blank" rel="noopener noreferrer">
            {t('projects.visit')} ↗
          </a>
        )}

        <div className="project-modal-media">
          {(project.media ?? []).map((item) => {
            if (item.kind === 'image') {
              return <img key={item.url} src={optimizeImageUrl(item.url, 1600)} alt={`${title} — ${item.name}`} loading="lazy" />;
            }
            if (item.kind === 'video') {
              return <video key={item.url} src={item.url} controls preload="metadata" />;
            }
            if (item.kind === 'embed') {
              return <iframe key={item.url} src={item.url} title={title} loading="lazy" allowFullScreen />;
            }
            if (item.kind === 'pdf') {
              return (
                <a key={item.url} className="button button-ghost" href={item.url} target="_blank" rel="noopener noreferrer">
                  {t('projects.openPdf')}: {item.name} ↗
                </a>
              );
            }
            return null;
          })}
        </div>
      </div>
    </dialog>
  );
}
