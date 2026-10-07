// Subida directa desde el navegador a Cloudinary con un "unsigned upload preset".
const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const isCloudinaryConfigured = Boolean(CLOUD && PRESET);

// kind: 'image' | 'video' | 'pdf'. Usa XMLHttpRequest porque fetch no informa el progreso.
export function uploadProjectFile({ file, kind, onProgress }) {
  if (!isCloudinaryConfigured) {
    return Promise.reject(new Error('Cloudinary no está configurado (ver .env.example)'));
  }
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', PRESET);
    form.append('folder', 'portfolio');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded / e.total);
    xhr.onerror = () => reject(new Error('Error de red al subir a Cloudinary'));
    xhr.onload = () => {
      let data = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // respuesta no JSON
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
        resolve({ kind, name: file.name, url: data.secure_url });
      } else {
        reject(new Error(data.error?.message || `Cloudinary respondió ${xhr.status}`));
      }
    };
    xhr.send(form);
  });
}
