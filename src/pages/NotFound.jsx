import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import './pages.css';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <section className="page-header">
      <p className="eyebrow">( 404 )</p>
      <h1 className="display">{t('notFound.title')}</h1>
      <p className="lead muted">{t('notFound.text')}</p>
      <div className="btn-row">
        <Link className="btn" to="/">
          <span aria-hidden="true">←</span> {t('notFound.back')}
        </Link>
      </div>
    </section>
  );
}
