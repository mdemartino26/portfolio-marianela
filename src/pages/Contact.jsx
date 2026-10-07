import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { profile } from '../data/profile.js';
import './pages.css';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;
const EMPTY_FORM = { name: '', email: '', message: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'name';
  if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'email';
  if (form.message.trim().length < 10) errors.message = 'message';
  return errors;
}

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | mailto | error

  const links = Object.entries(profile.links).filter(([, url]) => url);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // Con Formspree configurado el correo sale desde la web;
    // si no, se abre el cliente de correo con el mensaje armado.
    if (FORMSPREE_ENDPOINT) {
      setStatus('sending');
      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(form),
        });
        if (!response.ok) throw new Error(`Formspree ${response.status}`);
        setForm(EMPTY_FORM);
        setStatus('success');
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
      return;
    }

    if (!profile.email) {
      setStatus('error');
      return;
    }

    const subject = encodeURIComponent(`${t('contact.subject')} — ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n${form.name}\n${form.email}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setStatus('mailto');
  }

  return (
    <>
      <header className="page-header">
        <h1 className="display">
          {t('contact.title')} <em>{t('contact.titleEm')}</em>
        </h1>
        <p className="lead muted">{t('contact.intro')}</p>
      </header>

      <div className="split">
        <section className="split__main">
          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="contact-name">{t('contact.name')}</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
              />
              {errors.name && (
                <p id="contact-name-error" className="field__error">
                  {t('contact.errors.name')}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="contact-email">{t('contact.email')}</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
              />
              {errors.email && (
                <p id="contact-email-error" className="field__error">
                  {t('contact.errors.email')}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="contact-message">{t('contact.message')}</label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
              />
              {errors.message && (
                <p id="contact-message-error" className="field__error">
                  {t('contact.errors.message')}
                </p>
              )}
            </div>

            <div className="btn-row">
              <button type="submit" className="btn" disabled={status === 'sending'}>
                {status === 'sending' ? t('contact.sending') : t('contact.send')}
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <div aria-live="polite">
              {status === 'success' && <p className="notice notice--ok">{t('contact.success')}</p>}
              {status === 'mailto' && <p className="notice notice--ok">{t('contact.mailto')}</p>}
              {status === 'error' && <p className="notice notice--error">{t('contact.error')}</p>}
            </div>
          </form>
        </section>

        {(profile.email || links.length > 0) && (
          <aside className="split__side">
            {profile.email && (
              <section className="card">
                <h2 className="section-title">{t('contact.direct')}</h2>
                <a className="contact__mail" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </section>
            )}
            {links.length > 0 && (
              <section className="card">
                <h2 className="section-title">{t('contact.elsewhere')}</h2>
                <ul className="chip-list">
                  {links.map(([name, url]) => (
                    <li key={name}>
                      <a className="chip chip--link" href={url} target="_blank" rel="noopener noreferrer">
                        {name} <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        )}
      </div>
    </>
  );
}
