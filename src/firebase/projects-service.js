import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase-config.js';

const COLLECTION = 'projects';

// Listens to the collection in real time. Returns the function to stop listening.
export function listenToProjects(onData, onError) {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    onError
  );
}

// Creates the project id before uploading files.
export function createProjectId() {
  return doc(collection(db, COLLECTION)).id;
}

// title and description are { es, en }. Old projects saved as plain text still work.
// media: [{ kind, name, url }]. The first image is the cover.
export function saveProject(id, { title, description, link, category, media }) {
  return setDoc(doc(db, COLLECTION, id), {
    title,
    description,
    link,
    category,
    media,
    createdAt: serverTimestamp(),
  });
}

// Files stay in Cloudinary; delete them by hand from its Media Library if needed.
export function deleteProject(id) {
  return deleteDoc(doc(db, COLLECTION, id));
}
