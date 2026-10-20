// Uploads a file from the browser to Cloudinary using an "unsigned upload preset".
const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const isCloudinaryReady = Boolean(CLOUD && PRESET);

// kind: 'image' | 'video' | 'pdf'. Uses XMLHttpRequest because fetch can't report progress.
export function uploadFile({ file, kind, onProgress }) {
  if (!isCloudinaryReady) {
    return Promise.reject(new Error('Cloudinary is not configured (see .env.example)'));
  }

  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', PRESET);
    form.append('folder', 'portfolio');

    const request = new XMLHttpRequest();
    request.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) onProgress(event.loaded / event.total);
    };
    request.onerror = () => reject(new Error('Network error while uploading to Cloudinary'));
    request.onload = () => {
      let data = {};
      try {
        data = JSON.parse(request.responseText);
      } catch {
        // not a JSON answer
      }
      if (request.status >= 200 && request.status < 300 && data.secure_url) {
        resolve({ kind, name: file.name, url: data.secure_url });
      } else {
        reject(new Error(data.error?.message || `Cloudinary answered ${request.status}`));
      }
    };
    request.send(form);
  });
}
