// Shown only while Firestore has no projects. Replace them from the Admin panel.
export const CATEGORIES = ['web', 'uxui', 'branding', 'multimedia'];

export const sampleProjects = [
  {
    id: 'greenmint',
    category: 'uxui',
    title: 'GreenMint',
    description: {
      es: 'Proyecto de UX/UI que obtuvo el 2.º puesto en el UX Challenge.',
      en: 'UX/UI project awarded 2nd place at the UX Challenge.',
    },
    link: '',
  },
  {
    id: 'sample-web',
    category: 'web',
    title: { es: 'Proyecto web de ejemplo', en: 'Sample web project' },
    description: {
      es: 'Tarjeta de ejemplo. Cargá tu proyecto real desde el panel Admin.',
      en: 'Placeholder card. Add your real project from the Admin panel.',
    },
    link: '',
  },
  {
    id: 'sample-multimedia',
    category: 'multimedia',
    title: { es: 'Proyecto multimedia de ejemplo', en: 'Sample multimedia project' },
    description: {
      es: 'Tarjeta de ejemplo. Cargá tu proyecto real desde el panel Admin.',
      en: 'Placeholder card. Add your real project from the Admin panel.',
    },
    link: '',
  },
];
