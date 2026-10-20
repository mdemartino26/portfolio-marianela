import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useLanguage } from '../context/language-context.jsx';
import { auth } from '../firebase/firebase-config.js';

export default function AdminLogin() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setFailed(false);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }

  return (
    <section className="admin-card admin-login">
      <h2 className="admin-card-title">{t('admin.loginTitle')}</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="admin-email">{t('admin.email')}</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="admin-password">{t('admin.password')}</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit" className="button admin-button" disabled={busy}>
          {busy ? t('admin.loggingIn') : t('admin.login')}
        </button>
        {failed && <p className="notice notice-error">{t('admin.loginError')}</p>}
      </form>
    </section>
  );
}
