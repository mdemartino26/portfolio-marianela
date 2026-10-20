// Helpers for the files of a project.

export const SIZE_LIMITS = {
  image: 10 * 1024 * 1024,
  video: 100 * 1024 * 1024,
  pdf: 10 * 1024 * 1024,
};

export function getFileKind(file) {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type === 'application/pdf') return 'pdf';
  return null;
}

export function formatSize(bytes) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

// Makes big images smaller before uploading. GIF and SVG are left as they are.
export async function shrinkImage(file, maxSide = 2000, quality = 0.86) {
  if (!file.type.startsWith('image/') || /gif|svg/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' });
  } catch {
    return file;
  }
}

// Turns a YouTube or Vimeo link into an <iframe> URL. Returns null if it isn't one.
export function toEmbedUrl(raw) {
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
    if (host.endsWith('youtube.com')) {
      const id = url.searchParams.get('v') || url.pathname.split('/').pop();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === 'vimeo.com') return `https://player.vimeo.com/video/${url.pathname.split('/').pop()}`;
  } catch {
    // invalid URL
  }
  return null;
}

export function getCover(project) {
  return project.media?.find((item) => item.kind === 'image') ?? null;
}

// Asks Cloudinary for automatic format and quality, and an optional max width.
export function optimizeImageUrl(url, width) {
  if (!url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) return url;
  const options = `f_auto,q_auto${width ? `,w_${width}` : ''}`;
  return url.replace('/image/upload/', `/image/upload/${options}/`);
}
