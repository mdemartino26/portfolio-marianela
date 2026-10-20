import { useEffect, useState } from 'react';
import { isFirebaseReady } from '../firebase/firebase-config.js';
import { listenToProjects } from '../firebase/projects-service.js';
import { sampleProjects } from '../data/sample-projects.js';

// Projects from Firestore in real time. Shows the local samples while it's empty.
export function useProjects() {
  const [remoteProjects, setRemoteProjects] = useState([]);
  const [loading, setLoading] = useState(isFirebaseReady);

  useEffect(() => {
    if (!isFirebaseReady) return undefined;
    return listenToProjects(
      (items) => {
        setRemoteProjects(items);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore:', error);
        setLoading(false);
      }
    );
  }, []);

  const projects = remoteProjects.length > 0 ? remoteProjects : sampleProjects;

  return { projects, remoteProjects, loading };
}
