import { useState } from 'react';
import MiniTabs from '../components/MiniTabs.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useProjects } from '../hooks/useProjects.js';
import { CATEGORIES } from '../routes.js';
import './pages.css';

export default function Portfolio() {
  const { t } = useLanguage();
  const { projects, usingSamples, loading, error } = useProjects();
  const [category, setCategory] = useState('all');

  const tabs = [
    { id: 'all', label: t('portfolio.all') },
    ...CATEGORIES.map((id) => ({ id, label: t(`portfolio.categories.${id}`) })),
  ];

  const visible =
    category === 'all' ? projects : projects.filter((project) => project.category === category);

  return (
    <>
      <header className="page-header">
        <h1 className="display">
          {t('portfolio.title')}
          <em>{t('portfolio.titleEm')}</em>
        </h1>
        <p className="lead muted">{t('portfolio.intro')}</p>
      </header>

      {error && <p className="notice notice--error portfolio__note">{t('portfolio.error')}</p>}
      {/* aviso solo para quien desarrolla; los visitantes no lo ven */}
      {import.meta.env.DEV && usingSamples && !error && !loading && (
        <p className="notice portfolio__note">{t('portfolio.sampleNote')}</p>
      )}

      <MiniTabs
        tabs={tabs}
        active={category}
        onChange={setCategory}
        label={t('portfolio.tabsLabel')}
      >
        {loading ? (
          <p className="muted">{t('portfolio.loading')}</p>
        ) : visible.length === 0 ? (
          <p className="muted">{t('portfolio.empty')}</p>
        ) : (
          <div className="project-list">
            {visible.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </MiniTabs>
    </>
  );
}
