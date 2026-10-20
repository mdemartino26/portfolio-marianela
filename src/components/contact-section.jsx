import { useState } from 'react';
import { useLanguage } from '../context/language-context.jsx';
import { profile } from '../data/profile-data.js';
import SectionTitle from './section-title.jsx';
import './contact-section.css';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;
const EMPTY_FORM = { name: '', email: '', message: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = true;
  if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = true;
  if (form.message.trim().length < 10) errors.message = true;
  return errors;
}

export default function ContactSection() {
  const { t } = useLanguage();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | mailto | error

  const links = Object.entries(profile.links).filter(([, url]) => url);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: false });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // With Formspree the email is sent from the site. Without it, the visitor's mail app opens.
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
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
      return;
    }

    const subject = encodeURIComponent(`${t('contact.subject')} — ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n${form.name}\n${form.email}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setStatus('mailto');
  }

  return (
    <section id="contact" className="page-section">
      <div className="container">
        <SectionTitle symbol="*" color="coral">
          {t('contact.title')}
        </SectionTitle>

        <div className="contact-content">
          <div className="contact-info" data-aos="fade-up">
            <p className="contact-intro">{t('contact.intro')}</p>
            <a className="contact-email" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <p className="muted">{profile.location}</p>
            {links.length > 0 && (
              <ul className="chip-list">
                {links.map(([name, url]) => (
                  <li key={name}>
                    <a className="chip contact-link" href={url} target="_blank" rel="noopener noreferrer">
                      {name} ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form className="form contact-form" onSubmit={handleSubmit} noValidate data-aos="fade-up" data-aos-delay="120">
            <div className="form-field">
              <label htmlFor="contact-name">{t('contact.name')}</label>
              <input id="contact-name" name="name" type="text" autoComplete="name" value={form.name} onChange={handleChange} />
              {errors.name && <p className="form-error">{t('contact.errors.name')}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="contact-email">{t('contact.email')}</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} />
              {errors.email && <p className="form-error">{t('contact.errors.email')}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="contact-message">{t('contact.message')}</label>
              <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} />
              {errors.message && <p className="form-error">{t('contact.errors.message')}</p>}
            </div>

            <button type="submit" className="button contact-submit" disabled={status === 'sending'}>
              {status === 'sending' ? t('contact.sending') : t('contact.send')} →
            </button>

            <div aria-live="polite">
              {status === 'success' && <p className="notice notice-ok">{t('contact.success')}</p>}
              {status === 'mailto' && <p className="notice notice-ok">{t('contact.mailto')}</p>}
              {status === 'error' && <p className="notice notice-error">{t('contact.error')}</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
