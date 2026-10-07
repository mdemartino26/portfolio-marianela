// Genera el CV en PDF a partir de src/data/profile.js, en el idioma activo.
// jsPDF se importa de forma dinámica para no cargarlo hasta que se pida.

const INK = [1, 51, 43];
const MINT = [197, 239, 200];
const SAGE = [147, 195, 155];
const BODY = [45, 70, 64];

const MARGIN = 18;
const PT_TO_MM = 0.3528;

// Las fuentes estándar de PDF no incluyen estos caracteres tipográficos.
const clean = (text) =>
  String(text)
    .replace(/[–—]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, '...');

export function cvFileName(profile, lang) {
  return `CV-${profile.name.replace(/\s+/g, '-')}-${lang.toUpperCase()}.pdf`;
}

export async function createCvPdf({ profile, t, tr }) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - MARGIN * 2;
  let y = 0;

  const ensureSpace = (height) => {
    if (y + height > pageHeight - MARGIN) {
      doc.addPage();
      y = MARGIN + 4;
    }
  };

  const write = (text, { size = 10, style = 'normal', color = BODY, gap = 1.5 } = {}) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(clean(text), contentWidth);
    const lineHeight = size * PT_TO_MM * 1.4;
    ensureSpace(lines.length * lineHeight);
    doc.text(lines, MARGIN, y);
    y += lines.length * lineHeight + gap;
  };

  const heading = (text) => {
    y += 5;
    ensureSpace(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...INK);
    doc.text(clean(text).toUpperCase(), MARGIN, y, { charSpace: 0.4 });
    doc.setDrawColor(...SAGE);
    doc.setLineWidth(0.6);
    doc.line(MARGIN, y + 2.2, pageWidth - MARGIN, y + 2.2);
    y += 9;
  };

  // Encabezado
  doc.setFillColor(...INK);
  doc.rect(0, 0, pageWidth, 46, 'F');
  doc.setTextColor(...MINT);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(clean(profile.name), MARGIN, 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11.5);
  doc.text(clean(tr(profile.role)), MARGIN, 30);

  const contactLine = [profile.email, ...Object.values(profile.links)].filter(Boolean).join('   |   ');
  if (contactLine) {
    doc.setFontSize(9);
    doc.text(clean(contactLine), MARGIN, 38);
  }

  y = 56;

  heading(t('cv.profile'));
  profile.bio.forEach((paragraph) => write(tr(paragraph), { gap: 2.5 }));

  heading(t('cv.experience'));
  profile.experience.forEach((job) => {
    const title = [tr(job.role), job.company].filter(Boolean).join(' · ');
    write(title, { size: 11, style: 'bold', color: INK, gap: 0.5 });
    if (job.period) write(job.period, { size: 9, gap: 0.5 });
    write(tr(job.description), { gap: 4 });
  });

  heading(t('cv.education'));
  profile.education.forEach((item) => {
    write(tr(item.title), { size: 11, style: 'bold', color: INK, gap: 0.5 });
    write(`${item.place} · ${tr(item.status)}`, { gap: 4 });
  });

  heading(t('cv.awards'));
  profile.awards.forEach((award) => {
    write(tr(award.title), { size: 11, style: 'bold', color: INK, gap: 0.5 });
    write(tr(award.detail), { gap: 4 });
  });

  heading(t('cv.languages'));
  write(
    profile.languages.map((language) => `${tr(language.name)} (${tr(language.level)})`).join('   ·   ')
  );

  heading(t('cv.skills'));
  profile.skills.forEach((group) => {
    write(`${tr(group.group)}: ${group.items.map(tr).join(', ')}`);
  });

  return doc;
}
