// Creates the CV as a PDF from src/data/profile-data.js, in the language the visitor is using.
// jsPDF is loaded only when someone clicks the button, so the site stays light.

// Site colors (same as styles/variables.css) as [red, green, blue]
const DARK = [22, 22, 28];
const LIGHT_TEXT = [232, 230, 225];
const CORAL = [240, 122, 92];
const MINT = [92, 211, 168];
const PURPLE = [199, 125, 222];
const BODY = [55, 55, 64];
const MUTED = [120, 118, 130];

const MARGIN = 18;
const LINE_HEIGHT = 1.45;
const PT_TO_MM = 0.3528;

// The standard PDF fonts don't include these characters, so they are replaced.
function clean(text) {
  return String(text)
    .replace(/[–—]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, '...');
}

export async function downloadCv({ profile, lang, t, tr }) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const textWidth = pageWidth - MARGIN * 2;
  let y = 0;

  // Starts a new page if the next block doesn't fit.
  function makeRoom(height) {
    if (y + height > pageHeight - MARGIN) {
      pdf.addPage();
      y = MARGIN + 4;
    }
  }

  // Writes a paragraph and moves "y" down.
  function write(text, { size = 10, font = 'helvetica', style = 'normal', color = BODY, gap = 1.5, indent = 0 } = {}) {
    pdf.setFont(font, style);
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
    const lines = pdf.splitTextToSize(clean(text), textWidth - indent);
    const height = lines.length * size * PT_TO_MM * LINE_HEIGHT;
    makeRoom(height);
    pdf.text(lines, MARGIN + indent, y);
    y += height + gap;
  }

  // Section title: "{ experience" with a colored symbol, like on the site.
  function heading(symbol, color, text) {
    y += 5;
    makeRoom(18);
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(13);
    pdf.setTextColor(...color);
    pdf.text(symbol, MARGIN, y);
    pdf.setTextColor(...DARK);
    pdf.text(clean(text), MARGIN + 8, y);
    pdf.setDrawColor(225, 224, 228);
    pdf.setLineWidth(0.3);
    pdf.line(MARGIN, y + 2.5, pageWidth - MARGIN, y + 2.5);
    y += 9;
  }

  // ---------- Dark header ----------
  pdf.setFillColor(...DARK);
  pdf.rect(0, 0, pageWidth, 48, 'F');

  pdf.setFont('courier', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(...MINT);
  pdf.text('*', MARGIN, 21);
  pdf.setTextColor(...LIGHT_TEXT);
  pdf.text(clean(profile.name), MARGIN + 7, 21);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10.5);
  pdf.setTextColor(...CORAL);
  pdf.text(clean(tr(profile.role)), MARGIN, 30);

  const contact = [profile.email, profile.location, ...Object.values(profile.links)].filter(Boolean).join('   |   ');
  pdf.setFontSize(8.5);
  pdf.setTextColor(...LIGHT_TEXT);
  pdf.text(pdf.splitTextToSize(clean(contact), textWidth), MARGIN, 39);

  y = 60;

  // ---------- About ----------
  heading('=>', CORAL, t('about.title'));
  profile.bio.forEach((paragraph) => write(tr(paragraph), { gap: 2.5 }));

  // ---------- Experience ----------
  heading('=', MINT, t('experience.title'));
  profile.experience.forEach((job) => {
    let dates = tr(job.start);
    if (job.current) dates += ` - ${t('experience.now')}`;
    if (job.end) dates += ` - ${tr(job.end)}`;

    write(tr(job.role), { size: 11, style: 'bold', color: DARK, gap: 0.5 });
    write(`${job.company}  ·  ${dates}`, { size: 9, color: CORAL, gap: 1.5 });
    job.points.forEach((point) => write(`-  ${tr(point)}`, { size: 9.5, gap: 0.8, indent: 2 }));
    y += 3;
  });

  // ---------- Skills ----------
  heading('{', PURPLE, t('skills.title'));
  profile.skills.forEach((group) => {
    write(`${tr(group.group)}: ${group.items.map(tr).join(', ')}`, { gap: 1.5 });
  });

  // ---------- Education ----------
  heading('~', MINT, t('education.title'));
  profile.education.forEach((item) => {
    write(tr(item.title), { size: 11, style: 'bold', color: DARK, gap: 0.5 });
    write(`${item.place}  ·  ${tr(item.status)}`, { size: 9, color: MUTED, gap: 3 });
  });

  // ---------- Languages & award ----------
  heading('*', CORAL, `${t('about.languagesLabel')} · ${t('about.awardLabel')}`);
  write(profile.languages.map(tr).join('   ·   '), { gap: 2 });
  write(tr(profile.award), { style: 'bold', color: DARK });

  pdf.save(`CV-Marianela-De-Martino-${lang.toUpperCase()}.pdf`);
}
