import { useLanguage } from '../context/language-context.jsx';
import { useProjects } from '../hooks/use-projects.js';
import { deleteProject } from '../firebase/projects-service.js';

export default function AdminProjectList() {
  const { t, tr } = useLanguage();
  const { remoteProjects } = useProjects();

  async function handleDelete(id) {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    try {
      await deleteProject(id);
    } catch (error) {
      console.error('Firestore:', error);
      window.alert(t('admin.saveError'));
    }
  }

  return (
    <aside className="admin-card admin-list">
      <h2 className="admin-card-title">{t('admin.published')}</h2>

      {remoteProjects.length === 0 && <p className="muted">{t('admin.none')}</p>}

      <ul className="admin-list-items">
        {remoteProjects.map((project) => (
          <li key={project.id} className="admin-list-item">
            <div className="admin-list-text">
              <strong>{tr(project.title)}</strong>
              <span className="muted">
                {t(`projects.categories.${project.category}`)}
                {project.media?.length > 0 && ` · ${project.media.length} ${t('admin.filesCount')}`}
              </span>
            </div>
            <button type="button" className="button button-ghost button-small" onClick={() => handleDelete(project.id)}>
              {t('admin.delete')}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
