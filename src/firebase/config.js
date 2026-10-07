import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Las credenciales se leen de .env (ver .env.example). trim() evita fallos por espacios.
const env = (value) => (typeof value === 'string' ? value.trim().replace(/^["']|["']$/g, '') : value);

const firebaseConfig = {
  apiKey: env(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: env(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: env(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: env(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: env(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: env(import.meta.env.VITE_FIREBASE_APP_ID),
};

let db = null;
let auth = null;

// Si faltan credenciales, o son inválidas, el sitio funciona igual con los proyectos locales
// en lugar de romperse.
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (err) {
    console.error('Firebase no se pudo iniciar. Revisá las variables VITE_FIREBASE_*:', err);
    db = null;
    auth = null;
  }
}

export { db, auth };
export const isFirebaseConfigured = Boolean(db && auth);
