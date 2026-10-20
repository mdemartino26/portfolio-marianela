import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useLanguage } from '../context/language-context.jsx';
import { auth, isFirebaseReady } from '../firebase/firebase-config.js';
import SectionTitle from '../components/section-title.jsx';
import AdminLogin from '../components/admin-login.jsx';
import AdminProjectForm from '../components/admin-project-form.jsx';
import AdminProjectList from '../components/admin-project-list.jsx';
import './admin-page.css';

export default function AdminPage() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(isFirebaseReady);

  // Firebase tells us if there is a signed-in user.
  useEffect(() => {
    if (!isFirebaseReady) return undefined;
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });
  }, []);

  function renderContent() {
    if (!isFirebaseReady) return <p className="notice notice-error">{t('admin.notReady')}</p>;
    if (checking) return <p className="muted">…</p>;
    if (!user) return <AdminLogin />;

    return (
      <>
        <div className="admin-session">
          <p className="muted">
            {t('admin.signedInAs')} <strong>{user.email}</strong>
          </p>
          <button type="button" className="button button-ghost button-small" onClick={() => signOut(auth)}>
            {t('admin.logout')}
          </button>
        </div>
        <div className="admin-content">
          <AdminProjectForm />
          <AdminProjectList />
        </div>
      </>
    );
  }

  return (
    <section className="admin-page">
      <div className="container">
        <SectionTitle symbol="⇒" color="coral">
          {t('admin.title')}
        </SectionTitle>
        <p className="muted admin-intro">{t('admin.intro')}</p>
        {renderContent()}
      </div>
    </section>
  );
}
