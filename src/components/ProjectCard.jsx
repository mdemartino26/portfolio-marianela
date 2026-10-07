import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getCover, optimizedImage } from '../utils/media.js';
import ProjectModal from './ProjectModal.jsx';

export default function ProjectCard({ project, index = 0 }) {
  const { t, tr } = useLanguage();
  const [open, setOpen] = useState(false);
  const category = t(`portfolio.categories.${project.category}`);
  const cover = getCover(project);
  const hasDetail = Boolean(project.media?.length);

  return (
    <article
      className={`project-card ${project.sample ? 'project-card--sample' : ''}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {cover && (
        <img
          className="project-card__cover"
          src={optimizedImage(cover.url, 900)}
          alt=""
          loading="lazy"
          onClick={() => setOpen(true)}
        />
      )}
      <div className="project-card__text">
        <p className="project-card__category">( {category} )</p>
        <h3 className="project-card__title">{tr(project.title)}</h3>
        <p className="project-card__description">{tr(project.description)}</p>
      </div>

      {hasDetail ? (
        <button type="button" className="project-card__link project-card__button" onClick={() => setOpen(true)}>
          {t('portfolio.view')} <span aria-hidden="true">→</span>
        </button>
      ) : (
        project.link && (
          <a className="project-card__link" href={project.link} target="_blank" rel="noopener noreferrer">
            {t('portfolio.view')} <span aria-hidden="true">↗</span>
          </a>
        )
      )}

      {open && <ProjectModal project={project} onClose={() => setOpen(false)} />}
    </article>
  );
}
