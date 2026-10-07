// Utilidades para los archivos de un proyecto.

export const LIMITS = {
  image: 10 * 1024 * 1024,
  video: 100 * 1024 * 1024,
  pdf: 10 * 1024 * 1024,
};

export function kindOf(file) {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type === 'application/pdf') return 'pdf';
  return null;
}

// Reduce las imágenes grandes antes de subirlas (ahorra espacio y carga más rápido).
// Los GIF y SVG se dejan tal cual. Si algo falla, se sube el original.
export async function optimizeImage(file, maxSide = 2000, quality = 0.86) {
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

// Convierte un link de YouTube o Vimeo en URL para <iframe>. Devuelve null si no aplica.
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
    // URL inválida
  }
  return null;
}

export function getCover(project) {
  return project.media?.find((m) => m.kind === 'image') ?? null;
}

// "https://www.behance.net/x" → "Behance"
export function linkLabel(link) {
  try {
    const host = new URL(link).hostname.replace(/^www\./, '').split('.')[0];
    return host.charAt(0).toUpperCase() + host.slice(1);
  } catch {
    return '';
  }
}

// Pide a Cloudinary formato y calidad automáticos (WebP/AVIF) y, opcional, un ancho máximo.
export function optimizedImage(url, width) {
  if (!url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) return url;
  const t = `f_auto,q_auto${width ? `,w_${width}` : ''}`;
  return url.replace('/image/upload/', `/image/upload/${t}/`);
}
