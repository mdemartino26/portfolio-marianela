import { useState } from 'react';
import { useLanguage } from '../context/language-context.jsx';
import { getCover, optimizeImageUrl } from '../utils/media-utils.js';
import ProjectModal from './project-modal.jsx';

export default function ProjectCard({ project }) {
  const { t, tr } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const cover = getCover(project);
  const hasDetail = project.media?.length > 0;

  return (
    <article className="project-card" data-aos="fade-up">
      {cover ? (
        <img className="project-card-cover" src={optimizeImageUrl(cover.url, 800)} alt="" loading="lazy" />
      ) : (
        <div className="project-card-cover project-card-placeholder" aria-hidden="true">
          {'{ }'}
        </div>
      )}

      <div className="project-card-body">
        <p className="project-card-category text-mint">{t(`projects.categories.${project.category}`)}</p>
        <h3 className="project-card-title">{tr(project.title)}</h3>
        <p className="project-card-description muted">{tr(project.description)}</p>

        {hasDetail && (
          <button type="button" className="project-card-link" onClick={() => setIsOpen(true)}>
            {t('projects.view')} →
          </button>
        )}
        {!hasDetail && project.link && (
          <a className="project-card-link" href={project.link} target="_blank" rel="noopener noreferrer">
            {t('projects.visit')} ↗
          </a>
        )}
      </div>

      {isOpen && <ProjectModal project={project} onClose={() => setIsOpen(false)} />}
    </article>
  );
}
