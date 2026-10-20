import { useState } from 'react';
import { useLanguage } from '../context/language-context.jsx';
import { useProjects } from '../hooks/use-projects.js';
import { CATEGORIES } from '../data/sample-projects.js';
import SectionTitle from './section-title.jsx';
import ProjectCard from './project-card.jsx';
import './projects-section.css';

export default function ProjectsSection() {
  const { t } = useLanguage();
  const { projects, loading } = useProjects();
  const [filter, setFilter] = useState('all');

  const visibleProjects = filter === 'all' ? projects : projects.filter((project) => project.category === filter);

  return (
    <section id="projects" className="page-section">
      <div className="container">
        <SectionTitle symbol="}" color="purple">
          {t('projects.title')}
        </SectionTitle>

        <div className="projects-filter" role="group" aria-label={t('projects.filterLabel')} data-aos="fade-up">
          {['all', ...CATEGORIES].map((id) => (
            <button
              key={id}
              type="button"
              className={`chip projects-filter-button ${filter === id ? 'is-active' : ''}`}
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              {id === 'all' ? t('projects.all') : t(`projects.categories.${id}`)}
            </button>
          ))}
        </div>

        {loading && <p className="muted">{t('projects.loading')}</p>}

        {!loading && visibleProjects.length === 0 && <p className="muted">{t('projects.empty')}</p>}

        <div className="projects-list">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
