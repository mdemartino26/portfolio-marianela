import { createContext, useContext, useEffect, useState } from 'react';
import es from '../i18n/es.json';
import en from '../i18n/en.json';

const texts = { es, en };
const STORAGE_KEY = 'portfolio-lang';

const LanguageContext = createContext(null);

function getStartLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    // localStorage can be blocked (private mode)
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getStartLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // no saving, that's ok
    }
  }, [lang]);

  // t('nav.about') → interface text in the active language
  function t(key) {
    const find = (dictionary) => key.split('.').reduce((node, part) => node?.[part], dictionary);
    return find(texts[lang]) ?? find(texts.es) ?? key;
  }

  // tr({ es, en }) → bilingual content. Plain strings are returned as they are.
  function tr(value) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.es || value.en || '';
  }

  function toggleLang() {
    setLang(lang === 'es' ? 'en' : 'es');
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, tr }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
