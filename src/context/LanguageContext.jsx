import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../i18n/translations.js';

const STORAGE_KEY = 'portfolio-lang';
const LANGS = ['es', 'en'];

const LanguageContext = createContext(null);

function getInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {
    // localStorage puede no estar disponible (modo privado)
  }
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es';
}

function lookup(dictionary, key) {
  return key.split('.').reduce((node, part) => node?.[part], dictionary);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // sin persistencia
    }
  }, [lang]);

  const toggleLang = useCallback(() => setLang((l) => (l === 'es' ? 'en' : 'es')), []);

  // t('nav.home') → texto de interfaz del idioma activo
  const t = useCallback(
    (key) => lookup(translations[lang], key) ?? lookup(translations.es, key) ?? key,
    [lang]
  );

  // tr({ es, en }) → contenido bilingüe; los strings simples pasan tal cual
  const tr = useCallback(
    (value) => {
      if (value == null) return '';
      if (typeof value === 'string') return value;
      return value[lang] ?? value.es ?? '';
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t, tr }),
    [lang, toggleLang, t, tr]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage debe usarse dentro de <LanguageProvider>');
  return ctx;
}
