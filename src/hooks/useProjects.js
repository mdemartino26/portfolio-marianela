import { useEffect, useState } from 'react';
import { isFirebaseConfigured } from '../firebase/config.js';
import { subscribeToProjects } from '../firebase/projects.js';
import { sampleProjects } from '../data/sampleProjects.js';

// Proyectos de Firestore en tiempo real, con los locales como respaldo.
export function useProjects() {
  const [remote, setRemote] = useState([]);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;
    return subscribeToProjects(
      (items) => {
        setRemote(items);
        setError(false);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore:', err);
        setError(true);
        setLoading(false);
      }
    );
  }, []);

  const usingSamples = remote.length === 0;

  return {
    projects: usingSamples ? sampleProjects : remote,
    remoteProjects: remote,
    usingSamples,
    loading,
    error,
  };
}
