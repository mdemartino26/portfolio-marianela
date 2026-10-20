import { useRef, useState } from 'react';
import { useLanguage } from '../context/language-context.jsx';
import { createProjectId, saveProject } from '../firebase/projects-service.js';
import { uploadFile } from '../utils/cloudinary-upload.js';
import { CATEGORIES } from '../data/sample-projects.js';
import { SIZE_LIMITS, formatSize, getFileKind, shrinkImage, toEmbedUrl } from '../utils/media-utils.js';

const EMPTY_PROJECT = {
  titleEs: '',
  titleEn: '',
  descriptionEs: '',
  descriptionEn: '',
  category: CATEGORIES[0],
  videoUrl: '',
  link: '',
};
const MAX_FILES = 20;

export default function AdminProjectForm() {
  const { t } = useLanguage();
  const [project, setProject] = useState(EMPTY_PROJECT);
  const [files, setFiles] = useState([]); // [{ key, file, kind, preview }]
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const fileInput = useRef(null);
  const saving = status.type === 'saving';

  function handleChange(event) {
    const { name, value } = event.target;
    setProject({ ...project, [name]: value });
  }

  function addFiles(fileList) {
    const accepted = [];
    const rejected = [];

    for (const file of Array.from(fileList)) {
      const kind = getFileKind(file);
      if (!kind) {
        rejected.push(`${file.name}: ${t('admin.badType')}`);
      } else if (file.size > SIZE_LIMITS[kind]) {
        rejected.push(`${file.name} ${t('admin.tooBig')} ${formatSize(SIZE_LIMITS[kind])}`);
      } else {
        accepted.push({
          key: `${file.name}-${file.size}`,
          file,
          kind,
          preview: kind === 'image' ? URL.createObjectURL(file) : null,
        });
      }
    }

    const knownKeys = files.map((item) => item.key);
    const newFiles = accepted.filter((item) => !knownKeys.includes(item.key));
    setFiles([...files, ...newFiles].slice(0, MAX_FILES));
    setStatus(rejected.length ? { type: 'error', message: rejected.join(' · ') } : { type: 'idle', message: '' });
  }

  function removeFile(key) {
    setFiles(files.filter((item) => item.key !== key));
  }

  // Moves an image to the first place: the first image is the cover.
  function makeCover(key) {
    const picked = files.find((item) => item.key === key);
    setFiles([picked, ...files.filter((item) => item.key !== key)]);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const link = project.link.trim();
    const videoUrl = project.videoUrl.trim();

    if (!project.titleEs.trim() || !project.descriptionEs.trim()) {
      setStatus({ type: 'error', message: t('admin.required') });
      return;
    }
    if (link && !/^https?:\/\//i.test(link)) {
      setStatus({ type: 'error', message: t('admin.invalidLink') });
      return;
    }
    if (videoUrl && !toEmbedUrl(videoUrl)) {
      setStatus({ type: 'error', message: t('admin.invalidVideo') });
      return;
    }

    setStatus({ type: 'saving', message: '' });
    setProgress(0);
    const uploaded = [];
    let step = 'Cloudinary';

    try {
      for (let i = 0; i < files.length; i += 1) {
        const { file, kind } = files[i];
        const body = kind === 'image' ? await shrinkImage(file) : file;
        const item = await uploadFile({
          file: body,
          kind,
          onProgress: (fraction) => setProgress((i + fraction) / files.length),
        });
        uploaded.push(item);
      }
      if (videoUrl) uploaded.push({ kind: 'embed', name: videoUrl, url: toEmbedUrl(videoUrl) });

      step = 'Firestore';
      await saveProject(createProjectId(), {
        title: { es: project.titleEs.trim(), en: project.titleEn.trim() },
        description: { es: project.descriptionEs.trim(), en: project.descriptionEn.trim() },
        category: project.category,
        link,
        media: uploaded,
      });

      setFiles([]);
      setProject(EMPTY_PROJECT);
      setStatus({ type: 'ok', message: t('admin.saved') });
    } catch (error) {
      console.error(`${step}:`, error);
      setStatus({ type: 'error', message: `${t('admin.saveError')} [${step}: ${error?.code || error?.message}]` });
    }
  }

  return (
    <section className="admin-card admin-form">
      <h2 className="admin-card-title">{t('admin.newProject')}</h2>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="admin-form-row">
          <div className="form-field">
            <label htmlFor="title-es">{t('admin.titleEs')}</label>
            <input id="title-es" name="titleEs" value={project.titleEs} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="title-en">{t('admin.titleEn')}</label>
            <input id="title-en" name="titleEn" value={project.titleEn} onChange={handleChange} />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="form-field">
            <label htmlFor="description-es">{t('admin.descriptionEs')}</label>
            <textarea id="description-es" name="descriptionEs" value={project.descriptionEs} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="description-en">{t('admin.descriptionEn')}</label>
            <textarea id="description-en" name="descriptionEn" value={project.descriptionEn} onChange={handleChange} />
          </div>
        </div>
        <p className="muted admin-hint">{t('admin.englishHint')}</p>

        <div className="form-field">
          <label htmlFor="category">{t('admin.category')}</label>
          <select id="category" name="category" value={project.category} onChange={handleChange}>
            {CATEGORIES.map((id) => (
              <option key={id} value={id}>
                {t(`projects.categories.${id}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="files">{t('admin.files')}</label>
          <div
            className="admin-dropzone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              addFiles(event.dataTransfer.files);
            }}
          >
            <p>{t('admin.dropHint')}</p>
            <button
              type="button"
              className="button button-ghost button-small"
              onClick={() => fileInput.current.click()}
              disabled={saving}
            >
              {t('admin.chooseFiles')}
            </button>
            <input
              ref={fileInput}
              id="files"
              type="file"
              multiple
              hidden
              accept="image/*,video/*,application/pdf"
              onChange={(event) => {
                addFiles(event.target.files);
                event.target.value = '';
              }}
            />
            <p className="muted admin-hint">{t('admin.limits')}</p>
          </div>

          {files.length > 0 && (
            <ul className="admin-files">
              {files.map((item, index) => (
                <li key={item.key} className="admin-file">
                  <div className="admin-file-thumb">
                    {item.preview ? <img src={item.preview} alt="" /> : item.kind.toUpperCase()}
                  </div>
                  <div className="admin-file-text">
                    <strong>{item.file.name}</strong>
                    <span className="muted">
                      {formatSize(item.file.size)}
                      {item.kind === 'image' && index === 0 && ` · ${t('admin.cover')}`}
                    </span>
                  </div>
                  {item.kind === 'image' && index !== 0 && (
                    <button type="button" className="button button-ghost button-small" onClick={() => makeCover(item.key)}>
                      {t('admin.makeCover')}
                    </button>
                  )}
                  <button
                    type="button"
                    className="button button-ghost button-small"
                    onClick={() => removeFile(item.key)}
                    aria-label={`${t('admin.remove')} ${item.file.name}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="video-url">{t('admin.video')}</label>
          <input id="video-url" name="videoUrl" type="url" value={project.videoUrl} onChange={handleChange} />
        </div>

        <div className="form-field">
          <label htmlFor="link">{t('admin.link')}</label>
          <input id="link" name="link" type="url" value={project.link} onChange={handleChange} />
        </div>

        <button type="submit" className="button admin-button" disabled={saving}>
          {saving ? `${t('admin.saving')} ${files.length ? Math.round(progress * 100) + '%' : ''}` : t('admin.save')}
        </button>

        <div aria-live="polite">
          {status.type === 'ok' && <p className="notice notice-ok">{status.message}</p>}
          {status.type === 'error' && <p className="notice notice-error">{status.message}</p>}
        </div>
      </form>
    </section>
  );
}
