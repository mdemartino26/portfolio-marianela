import { useLanguage } from '../context/LanguageContext.jsx';

export default function LanguageToggle() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <button
      type="button"
      className="lang-toggle"
      data-lang={lang}
      onClick={toggleLang}
      aria-label={`${t('lang.label')}: ${t(lang === 'es' ? 'lang.en' : 'lang.es')}`}
    >
      <span className="lang-toggle__thumb" aria-hidden="true" />
      <span className="lang-toggle__option" aria-hidden="true">ES</span>
      <span className="lang-toggle__option" aria-hidden="true">EN</span>
    </button>
  );
}
