import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useLanguage } from '../context/LanguageContext.jsx';
import { auth, isFirebaseConfigured } from '../firebase/config.js';
import { deleteProject, newProjectId, saveProject } from '../firebase/projects.js';
import { uploadProjectFile } from '../utils/cloudinary.js';
import { useProjects } from '../hooks/useProjects.js';
import { CATEGORIES } from '../routes.js';
import { LIMITS, kindOf, optimizeImage, toEmbedUrl } from '../utils/media.js';
import './pages.css';

const EMPTY_PROJECT = { title: '', description: '', link: '', videoUrl: '', category: CATEGORIES[0] };
const MAX_FILES = 20;

function AdminHeader() {
  const { t } = useLanguage();
  return (
    <header className="page-header">
      <h1 className="display">
        {t('admin.title')} <em>{t('admin.titleEm')}</em>
      </h1>
      <p className="lead">{t('admin.intro')}</p>
    </header>
  );
}

function LoginForm() {
  const { t } = useLanguage();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setFailed(false);
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }

  return (
    <section className="card admin__login">
      <h2 className="section-title">{t('admin.loginTitle')}</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="admin-email">{t('admin.email')}</label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={credentials.email}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="admin-password">{t('admin.password')}</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <div className="btn-row">
          <button type="submit" className="btn" disabled={busy}>
            {busy ? t('admin.loggingIn') : t('admin.login')}
          </button>
        </div>
        {failed && (
          <p className="notice notice--error" role="alert">
            {t('admin.loginError')}
          </p>
        )}
      </form>
    </section>
  );
}

function formatSize(bytes) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

function ProjectForm() {
  const { t } = useLanguage();
  const [project, setProject] = useState(EMPTY_PROJECT);
  const [files, setFiles] = useState([]); // [{ key, file, kind, preview }]
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const inputRef = useRef(null);
  const filesRef = useRef(files);
  filesRef.current = files;

  // Libera las vistas previas al salir de la página.
  useEffect(
    () => () => filesRef.current.forEach((f) => f.preview && URL.revokeObjectURL(f.preview)),
    []
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  }

  function addFiles(fileList) {
    const accepted = [];
    const rejected = [];
    for (const file of Array.from(fileList)) {
      const kind = kindOf(file);
      if (!kind) rejected.push(`${file.name}: ${t('admin.badType')}`);
      else if (file.size > LIMITS[kind]) {
        rejected.push(`${file.name}: ${t('admin.tooBig')} ${formatSize(LIMITS[kind])}`);
      } else {
        accepted.push({
          key: `${file.name}-${file.size}-${file.lastModified}`,
          file,
          kind,
          preview: kind === 'image' ? URL.createObjectURL(file) : null,
        });
      }
    }
    setFiles((prev) => {
      const known = new Set(prev.map((f) => f.key));
      const fresh = accepted.filter((f) => !known.has(f.key));
      return [...prev, ...fresh].slice(0, MAX_FILES);
    });
    setStatus(
      rejected.length ? { type: 'error', message: rejected.join(' · ') } : { type: 'idle', message: '' }
    );
  }

  function removeFile(key) {
    setFiles((prev) => {
      const gone = prev.find((f) => f.key === key);
      if (gone?.preview) URL.revokeObjectURL(gone.preview);
      return prev.filter((f) => f.key !== key);
    });
  }

  function makeCover(key) {
    setFiles((prev) => {
      const picked = prev.find((f) => f.key === key);
      return [picked, ...prev.filter((f) => f.key !== key)];
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const data = {
      title: project.title.trim(),
      description: project.description.trim(),
      link: project.link.trim(),
      category: project.category,
    };
    const videoUrl = project.videoUrl.trim();

    if (!data.title || !data.description) {
      setStatus({ type: 'error', message: t('admin.required') });
      return;
    }
    if (data.link && !/^https?:\/\//i.test(data.link)) {
      setStatus({ type: 'error', message: t('admin.invalidLink') });
      return;
    }
    if (videoUrl && !toEmbedUrl(videoUrl)) {
      setStatus({ type: 'error', message: t('admin.invalidVideo') });
      return;
    }

    setStatus({ type: 'saving', message: '' });
    setProgress(0);
    const projectId = newProjectId();
    const uploaded = [];
    let stage = 'Cloudinary';

    try {
      for (let i = 0; i < files.length; i += 1) {
        const { file, kind } = files[i];
        const body = kind === 'image' ? await optimizeImage(file) : file;
        const item = await uploadProjectFile({
          file: body,
          kind,
          onProgress: (fraction) => setProgress((i + fraction) / files.length),
        });
        uploaded.push(item);
      }
      if (videoUrl) uploaded.push({ kind: 'embed', name: videoUrl, url: toEmbedUrl(videoUrl) });

      stage = 'Firestore';
      await saveProject(projectId, { ...data, media: uploaded });
      files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
      setFiles([]);
      setProject(EMPTY_PROJECT);
      setStatus({ type: 'ok', message: t('admin.saved') });
    } catch (err) {
      console.error(`${stage}:`, err);
      const detail = err?.code || err?.message || 'error desconocido';
      setStatus({ type: 'error', message: `${t('admin.saveError')} [${stage}: ${detail}]` });
    }
  }

  const saving = status.type === 'saving';

  return (
    <section className="split__main">
      <h2 className="section-title admin__heading">{t('admin.newProject')}</h2>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="project-title">{t('admin.fieldTitle')}</label>
          <input
            id="project-title"
            name="title"
            type="text"
            value={project.title}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="project-description">{t('admin.fieldDescription')}</label>
          <textarea
            id="project-description"
            name="description"
            value={project.description}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="project-category">{t('admin.fieldCategory')}</label>
          <select
            id="project-category"
            name="category"
            value={project.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((id) => (
              <option key={id} value={id}>
                {t(`portfolio.categories.${id}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="project-files">{t('admin.fieldFiles')}</label>
          <div
            className={`dropzone ${dragging ? 'dropzone--active' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(e.dataTransfer.files);
            }}
          >
            <p>{t('admin.dropHint')}</p>
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() => inputRef.current?.click()}
              disabled={saving}
            >
              {t('admin.chooseFiles')}
            </button>
            <input
              ref={inputRef}
              id="project-files"
              type="file"
              multiple
              hidden
              accept="image/*,video/*,application/pdf"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = '';
              }}
            />
            <p className="muted dropzone__limits">{t('admin.limits')}</p>
          </div>

          {files.length > 0 && (
            <ul className="upload-list">
              {files.map((item, index) => (
                <li key={item.key} className="upload-item">
                  <div className="upload-item__thumb" aria-hidden="true">
                    {item.preview ? <img src={item.preview} alt="" /> : item.kind.toUpperCase()}
                  </div>
                  <div className="upload-item__text">
                    <strong>{item.file.name}</strong>
                    <span className="muted">
                      {formatSize(item.file.size)}
                      {item.kind === 'image' && index === 0 && ` · ${t('admin.cover')}`}
                    </span>
                  </div>
                  {item.kind === 'image' && index !== 0 && (
                    <button
                      type="button"
                      className="btn btn--ghost btn--small"
                      onClick={() => makeCover(item.key)}
                      disabled={saving}
                    >
                      {t('admin.makeCover')}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    onClick={() => removeFile(item.key)}
                    disabled={saving}
                    aria-label={`${t('admin.remove')} ${item.file.name}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="field">
          <label htmlFor="project-video">{t('admin.fieldVideo')}</label>
          <input
            id="project-video"
            name="videoUrl"
            type="url"
            placeholder="https://youtube.com/…  /  https://vimeo.com/…"
            value={project.videoUrl}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="project-link">{t('admin.fieldLink')}</label>
          <input
            id="project-link"
            name="link"
            type="url"
            placeholder="https://behance.net/…"
            value={project.link}
            onChange={handleChange}
          />
        </div>

        <div className="btn-row">
          <button type="submit" className="btn" disabled={saving}>
            {saving
              ? `${t('admin.saving')} ${files.length ? Math.round(progress * 100) + '%' : ''}`
              : t('admin.save')}
            <span aria-hidden="true">↑</span>
          </button>
        </div>
        {saving && files.length > 0 && (
          <progress className="upload-progress" value={progress} max="1" aria-label={t('admin.saving')} />
        )}
        <div aria-live="polite">
          {status.type === 'ok' && <p className="notice notice--ok">{status.message}</p>}
          {status.type === 'error' && <p className="notice notice--error">{status.message}</p>}
        </div>
      </form>
    </section>
  );
}

function PublishedProjects() {
  const { t } = useLanguage();
  const { remoteProjects } = useProjects();

  async function handleDelete(project) {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    try {
      await deleteProject(project);
    } catch (err) {
      console.error('Firebase:', err);
      window.alert(t('admin.saveError'));
    }
  }

  return (
    <aside className="split__side">
      <section className="card">
        <h2 className="section-title">{t('admin.published')}</h2>
        {remoteProjects.length === 0 ? (
          <p className="muted">{t('admin.none')}</p>
        ) : (
          <ul className="admin__list">
            {remoteProjects.map((project) => (
              <li key={project.id} className="admin__row">
                <div className="admin__row-text">
                  <strong>{project.title}</strong>
                  <span className="muted">
                    {t(`portfolio.categories.${project.category}`)}
                    {project.media?.length ? ` · ${project.media.length} ${t('admin.filesCount')}` : ''}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  onClick={() => handleDelete(project)}
                >
                  {t('admin.delete')}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}

export default function Admin() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;
    return onAuthStateChanged(auth, (current) => {
      setUser(current);
      setChecking(false);
    });
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <>
        <AdminHeader />
        <section className="card admin__login">
          <h2 className="section-title">{t('admin.notConfiguredTitle')}</h2>
          <p>{t('admin.notConfigured')}</p>
        </section>
      </>
    );
  }

  if (checking) {
    return (
      <>
        <AdminHeader />
        <p className="muted">…</p>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <AdminHeader />
        <LoginForm />
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <div className="admin__session">
        <p>
          {t('admin.signedInAs')} <strong>{user.email}</strong>
        </p>
        <button type="button" className="btn btn--ghost btn--small" onClick={() => signOut(auth)}>
          {t('admin.logout')}
        </button>
      </div>
      <div className="split">
        <ProjectForm />
        <PublishedProjects />
      </div>
    </>
  );
}
