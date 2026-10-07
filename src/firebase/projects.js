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
import { db } from './config.js';

const COLLECTION = 'projects';

// Escucha la colección en tiempo real. Devuelve la función para desuscribirse.
export function subscribeToProjects(onData, onError) {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

// Reserva el id del proyecto antes de subir los archivos.
export function newProjectId() {
  return doc(collection(db, COLLECTION)).id;
}

// media: [{ kind, name, url }]. El orden importa: la primera imagen es la portada.
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

// Borra el proyecto de Firestore. Los archivos quedan en Cloudinary (borrarlos desde el
// navegador exigiría exponer el API secret); se limpian a mano desde su Media Library.
export function deleteProject(project) {
  return deleteDoc(doc(db, COLLECTION, project.id));
}
