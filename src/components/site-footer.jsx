import { useLanguage } from '../context/language-context.jsx';
import { profile } from '../data/profile-data.js';

export default function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <p>
          <span className="text-coral">{'{'}</span> {profile.name} · {new Date().getFullYear()}{' '}
          <span className="text-coral">{'}'}</span>
        </p>
        <p className="muted">{t('footer.made')}</p>
      </div>
    </footer>
  );
}
